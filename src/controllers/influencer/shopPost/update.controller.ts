import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import { updateShopPostValidation } from '../../../validation/influencer/shopPost.validation.js';

const updateShopPostController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.error('Invalid shop post ID', 400);
  }

  try {
    // Validate request body
    const { error } = updateShopPostValidation.validate(req.body);
    if (error) {
      return res.error(error.message, 400);
    }

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
      return res.error('Shop post not found or you do not have permission to update it', 404);
    }

    // Update the shop post
    const updatedPost = await prisma.shopPost.update({
      where: {
        id: postId
      },
      data: req.body
    });

    return res.success(updatedPost);
  } catch (err: unknown) {
    return res.error('Something went wrong!', 500, err);
  }
};

export default updateShopPostController; 