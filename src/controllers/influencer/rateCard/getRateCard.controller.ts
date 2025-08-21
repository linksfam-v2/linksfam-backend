import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Get rate card for an influencer (Public endpoint)
 * Route: GET /api/influencer/rate-card?influencerId=123
 * Public endpoint - no authentication required
 * 
 * @param req - Express request object with influencerId query parameter
 * @param res - Express response object
 * @returns Rate card data
 */
const getRateCardController = async (req: Request, res: Response) => {
  const influencerId = req.query.influencerId as string;

  try {
    // Validate required influencerId parameter
    if (!influencerId || isNaN(Number(influencerId))) {
      return res.error('Valid influencerId query parameter is required', 400);
    }

    const numericInfluencerId = Number(influencerId);

    // Check if the influencer exists
    const influencer = await prisma.influencer.findFirst({
      where: {
        id: numericInfluencerId
      },
      include: {
        user: {
          select: {
            id: true,
            type: true
          }
        }
      }
    });

    if (!influencer) {
      return res.error('Influencer not found', 404);
    }

    // Get the rate card
    const rateCard = await prisma.rateCard.findFirst({
      where: {
        influencerId: numericInfluencerId
      }
    });

    if (!rateCard) {
      return res.error('Rate card not found', 404);
    }

    return res.success({
      influencer: {
        id: influencer.id,
        name: influencer.name,
        city: influencer.city
      },
      rateCard: {
        id: rateCard.id,
        // Instagram Pricing
        reelCharge: rateCard.reelCharge,
        storyCharge: rateCard.storyCharge,
        carouselPostCharge: rateCard.carouselPostCharge,
        linkInBioCharge: rateCard.linkInBioCharge,
        instagramComboPackage: rateCard.instagramComboPackage,
        // YouTube Pricing
        youtubeShortCharge: rateCard.youtubeShortCharge,
        youtubeIntegrationCharge: rateCard.youtubeIntegrationCharge,
        youtubeDedicatedVideoCharge: rateCard.youtubeDedicatedVideoCharge,
        // Other Offers
        customComboPackage: rateCard.customComboPackage,
        // Notes
        minimumCollaborationValue: rateCard.minimumCollaborationValue,
        availableForBarterDeals: rateCard.availableForBarterDeals,
        createdAt: rateCard.createdAt,
        updatedAt: rateCard.updatedAt
      }
    });

  } catch (err: unknown) {
    console.error('Error fetching rate card:', err);
    return res.error('Something went wrong while fetching rate card!', 500, err);
  }
};

export default getRateCardController; 