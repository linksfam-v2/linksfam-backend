import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const getCompanUserProfileController  = async (req:Request, res:Response) => {
  
  const userId = Number(req?.userId);

  try{
    const company = await prisma.user.findMany({
      where: {
        id: +userId,
      }
    });
    res.success(company?.length ?  company : []);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }

};

export default getCompanUserProfileController;