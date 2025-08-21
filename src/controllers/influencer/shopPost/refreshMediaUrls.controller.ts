import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import axios from 'axios';
import { InstagramMediaResponse } from '../../../utility/instagramApiTypes.js';

const refreshMediaUrlsController = async (req: Request, res: Response) => {
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.error('Invalid shop post ID', 400);
  }

  try {
    // Get the specific shop post with influencer details
    const shopPost = await prisma.shopPost.findFirst({
      where: {
        id: postId
      },
      include: {
        influencer: {
          include: {
            user: true
          }
        }
      }
    });

    if (!shopPost) {
      return res.error('Shop post not found', 404);
    }

    if (!shopPost.igPostId) {
      return res.error('Instagram post ID not found for this shop post', 400);
    }

    // Get the Instagram social details for this influencer
    const instagramSocialDetail = await prisma.influencerSocialDetails.findFirst({
      where: {
        userId: shopPost.influencer.userId,
        socialMediaType: 'instagram',
        isActive: true
      }
    });

    if (!instagramSocialDetail) {
      return res.error('Active Instagram account not found for this influencer', 404);
    }

    // Fetch fresh URLs from Instagram Graph API
    const response = await axios.get<InstagramMediaResponse>(`https://graph.instagram.com/v22.0/${shopPost.igPostId}`, {
      params: {
        access_token: instagramSocialDetail.token,
        fields: 'id,media_type,media_url,thumbnail_url'
      },
      timeout: 10000 // 10 second timeout
    });

    const { media_url, thumbnail_url } = response.data;

    // Calculate new expiry date (2 days from now)
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 2);

    // Update the shop post with new URLs and expiry date
    const updatedShopPost = await prisma.shopPost.update({
      where: {
        id: postId
      },
      data: {
        mediaUrl: media_url || shopPost.mediaUrl, // Keep existing if new one is null
        thumbnailUrl: thumbnail_url || shopPost.thumbnailUrl, // Keep existing if new one is null
        mediaExpiry: newExpiryDate
      }
    });

    return res.success(updatedShopPost, 'Media URLs refreshed successfully');

  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
    
    // Handle specific Instagram API errors
    if (axiosError.response?.status === 404) {
      return res.error('Instagram post not found - may have been deleted', 404);
    } else if (axiosError.response?.status === 403) {
      return res.error('Access forbidden - Instagram token may be invalid', 403);
    } else if (axiosError.response?.status === 401) {
      return res.error('Unauthorized - Instagram token may be expired', 401);
    }

    console.error('Error refreshing media URLs:', axiosError.response?.data || axiosError.message);
    return res.error('Something went wrong while refreshing media URLs!', 500, error);
  }
};

export default refreshMediaUrlsController; 