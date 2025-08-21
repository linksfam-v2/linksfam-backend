import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const intiController  = async (req:Request, res:Response) => {
  
  const { amount, company_id, merchantOrderId } = req.body;

  try{
    const invoice = await prisma.companyInvoice.create({
      data: {
        companyId: + company_id,
        creditInfo: {
          status: "PENDING",
          merchantOrderId
        },
        invoiceAmount: +amount,
        transType: 'CREDIT',
        invoiceSerialNo: 'CREDIT-'+  getFormattedDate()+"-"+company_id,
      }
    });
   

    res.success(invoice);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

function getFormattedDate() {
  const today = new Date();
  
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
  const day = today.getDate().toString().padStart(2, '0'); // Add leading zero if necessary
  
  return `${year}-${month}-${day}`;
}


export default intiController;