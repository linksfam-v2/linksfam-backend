
import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const getProfileInfluencerController = async (req: Request, res: Response) => {
  
  const userId = Number(req?.userId);

  try{
    const influencer = await prisma.influencer.findMany({
      where: {
        userId: +userId,
      }
    });

    res.success(influencer);
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
}

export default getProfileInfluencerController;
