import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };


const getShortLinkController = async (req: Request, res: Response) => {
  
  const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);

  const { influencerId } = req.body;

  const links = [];

  try{
  const ShortLink = await prisma.shortLinks.findMany({
    where: {
      influencerId: +influencerId,
    },
    orderBy: {
      'createdAt': 'desc'
    },
    include: {
      link: {
        select: {
          brand: {
            select:{
              brand_name: true,
              brand_url: true,
              id: true,
              category: true  
            }
          },
          company:true,
          fee: true,
          link: true,
          currency: true,
          category: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  });

  for(const i of ShortLink){
    const visits = await apiClient.getShortUrlVisits(i?.shLinkCode, {excludeBots: true});

    const len = visits.data.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newI = {...i, visit: len, isBot: visits.data.map((item:any) => item.potentialBot)};
    
    links.push(newI);
  }
  
  res.success(links)

  }catch(err:unknown){
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }
}

export default getShortLinkController;
