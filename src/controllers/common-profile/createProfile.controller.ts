import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';


const createCommonProfileController = async (req: Request, res: Response) => {

  const {location , pic} = req.body;

  const userId = Number(req?.userId);

  try{

    const profileExists = await prisma.profile.findMany({
      where: {
        userId,
      }
    });

    if(profileExists.length){
      const profile = profileExists[0];
      res.success(profile, 'Profile already exists!');
    }else{
      const profile = await prisma.profile.create({
        data: {
          pic,
          location,
          userId
        }
      }); 

      res.success(profile);
    }
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default createCommonProfileController;
