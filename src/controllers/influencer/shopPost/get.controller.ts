import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const getShopPostsController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  // Parse pagination parameters, with defaults
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

  // Validate pagination parameters
  if (isNaN(limit) || limit < 1) {
    return res.error('Invalid limit parameter', 400);
  }

  if (isNaN(skip) || skip < 0) {
    return res.error('Invalid skip parameter', 400);
  }

  try {
    // Find the influencer associated with this user
    const influencer = await prisma.influencer.findFirst({
      where: {
        userId: userId
      }
    });

    if (!influencer) {
      return res.error('Influencer not found', 404);
    }

    // Get all shop posts for this influencer with pagination
    const shopPosts = await prisma.shopPost.findMany({
      where: {
        influencerId: influencer.id
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

export default getShopPostsController; 