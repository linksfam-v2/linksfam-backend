import { Response, Request} from "express";
import { prisma } from "../../db/db.js";

const getAdminBrandMoneyController = async (req:Request,res:Response) => {
  try{
    const companywallet = await prisma.company.findMany({
      include: {
        companyWallet: true,
      }
    })
    res.success(companywallet);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const putAdminBrandMoneyController = async (req:Request, res:Response) => {
  const { amount, company_id } = req.body;
  
    try{
      const invoice = await prisma.companyInvoice.create({
        data: {
          companyId: +company_id,
          creditInfo: "",
          invoiceAmount: +amount,
          transType: 'CREDIT',
          invoiceSerialNo: 'CREDIT-'+  getFormattedDate()+"-"+company_id,
        }
      });
      // Update the wallet!
      const walletExists = await prisma.companyWallet.findMany({
        where: {
          companyId: +company_id,
        }
      });
  
      if(walletExists?.length){
        // Update the payment
        const newamount = Number(amount);
        
        await prisma.companyWallet.update({
          where: {
            id: walletExists[0]?.id
          },
          data:{
            walletBalance: Number(walletExists[0].walletBalance || 0) + newamount, 
          }
        });
      }else{
        await prisma.companyWallet.create({
          data: {
            companyId: +company_id,
            walletBalance: amount,
          }
        })
      }
  
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

export {
  getAdminBrandMoneyController,
  putAdminBrandMoneyController,
}