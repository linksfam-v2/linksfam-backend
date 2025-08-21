import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

const getShopPostWithViewsController = async (req: Request, res: Response) => {
  const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
  const { influencerId } = req.body;

  try {
    // Get all shop posts for the influencer
    const shopPosts = await prisma.shopPost.findMany({
      where: {
        influencerId: +influencerId,
      },
      orderBy: {
        'createdAt': 'desc'
      }
    });

    const shopPostsWithViews = [];

    for (const shopPost of shopPosts) {
      const productUrlsWithViews = [];

      // Process each product URL to get visit counts
      if (shopPost.productUrls && Array.isArray(shopPost.productUrls)) {
        for (const productUrl of shopPost.productUrls) {
          try {
            // Extract short code from the shortened URL
            const shortCode = productUrl.replace(`${serverInfo.baseUrl}/`, '');
            
            // Skip if it's not a shortened URL from our service
            if (!productUrl.startsWith(serverInfo.baseUrl)) {
              productUrlsWithViews.push({
                url: productUrl,
                visits: 0,
                isShortened: false
              });
              continue;
            }

            // Get visit data from shlink
            const visits = await apiClient.getShortUrlVisits(shortCode, { excludeBots: true });
            const visitCount = visits.data.length;

            productUrlsWithViews.push({
              url: productUrl,
              visits: visitCount,
              isShortened: true,
              shortCode: shortCode,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              botVisits: visits.data.filter((visit: any) => visit.potentialBot).length
            });

          } catch (visitError) {
            console.error(`Error getting visits for ${productUrl}:`, visitError);
            // If we can't get visit data, still include the URL with 0 visits
            productUrlsWithViews.push({
              url: productUrl,
              visits: 0,
              isShortened: productUrl.startsWith(serverInfo.baseUrl),
              error: 'Failed to fetch visit data'
            });
          }
        }
      }

      // Calculate total visits for this shop post
      const totalVisits = productUrlsWithViews.reduce((sum, item) => sum + item.visits, 0);

      shopPostsWithViews.push({
        ...shopPost,
        productUrlsWithViews,
        totalVisits
      });
    }

    res.success(shopPostsWithViews);

  } catch (err: unknown) {
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }
};

export default getShopPostWithViewsController; 