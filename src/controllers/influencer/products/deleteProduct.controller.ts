import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Delete a product for an influencer
 * Route: DELETE /api/influencer/products/:productId
 * Protected endpoint - requires authentication
 * 
 * @param req - Express request object with productId parameter
 * @param res - Express response object
 * @returns Success message or error
 */
const deleteProductController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const { productId } = req.params;

  try {
    // Validate productId parameter
    if (!productId || isNaN(Number(productId))) {
      return res.error('Valid product ID is required', 400);
    }

    const numericProductId = Number(productId);

    // Find the influencer associated with this user
    const influencer = await prisma.influencer.findFirst({
      where: {
        userId: userId
      }
    });

    if (!influencer) {
      return res.error('Influencer profile not found', 404);
    }

    // Check if the product exists and belongs to this influencer
    const existingProduct = await prisma.products.findFirst({
      where: {
        id: numericProductId,
        influencerId: influencer.id
      }
    });

    if (!existingProduct) {
      return res.error('Product not found or you do not have permission to delete this product', 404);
    }

    // Delete the product
    await prisma.products.delete({
      where: {
        id: numericProductId
      }
    });

    return res.success({
      deletedProductId: numericProductId,
      productName: existingProduct.productName,
      deletedAt: new Date()
    }, 'Product deleted successfully');

  } catch (err: unknown) {
    console.error('Error deleting product:', err);
    return res.error('Something went wrong while deleting the product!', 500, err);
  }
};

export default deleteProductController; 