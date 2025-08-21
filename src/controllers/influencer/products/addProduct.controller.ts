import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Add a new product for an influencer
 * Route: POST /api/influencer/products
 * Protected endpoint - requires authentication
 * 
 * @param req - Express request object with product data
 * @param res - Express response object
 * @returns Created product data
 */
const addProductController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const { 
    productUrl, 
    productName, 
    imageUrl, 
    productDescription, 
    sitename, 
    price 
  } = req.body;

  try {
    // Validate required fields (only productUrl is required now)
    if (!productUrl) {
      return res.error('Product URL is required', 400);
    }

    // Validate URL format for productUrl
    try {
      new URL(productUrl);
    } catch {
      return res.error('Invalid URL format for product URL', 400);
    }

    // Validate imageUrl format if provided
    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        return res.error('Invalid URL format for image URL', 400);
      }
    }

    // Find the influencer associated with this user
    const influencer = await prisma.influencer.findFirst({
      where: {
        userId: userId
      }
    });

    if (!influencer) {
      return res.error('Influencer profile not found', 404);
    }

    // Validate price if provided
    if (price !== undefined && price !== null) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.error('Price must be a valid non-negative number', 400);
      }
    }

    // Create the product
    const newProduct = await prisma.products.create({
      data: {
        productUrl,
        productName: productName?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        productDescription: productDescription?.trim() || null,
        sitename: sitename?.trim() || null,
        price: price ? Number(price) : null,
        influencerId: influencer.id
      }
    });

    return res.success({
      id: newProduct.id,
      productUrl: newProduct.productUrl,
      productName: newProduct.productName,
      imageUrl: newProduct.imageUrl,
      productDescription: newProduct.productDescription,
      sitename: newProduct.sitename,
      price: newProduct.price,
      influencerId: newProduct.influencerId,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt
    }, 'Product added successfully');

  } catch (err: unknown) {
    console.error('Error adding product:', err);
    return res.error('Something went wrong while adding the product!', 500, err);
  }
};

export default addProductController; 