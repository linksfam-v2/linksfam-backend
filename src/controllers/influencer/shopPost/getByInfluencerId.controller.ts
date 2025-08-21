import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const getShopPostsByInfluencerIdController = async (req: Request, res: Response) => {
  const influencerId = Number(req.params.influencerId);
  // Parse pagination parameters, with defaults
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

  if (isNaN(influencerId)) {
    return res.error('Invalid influencer ID', 400);
  }

  // Validate pagination parameters
  if (isNaN(limit) || limit < 1) {
    return res.error('Invalid limit parameter', 400);
  }

  if (isNaN(skip) || skip < 0) {
    return res.error('Invalid skip parameter', 400);
  }

  try {
    // Check if influencer exists
    const influencer = await prisma.influencer.findUnique({
      where: {
        id: influencerId
      }
    });

    if (!influencer) {
      return res.error('Influencer not found', 404);
    }
    // Get shop posts for the specified influencer with pagination
    const shopPosts = await prisma.shopPost.findMany({
      where: {
        influencerId: influencerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: skip
    });

    return res.success(shopPosts);
  } catch (err: unknown) {
    return res.error('Something went wrong!', 500, err);
  }
};

export default getShopPostsByInfluencerIdController; 