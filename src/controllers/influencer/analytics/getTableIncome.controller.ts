import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';

const incomeTableController = async (req: Request, res: Response) => {
  try{

    const { influencerId } = req.params;



    const table = [];

   try {
     const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

     const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
     console.log(3, influencerId);
      const influencers = await prisma.influencer.findMany({
        where: {
          id: +influencerId
        }
      });
      for (const inf of influencers) {
   
        const allShortLinks = await prisma.shortLinks.findMany({
          where: {
            influencerId: inf?.id,
          },
          include: {
           link: true,
          }
        });

   
        for(const shrt of allShortLinks){
          let totalAmount = 0; let totalViews = 0;
           const views = await apiClient.getShortUrlVisits(shrt?.shLinkCode);
           totalAmount = totalAmount + views?.data?.length * +shrt?.link?.fee
           totalViews = totalViews + views?.data?.length;
           table.push({
            amount: totalAmount,
            views: totalViews,
            link: shrt?.link?.link,
            short: shrt?.shLinkCode
           })
        }
      }
     res.success({table});
   } catch (error) {
     console.error('Error in Company Ledger Cron:', error);
   }
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default incomeTableController;
