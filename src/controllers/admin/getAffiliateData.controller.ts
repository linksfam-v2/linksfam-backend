import { Request, Response } from "express";
import { prisma } from "../../db/db.js";

const getAffiliateData = async (req:Request,res:Response) => {
  try{
    const amazon = await prisma.amazonConversion.findMany();
    res.success(amazon);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

export default getAffiliateData;