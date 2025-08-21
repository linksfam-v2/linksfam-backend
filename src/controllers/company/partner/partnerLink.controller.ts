import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

const parterLinkShortController  = async (req:Request, res:Response) => {
  
  const { influencerId, partnerId, otherInfo, bulkLink } = req.body;

  const partner = await prisma.partnerBrand.findMany({
    where: {
      slug: partnerId
    }
  });

  const id = partner?.length > 0 ? partner[0].id : 1;

  try{
 const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo)
    
    const shortLinkResp = await apiClient.createShortUrl({
        longUrl: otherInfo
    });
    const shortLinkResp2 = await apiClient.createShortUrl({
      longUrl: bulkLink
  });
    const shortCode = shortLinkResp?.shortCode;
    
    const miscLink = await prisma.miscShortLinks.create({
      data: {
        influencerId: +influencerId,
        partnerId:+id,
        shLinkCode: shortCode,
        otherInfo: otherInfo,
        bulkLink: shortLinkResp2?.shortCode,
      }
    });
  
    res.success(miscLink);
  }catch(err:unknown){
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }

};

export default parterLinkShortController;