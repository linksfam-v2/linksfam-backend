import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Update rate card for an influencer (Protected endpoint)
 * Route: PUT /api/influencer/rate-card
 * Protected endpoint - requires authentication
 * 
 * @param req - Express request object with rate card data
 * @param res - Express response object
 * @returns Updated rate card data
 */
const updateRateCardController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const { 
    reelCharge,
    storyCharge,
    carouselPostCharge,
    linkInBioCharge,
    instagramComboPackage,
    youtubeShortCharge,
    youtubeIntegrationCharge,
    youtubeDedicatedVideoCharge,
    customComboPackage,
    minimumCollaborationValue,
    availableForBarterDeals
  } = req.body;

  try {
    // Find the influencer associated with this user
    const influencer = await prisma.influencer.findFirst({
      where: {
        userId: userId
      }
    });

    if (!influencer) {
      return res.error('Influencer profile not found', 404);
    }

    // Check if rate card exists
    const existingRateCard = await prisma.rateCard.findFirst({
      where: {
        influencerId: influencer.id
      }
    });

    if (!existingRateCard) {
      return res.error('Rate card not found. Use create endpoint to add new rate card', 404);
    }

    // Validate numeric fields if provided
    const numericFields = [
      'reelCharge', 'storyCharge', 'carouselPostCharge', 'linkInBioCharge',
      'instagramComboPackage', 'youtubeShortCharge', 'youtubeIntegrationCharge',
      'youtubeDedicatedVideoCharge', 'minimumCollaborationValue'
    ];

    for (const field of numericFields) {
      const value = req.body[field];
      if (value !== undefined && value !== null) {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0) {
          return res.error(`${field} must be a valid non-negative number`, 400);
        }
      }
    }

    // Prepare update data - only include fields that are provided
    const updateData: {
      reelCharge?: number | null;
      storyCharge?: number | null;
      carouselPostCharge?: number | null;
      linkInBioCharge?: number | null;
      instagramComboPackage?: number | null;
      youtubeShortCharge?: number | null;
      youtubeIntegrationCharge?: number | null;
      youtubeDedicatedVideoCharge?: number | null;
      customComboPackage?: string | null;
      minimumCollaborationValue?: number | null;
      availableForBarterDeals?: boolean;
    } = {};

    if (reelCharge !== undefined) {
      updateData.reelCharge = reelCharge ? Number(reelCharge) : null;
    }
    if (storyCharge !== undefined) {
      updateData.storyCharge = storyCharge ? Number(storyCharge) : null;
    }
    if (carouselPostCharge !== undefined) {
      updateData.carouselPostCharge = carouselPostCharge ? Number(carouselPostCharge) : null;
    }
    if (linkInBioCharge !== undefined) {
      updateData.linkInBioCharge = linkInBioCharge ? Number(linkInBioCharge) : null;
    }
    if (instagramComboPackage !== undefined) {
      updateData.instagramComboPackage = instagramComboPackage ? Number(instagramComboPackage) : null;
    }
    if (youtubeShortCharge !== undefined) {
      updateData.youtubeShortCharge = youtubeShortCharge ? Number(youtubeShortCharge) : null;
    }
    if (youtubeIntegrationCharge !== undefined) {
      updateData.youtubeIntegrationCharge = youtubeIntegrationCharge ? Number(youtubeIntegrationCharge) : null;
    }
    if (youtubeDedicatedVideoCharge !== undefined) {
      updateData.youtubeDedicatedVideoCharge = youtubeDedicatedVideoCharge ? Number(youtubeDedicatedVideoCharge) : null;
    }
    if (customComboPackage !== undefined) {
      updateData.customComboPackage = customComboPackage?.trim() || null;
    }
    if (minimumCollaborationValue !== undefined) {
      updateData.minimumCollaborationValue = minimumCollaborationValue ? Number(minimumCollaborationValue) : null;
    }
    if (availableForBarterDeals !== undefined) {
      updateData.availableForBarterDeals = availableForBarterDeals === true;
    }

    // Update the rate card
    const updatedRateCard = await prisma.rateCard.update({
      where: {
        id: existingRateCard.id
      },
      data: updateData
    });

    return res.success({
      id: updatedRateCard.id,
      // Instagram Pricing
      reelCharge: updatedRateCard.reelCharge,
      storyCharge: updatedRateCard.storyCharge,
      carouselPostCharge: updatedRateCard.carouselPostCharge,
      linkInBioCharge: updatedRateCard.linkInBioCharge,
      instagramComboPackage: updatedRateCard.instagramComboPackage,
      // YouTube Pricing
      youtubeShortCharge: updatedRateCard.youtubeShortCharge,
      youtubeIntegrationCharge: updatedRateCard.youtubeIntegrationCharge,
      youtubeDedicatedVideoCharge: updatedRateCard.youtubeDedicatedVideoCharge,
      // Other Offers
      customComboPackage: updatedRateCard.customComboPackage,
      // Notes
      minimumCollaborationValue: updatedRateCard.minimumCollaborationValue,
      availableForBarterDeals: updatedRateCard.availableForBarterDeals,
      influencerId: updatedRateCard.influencerId,
      createdAt: updatedRateCard.createdAt,
      updatedAt: updatedRateCard.updatedAt
    }, 'Rate card updated successfully');

  } catch (err: unknown) {
    console.error('Error updating rate card:', err);
    return res.error('Something went wrong while updating the rate card!', 500, err);
  }
};

export default updateRateCardController; 