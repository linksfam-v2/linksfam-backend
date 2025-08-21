import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const deleteShopPostController = async (req: Request, res: Response) => {
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

    // Check if the shop post exists and belongs to this influencer
    const existingPost = await prisma.shopPost.findFirst({
      where: {
        id: postId,
        influencerId: influencer.id
      }
    });

    if (!existingPost) {
      return res.error('Shop post not found or you do not have permission to delete it', 404);
    }

    // Delete the shop post
    await prisma.shopPost.delete({
      where: {
        id: postId
      }
    });

    return res.success({ message: 'Shop post deleted successfully' });
  } catch (err: unknown) {
    return res.error('Something went wrong!', 500, err);
  }
};

export default deleteShopPostController; 