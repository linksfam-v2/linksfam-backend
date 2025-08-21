
import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const addRefundController  = async (req:Request, res:Response) => {
  
  const { companyId } = req.params;

  const {reason} = req.body;

  try{
    
    const reson = await prisma.requestRefund.create({
      data:{
        companyId: +companyId,
        reason:reason
      }
    });

    res.success({reson});
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default addRefundController;