import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Add rate card for an influencer (Protected endpoint)
 * Route: POST /api/influencer/rate-card
 * Protected endpoint - requires authentication
 * 
 * @param req - Express request object with rate card data
 * @param res - Express response object
 * @returns Created rate card data
 */
const addRateCardController = async (req: Request, res: Response) => {
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
    let influencer = await prisma.influencer.findFirst({
      where: {
        userId: userId
      }
    });

    if (!influencer) {
      const newInfluencer = await prisma.influencer.create({
        data: {
          userId: userId,
          categoryId: 1,
        }
      })
      influencer = newInfluencer;
    }

    // Check if rate card already exists
    const existingRateCard = await prisma.rateCard.findFirst({
      where: {
        influencerId: influencer.id
      }
    });

    if (existingRateCard) {
      return res.error('Rate card already exists. Use update endpoint to modify', 400);
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

    // Create the rate card
    const newRateCard = await prisma.rateCard.create({
      data: {
        influencerId: influencer.id,
        reelCharge: reelCharge ? Number(reelCharge) : null,
        storyCharge: storyCharge ? Number(storyCharge) : null,
        carouselPostCharge: carouselPostCharge ? Number(carouselPostCharge) : null,
        linkInBioCharge: linkInBioCharge ? Number(linkInBioCharge) : null,
        instagramComboPackage: instagramComboPackage ? Number(instagramComboPackage) : null,
        youtubeShortCharge: youtubeShortCharge ? Number(youtubeShortCharge) : null,
        youtubeIntegrationCharge: youtubeIntegrationCharge ? Number(youtubeIntegrationCharge) : null,
        youtubeDedicatedVideoCharge: youtubeDedicatedVideoCharge ? Number(youtubeDedicatedVideoCharge) : null,
        customComboPackage: customComboPackage?.trim() || null,
        minimumCollaborationValue: minimumCollaborationValue ? Number(minimumCollaborationValue) : null,
        availableForBarterDeals: availableForBarterDeals === true
      }
    });

    return res.success({
      id: newRateCard.id,
      // Instagram Pricing
      reelCharge: newRateCard.reelCharge,
      storyCharge: newRateCard.storyCharge,
      carouselPostCharge: newRateCard.carouselPostCharge,
      linkInBioCharge: newRateCard.linkInBioCharge,
      instagramComboPackage: newRateCard.instagramComboPackage,
      // YouTube Pricing
      youtubeShortCharge: newRateCard.youtubeShortCharge,
      youtubeIntegrationCharge: newRateCard.youtubeIntegrationCharge,
      youtubeDedicatedVideoCharge: newRateCard.youtubeDedicatedVideoCharge,
      // Other Offers
      customComboPackage: newRateCard.customComboPackage,
      // Notes
      minimumCollaborationValue: newRateCard.minimumCollaborationValue,
      availableForBarterDeals: newRateCard.availableForBarterDeals,
      influencerId: newRateCard.influencerId,
      createdAt: newRateCard.createdAt,
      updatedAt: newRateCard.updatedAt
    }, 'Rate card created successfully');

  } catch (err: unknown) {
    console.error('Error creating rate card:', err);
    return res.error('Something went wrong while creating the rate card!', 500, err);
  }
};

export default addRateCardController; 