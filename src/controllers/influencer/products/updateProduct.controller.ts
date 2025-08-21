import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Update an existing product for an influencer
 * Route: PUT /api/influencer/products/:productId
 * Protected endpoint - requires authentication
 * 
 * @param req - Express request object with product data and productId parameter
 * @param res - Express response object
 * @returns Updated product data
 */
const updateProductController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const { productId } = req.params;
  const { 
    productUrl, 
    productName, 
    imageUrl, 
    productDescription, 
    sitename, 
    price 
  } = req.body;

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
      return res.error('Product not found or you do not have permission to update this product', 404);
    }

    // Validate price if provided
    if (price !== undefined && price !== null) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.error('Price must be a valid non-negative number', 400);
      }
    }

    // Build update data object with only provided fields
    const updateData: {
      productUrl?: string;
      productName?: string | null;
      imageUrl?: string | null;
      productDescription?: string | null;
      sitename?: string | null;
      price?: number | null;
    } = {};
    
    if (productUrl !== undefined) updateData.productUrl = productUrl;
    if (productName !== undefined) updateData.productName = productName.trim() || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim() || null;
    if (productDescription !== undefined) updateData.productDescription = productDescription?.trim() || null;
    if (sitename !== undefined) updateData.sitename = sitename?.trim() || null;
    if (price !== undefined) updateData.price = price ? Number(price) : null;

    // Update the product
    const updatedProduct = await prisma.products.update({
      where: {
        id: numericProductId
      },
      data: updateData
    });

    return res.success({
      id: updatedProduct.id,
      productUrl: updatedProduct.productUrl,
      productName: updatedProduct.productName,
      imageUrl: updatedProduct.imageUrl,
      productDescription: updatedProduct.productDescription,
      sitename: updatedProduct.sitename,
      price: updatedProduct.price,
      influencerId: updatedProduct.influencerId,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    }, 'Product updated successfully');

  } catch (err: unknown) {
    console.error('Error updating product:', err);
    return res.error('Something went wrong while updating the product!', 500, err);
  }
};

export default updateProductController; 