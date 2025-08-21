import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const getInvoiceTransaction  = async (req:Request, res:Response) => {
  
  const { companyId } = req.params;
  try{
  const transaction = await prisma.companyInvoice.findMany({
    where: {
      companyId: +companyId
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      company: true,
    }
  });

  const ledger = await prisma.companyLedger.findMany({
    where: {
      companyId: +companyId,
    },
    include:{
      company: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
    const combinedResults = [...transaction, ...ledger].sort(
      (a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
    );

    res.success({transaction: combinedResults});
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default getInvoiceTransaction;