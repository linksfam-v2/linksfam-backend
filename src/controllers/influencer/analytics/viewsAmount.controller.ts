import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { convertToUTC, paramsMap } from './utils/utils.js';

const viewsAmountController = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as '7days' | '30days' | '90days' | 'custom');
    
    let startDateUTC, endDateUTC;

    const { influencerId } = req.params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { start, end }:any = req.query;
    
    if(q !== 'custom'){
     const { startDateUTC : s, endDateUTC :e}: { startDateUTC: string; endDateUTC: string } = paramsMap[q]();
     startDateUTC = s;
     endDateUTC = e;
    }else{
      const {startDateUTC:s, endDateUTC:e} = convertToUTC(start, end);
      startDateUTC = s;
      endDateUTC = e;
    }

    // Initialize the Shlink API client
    const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };
    
    const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);

    // Helper function to create a date map
    const generateDateMap = (startDate: string, endDate: string) => {
      const dateMap: Record<string, { views: number; amount: number }> = {};
      const start = new Date(startDate);
      const end = new Date(endDate);

      while (start <= end) {
        const dateStr = start.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        dateMap[dateStr] = { views: 0, amount: 0 };
        start.setDate(start.getDate() + 1); // Increment day
      }

      return dateMap;
    };

    // Generate a map for the date range
    const dateMap = generateDateMap(startDateUTC, endDateUTC);
    console.log(4, influencerId);
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
      })
 
      for(const shrt of allShortLinks){
         const views = await apiClient.getShortUrlVisits(shrt?.shLinkCode , {startDate: startDateUTC, endDate: endDateUTC});
         for(const v of views.data){
          const visitDate = new Date(v?.date).toISOString().split('T')[0]; 
          if(dateMap[visitDate]){
            dateMap[visitDate].views += 1;
            dateMap[visitDate].amount += +shrt?.link.fee;
          }
         }
      }
    }

    res.success({ dateMap });
  } catch (error) {
    console.error('Error in viewsAmountController:', error);
    res.error('Something went wrong!', 400, error);
  }
};

export default viewsAmountController;
