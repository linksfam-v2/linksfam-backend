import { Response, Request} from "express";
import { prisma } from "../../db/db.js";
import { ShlinkApiClient } from "@shlinkio/shlink-js-sdk";
import { NodeHttpClient } from "@shlinkio/shlink-js-sdk/node";

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

const getadminShortLinkCntroller = async (req:Request,res:Response) => {

  const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);

  const linkId = req.query?.link;

  const links = [];

  try{
    const categories = await prisma.shortLinks.findMany(
      {
        where: {
          linkId:+linkId!
        },
        include:{
          link: true,
          influencer: true
        }
      }
    );

    for(const i of categories){
      const visits = await apiClient.getShortUrlVisits(i?.shLinkCode, {excludeBots: true});
  
      const len = visits.data.length;
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newI = {...i, visit: len, isBot: visits.data.map((item:any) => item.potentialBot)};
      
      links.push(newI);
    }

    res.success(links);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};
export default getadminShortLinkCntroller;