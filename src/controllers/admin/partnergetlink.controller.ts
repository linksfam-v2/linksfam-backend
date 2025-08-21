
import { Request, Response } from "express";
import { prisma } from "../../db/db.js";
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };
const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);

const partnerLinksGetController  = async (req:Request, res:Response) => {
  const links = [];
  try{
    const allLinks = await prisma.miscShortLinks.findMany({
      include: {
        influencer: true,
        partner: true,
      }
    });

    for(const i of allLinks){
      const visits = await apiClient.getShortUrlVisits(i?.shLinkCode, {excludeBots: true});
      const visits2 = await apiClient.getShortUrlVisits(i.bulkLink || "", {excludeBots: true});
  
      const len = visits.data.length;

      const len2 = visits2.data.length;
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newI = {...i, visit2: len2, visit: len, isBot: visits.data.map((item:any) => item.potentialBot)};
      
      links.push(newI);
    }
    res.success(links);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default partnerLinksGetController;