import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const getShopPostByIdController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.error('Invalid shop post ID', 400);
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

    // Get the specific shop post
    const shopPost = await prisma.shopPost.findFirst({
      where: {
        id: postId,
        influencerId: influencer.id
      }
    });

    if (!shopPost) {
      return res.error('Shop post not found', 404);
    }

    return res.success(shopPost);
  } catch (err: unknown) {
    return res.error('Something went wrong!', 500, err);
  }
};

export default getShopPostByIdController; 