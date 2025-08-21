
import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const getProfileInfluencerByIdController = async (req: Request, res: Response) => {
  
  const id = req.params.id;

  try{
    const influencer = await prisma.influencer.findMany({
      where: {
        userId: Number(id),
      }
    });

    res.success(influencer);
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
}

export default getProfileInfluencerByIdController;
