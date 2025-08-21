import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

/**
 * Get all products for an influencer with pagination (Public endpoint)
 * Route: GET /api/influencer/products?influencerId=123&skip=0&limit=10
 * Public endpoint - no authentication required
 * 
 * @param req - Express request object with influencerId and optional skip/limit query params
 * @param res - Express response object
 * @returns Paginated list of products
 */
const getProductsController = async (req: Request, res: Response) => {
  // Get influencerId from query parameters
  const influencerId = req.query.influencerId as string;
  
  // Get pagination parameters from query string
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Max 50 products per request

  try {
    // Validate required influencerId parameter
    if (!influencerId || isNaN(Number(influencerId))) {
      return res.error('Valid influencerId query parameter is required', 400);
    }

    const numericInfluencerId = Number(influencerId);

    // Validate pagination parameters
    if (skip < 0) {
      return res.error('Skip parameter must be non-negative', 400);
    }
    
    if (limit <= 0) {
      return res.error('Limit parameter must be positive', 400);
    }

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

    // Get total count of products
    const totalProducts = await prisma.products.count({
      where: {
        influencerId: numericInfluencerId
      }
    });

    // Get paginated products
    const products = await prisma.products.findMany({
      where: {
        influencerId: numericInfluencerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: skip,
      take: limit
    });

    const hasMore = skip + limit < totalProducts;

    return res.success({
      influencer: {
        id: influencer.id,
        name: influencer.name,
        city: influencer.city
      },
      products: products.map(product => ({
        id: product.id,
        productUrl: product.productUrl,
        productName: product.productName,
        imageUrl: product.imageUrl,
        productDescription: product.productDescription,
        sitename: product.sitename,
        price: product.price,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
      pagination: {
        skip: skip,
        limit: limit,
        total: totalProducts,
        returned: products.length,
        hasMore: hasMore,
        nextSkip: hasMore ? skip + limit : null
      }
    });

  } catch (err: unknown) {
    console.error('Error fetching products:', err);
    return res.error('Something went wrong while fetching products!', 500, err);
  }
};

export default getProductsController; 