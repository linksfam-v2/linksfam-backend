import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const addBankController  = async (req:Request, res:Response) => {
  
  const { companyId, accountNumber, gst,ifsc, name } = req.body;
  let companyBankInfo;
  try{
  const companyBankInfoExists = await prisma.companyBankInfo.findMany({
    where: {
      companyId: +companyId
    }
  });

  if(companyBankInfoExists?.length){
    const id = companyBankInfoExists[0]?.id;

    companyBankInfo = await prisma.companyBankInfo.update({
      where: {
        id: +id
      },
      data: {
        accountNumber:accountNumber,
        gst: gst,
        ifsc: ifsc,
        name:name
      }
    })
  }else{
    companyBankInfo = await prisma.companyBankInfo.create({
      data: {
        accountNumber:accountNumber,
        gst: gst,
        ifsc: ifsc,
        name:name,
        companyId: +companyId
      }
    })
  }


  res.success(companyBankInfo);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default addBankController;