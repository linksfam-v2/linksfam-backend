import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { convertToUTC, paramsMap } from './utils/utils.js';

const dashboardController = async (req: Request, res: Response) => {
  try{
    const q = (req.query.q as '7days' | '30days' | '90days' | 'custom');
    
    let startDateUTC, endDateUTC;

    const { companyId } = req.params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { start, end }:any = req.query;
    
    if(q !== 'custom'){
     const { startDateUTC : s, endDateUTC :e }: { startDateUTC: string; endDateUTC: string } = paramsMap[q]();
     
     startDateUTC = s;
     endDateUTC = e;
     
    }else{
      const {startDateUTC:s, endDateUTC:e} = convertToUTC(start, end);
      startDateUTC = s;
      endDateUTC = e;
    }


  let totalAmount = 0; let views = 0;

   try {
     const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

     const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
 
     const companies = await prisma.company.findMany({
       include: {
         link: {
           include: {
             shortLinks: true,
           },
         },
       },
       where: {
        id: +companyId,
       }
     });
 
     for (const company of companies) {
       for (const link of company.link) {
         const visitsData = await Promise.all(
           link.shortLinks.map((shortLink) =>
             apiClient.getShortUrlVisits(shortLink?.shLinkCode , {startDate: startDateUTC, endDate: endDateUTC})
           )
         );
 
         const totalVisits = visitsData.reduce(
           (acc, visit) => acc + visit.data.length,
           0
         );
 
         totalAmount += totalVisits * +link.fee;
         views += totalVisits;
       }
     }
     res.success({totalAmount, views});
   } catch (error) {
     console.error('Error in Company Ledger Cron:', error);
   }
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default dashboardController;
