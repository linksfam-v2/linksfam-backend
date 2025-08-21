/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { prisma } from "../../db/db.js";

const addAffiliateData = async (req: Request, res: Response) => {
  const affiliateData = req.body; // direct array of data
  
  try {
    // Optional: truncate the table before insert
    await prisma.amazonConversion.deleteMany();

    // Extract tracking IDs
    const trackingIds = affiliateData.map((item:any) => item.trackingId);
   
    const influencers = await prisma.influencer.findMany({
      where: { amazon_tag: { in: trackingIds } },
      select: {
        amazon_tag: true,
        name: true,
        ig_url: true,
      },
    });

    const influencerMap = Object.fromEntries(
      influencers.map((inf) => [inf.amazon_tag, { name: inf.name, ig_url: inf.ig_url }])
    );
    
    const enrichedData = affiliateData.map((item:any) => ({
      ...item,
      name: influencerMap[item.trackingId]?.name ?? null,
      ig_url: influencerMap[item.trackingId]?.ig_url ?? null,
    }));

    const result = await prisma.amazonConversion.createMany({
      data: enrichedData,
    });

    res.success(result);
  } catch (err) {
    console.log(err);
    res.error("Something went wrong!", 400, err);
  }
};

export default addAffiliateData
