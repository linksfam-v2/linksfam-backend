import { Request, Response } from "express";
import { prisma } from "../../db/db.js";

const finishIgController = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const userId = Number(req?.userId);

    const checkResults = await prisma.influencerSocialDetails.findMany({
      where: {
        userId,
        socialMediaType: "instagram"
      }
    });

    if(checkResults?.length > 0){
      await prisma.influencerSocialDetails.update({
        where: {
         id: checkResults[0].id
        },
        data: {
          token: token,
          isActive:true
        }
      })
    }else{
      await prisma.influencerSocialDetails.create({
        data: {
          isActive:true,
          token: token,
          socialMediaType: 'instagram',
          name: "",
          email: "",
          provider: "",
          userId
        }
      })
    }
    
    res.success({ data: 'ok' });
  } catch (error) {
    res.error('Something went wrong!', 400, error);
  }
};

export default finishIgController;
