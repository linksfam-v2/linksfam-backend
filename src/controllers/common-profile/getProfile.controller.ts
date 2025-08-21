
import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';


const getCommonProfileController = async (req: Request, res: Response) => {

  const userId = Number(req?.userId);

  try{

    const profile = await prisma.profile.findMany({
      where: {
        userId,
      }
    });

      res.success(profile[0], 'Profile fetched successfully!');
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default getCommonProfileController;
