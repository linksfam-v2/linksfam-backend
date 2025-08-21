import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const getBankController  = async (req:Request, res:Response) => {
  
  const { companyId } = req.params;
  try{
  const companyBank = await prisma.companyBankInfo.findMany({
    where: {
      companyId: +companyId
    }
  });



  res.success(companyBank);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default getBankController;