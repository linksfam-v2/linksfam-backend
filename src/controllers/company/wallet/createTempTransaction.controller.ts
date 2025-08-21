import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const  createTempTransactionController  = async (req:Request, res:Response) => {
  
  const { companyId } = req.params;

  const { amount, transId } = req.body;

  try{
  const tempTrans = await prisma.trackTemporaryTransaction.create({
    data: {
      companyId: +companyId,
      amount: +amount,
      transId,
      isCompleted: false
    }
  });

  res.success(tempTrans,  "Transactions created successfully!");
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default createTempTransactionController;