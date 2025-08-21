import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import { updateWebsiteValidation } from '../../../validation/influencer/socialDetails.validation.js';

/**
 * Update website field in InfluencerSocialDetails
 * Route: PUT /api/influencer/social/website
 * Protected endpoint - requires authentication
 * 
 * @param req - Express request object with socialMediaType and website in body
 * @param res - Express response object
 * @returns Updated social details with website field
 */
const updateWebsiteController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const { socialMediaType, website } = req.body;

  try {
    // Validate request body
    const { error } = updateWebsiteValidation.validate(req.body);
    if (error) {
      return res.error(error.details[0].message, 400);
    }

    // Check if the social details record exists for this user and social media type
    const existingSocialDetails = await prisma.influencerSocialDetails.findFirst({
      where: {
        userId: userId,
        socialMediaType: socialMediaType
      }
    });

    if (!existingSocialDetails) {
      return res.error('Social media account not found for this user', 404);
    }

    // Check if the account is active
    if (!existingSocialDetails.isActive) {
      return res.error('Social media account is not active', 400);
    }

    // Update the website field
    const updatedSocialDetails = await prisma.influencerSocialDetails.update({
      where: {
        id: existingSocialDetails.id
      },
      data: {
        website: website || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        socialMediaType: true,
        name: true,
        email: true,
        provider: true,
        isActive: true,
        biography: true,
        followers_count: true,
        follows_count: true,
        media_count: true,
        profile_picture_url: true,
        stories: true,
        username: true,
        website: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.success({
      socialDetails: updatedSocialDetails,
      message: 'Website updated successfully'
    });

  } catch (err: unknown) {
    console.error('Error updating website:', err);
    return res.error('Something went wrong while updating website!', 500, err);
  }
};

export default updateWebsiteController; 