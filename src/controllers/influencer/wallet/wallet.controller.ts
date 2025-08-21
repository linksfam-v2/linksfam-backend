import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const walletValueController  = async (req:Request, res:Response) => {
  
  const { influencerId } = req.params;
  try{
  const transaction = await prisma.influencerWallet.findMany({
    where: {
      influencerId: +influencerId
    },
  });


  res.success(transaction);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default walletValueController;