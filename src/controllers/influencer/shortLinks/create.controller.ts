import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';
import { ip, ipv6, mac } from 'address';
import UserAgent from 'user-agents';
// import { CAMPAIGNS } from './utils.js';
// import { getCurrentDate } from './utils.js';

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };


const createShortlinkController = async (req: Request, res: Response) => {
  
  const userAgent = new UserAgent();

  const {linkId, influencerId} = req.body;

  let shortLin;
  
  let deviceInfo;

  mac(function (err, addr) {
    deviceInfo = {
      ip: ip(),
      ip6: ipv6(),
      mac: addr,
      userAgent: userAgent.toString()
    };
  });

  try{
    // const inf = await prisma.influencer.findUnique({where: {
    //   id: +influencerId,
    // }})

  const ShortLinkExists = await prisma.shortLinks.findMany({
    where: {
      influencerId: +influencerId,
      linkId: +linkId,
    }
  });

  if(ShortLinkExists?.length){
    // Already exists
    shortLin = ShortLinkExists[0];
    res.success(shortLin, 'Link already exists!');
  }else{
    const linkUrl = await prisma.link.findUnique({
      where: {
        id: +linkId
      },
      include: {
        company: true,
        brand: true
      }
    })

    const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
    let shortLinkResp;

    if(linkUrl?.link){
      if(linkUrl?.companyId){
        // This is our platform!
        shortLinkResp = await apiClient.createShortUrl({
          longUrl: linkUrl.link + `?influencer_id=${influencerId}&company_id=${linkUrl.companyId}`, //adding influencer id and company id for pixel tracking
        });
      }else{
        // This is vcommision harcoded contact Arpit
        // const campaignId = CAMPAIGNS.filter((item) => linkUrl?.brand?.brand_name?.toLowerCase().includes(item?.name) || linkUrl?.brand?.brand_name?.toLowerCase() == item?.name)[0].campaignId;
        const brand = await prisma.brands.findMany({
          where: {
            id: +linkUrl.brandId!
          }
        })
        shortLinkResp = await apiClient.createShortUrl({
          longUrl:`https://track.vcommission.com/click?campaign_id=${brand[0].campaignId}&pub_id=118468&source=${influencerId}&url=${linkUrl.link}`,
        });
      }

      const shortCode = shortLinkResp?.shortCode;

      if(shortCode){
        shortLin = await prisma.shortLinks.create({
          data: {
            influencerId: +influencerId,
            linkId: +linkId,
            shLinkCode:shortCode,
            deviceInfo: deviceInfo
          },
        });
  
        res.success(shortLin);
      }else{
        res.error("Short link is not found!");
      } 
    }else{
      res.error("Long Link Not Found!");
    }
  } 
  }catch(err:unknown){
    console.log(err)
    res.error('Something went wrong!', 400, err);
  }
}

export default createShortlinkController;
