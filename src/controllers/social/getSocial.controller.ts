import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';
 
const socialDetailsController = async (req: Request, res: Response) => {
  const userId = Number(req?.userId);
  let influencer;

  const category = await prisma.category.findMany();
  console.log(8, userId);
  const influencerExists = await prisma.influencer.findMany({
    where: {
      userId: +userId
    }
  });
  if(!influencerExists?.length){
    // New influencer
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    influencer = await prisma.influencer.create({
      data: {
        userId: +userId,
        name:'',
        categoryId: +category[0]?.id, 
      }
    });
  }

  const socialDetails = await prisma.influencerSocialDetails.findMany({
    where: {
     userId: +userId
    }
  })
  res.success({ data: socialDetails });
};

export default socialDetailsController;
