import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';

/**
 * Get influencer profile by username
 * Route: GET /profile/influencer/:username
 * Public endpoint - no authentication required
 * 
 * @param req - Express request object with username parameter
 * @param res - Express response object
 * @returns Structured influencer profile data including user, influencer, social details, and shop posts
 */
const getInfluencerProfileController = async (req: Request, res: Response) => {
  const { username } = req.params;

  // Validate username parameter
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.error('Username parameter is required and must be a valid string', 400);
  }

  try {
    // Find the influencer social details by username to get the user
    const influencerSocialDetails = await prisma.influencerSocialDetails.findFirst({
      where: {
        username: username.trim(),
        isActive: true, // Only return active social accounts
      },
      select: {
        userId: true,
      },
    });

    if (!influencerSocialDetails) {
      return res.error('Influencer not found with the provided username', 404);
    }

    // Now fetch the complete user data with all social details
    const userData = await prisma.user.findUnique({
      where: {
        id: influencerSocialDetails.userId,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        referralCode: true,
        // Exclude sensitive fields: otp
        influencer: {
          select: {
            id: true,
            categoryId: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            ig_url: true,
            yt_url: true,
            amazon_tag: true,
            is_yt_eligible: true,
            is_insta_eligible: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            shopPosts: {
              select: {
                id: true,
                igPostId: true,
                mediaExpiry: true,
                title: true,
                description: true,
                productUrls: true,
                mediaUrl: true,
                thumbnailUrl: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
        influencerSocialDetails: {
          where: {
            isActive: true, // Only return active social accounts
          },
          select: {
            id: true,
            socialMediaType: true,
            name: true,
            email: true,
            provider: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
            biography: true,
            followers_count: true,
            follows_count: true,
            media_count: true,
            profile_picture_url: true,
            stories: true,
            username: true,
            website: true,
            // Exclude sensitive fields: token, refresh_token, expires_at
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!userData) {
      return res.error('User data not found', 404);
    }

    // Check if user is active
    if (!userData.isActive) {
      return res.error('Influencer profile is not active', 404);
    }

    // Get the first influencer record (there should typically be only one per user)
    const influencer = userData.influencer[0] || null;

    // Structure the response in a clean format
    const response = {
      user: {
        id: userData.id,
        email: userData.email,
        phone: userData.phone,
        isActive: userData.isActive,
        type: userData.type,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        referralCode: userData.referralCode,
      },
      influencer: influencer ? {
        id: influencer.id,
        categoryId: influencer.categoryId,
        name: influencer.name,
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt,
        ig_url: influencer.ig_url,
        yt_url: influencer.yt_url,
        amazon_tag: influencer.amazon_tag,
        is_yt_eligible: influencer.is_yt_eligible,
        is_insta_eligible: influencer.is_insta_eligible,
        category: influencer.category,
      } : null,
      socialDetails: userData.influencerSocialDetails.map(social => ({
        id: social.id,
        socialMediaType: social.socialMediaType,
        name: social.name,
        email: social.email,
        provider: social.provider,
        createdAt: social.createdAt,
        updatedAt: social.updatedAt,
        isActive: social.isActive,
        biography: social.biography,
        followers_count: social.followers_count,
        follows_count: social.follows_count,
        media_count: social.media_count,
        profile_picture_url: social.profile_picture_url,
        stories: social.stories,
        username: social.username,
        website: social.website,
      })),
      shopPosts: influencer?.shopPosts || [],
    };

    res.success(response, 'Influencer profile fetched successfully!');
  } catch (err: unknown) {
    console.error('Error fetching influencer profile:', err);
    res.error('Internal server error while fetching influencer profile', 500, err);
  }
};

export default getInfluencerProfileController; 