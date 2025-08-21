import { Request, Response } from "express";
import { prisma } from "../../db/db.js";

const deactivateSocialController = async (req: Request, res: Response) => {
  try {

    const { id } = (req.params);

    const checkResults = await prisma.influencerSocialDetails.findMany({
      where: {
        id: +id,
      }
    });

    if(checkResults?.length > 0){
      await prisma.influencerSocialDetails.delete({
        where: {
         id: +id
        }
      })
    }else{
      res.error('Not Found!', 400);
    }
    
    res.success({ data: 'ok' });
  } catch (error) {
    console.log(error);
    res.error('Something went wrong!', 400, error);
  }
};

export default deactivateSocialController;
