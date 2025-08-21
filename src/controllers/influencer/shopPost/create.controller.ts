import { Request, Response } from 'express';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { prisma } from '../../../db/db.js';
import { createShopPostValidation } from '../../../validation/influencer/shopPost.validation.js';

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

const createShopPostController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  const { title, description, productUrls, mediaUrl, thumbnailUrl, igPostId, mediaExpiry } = req.body;

  try {
    // Validate request body
    const { error } = createShopPostValidation.validate(req.body);
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

    // Create shortened URLs for product links
    let shortenedProductUrls: string[] = [];
    
    if (productUrls && Array.isArray(productUrls) && productUrls.length > 0) {
      const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
      
      try {
        const shortLinkPromises = productUrls.map(async (url: string) => {
          const shortLinkResp = await apiClient.createShortUrl({
            longUrl: `${url}?influencer_id=${influencer.id}`, // Adding influencer id for tracking
          });
          return `${serverInfo.baseUrl}/${shortLinkResp.shortCode}`;
        });

        shortenedProductUrls = await Promise.all(shortLinkPromises);
      } catch (shortLinkError) {
        console.error('Error creating short links:', shortLinkError);
        return res.error('Failed to create shortened product links', 500);
      }
    }

    // Create the shop post
    const shopPost = await prisma.shopPost.create({
      data: {
        title,
        description,
        productUrls: shortenedProductUrls.length > 0 ? shortenedProductUrls : productUrls,
        mediaUrl,
        thumbnailUrl,
        igPostId,
        mediaExpiry,
        influencerId: influencer.id
      }
    });

    return res.success(shopPost);
  } catch (err: unknown) {
    return res.error('Something went wrong!', 500, err);
  }
};

export default createShopPostController; 