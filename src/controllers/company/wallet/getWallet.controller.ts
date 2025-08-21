import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const getWalletController  = async (req:Request, res:Response) => {
  
  const { companyId } = req.params;
  try{
  const transaction = await prisma.companyWallet.findMany({
    where: {
      companyId: +companyId
    },
  });


  res.success(transaction);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default getWalletController;