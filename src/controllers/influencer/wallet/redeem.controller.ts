import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const rechargewalletController  = async (req:Request, res:Response) => {
  
  const { amount, influencerId, creditInfo } = req.body;

  try{
    const walletExists = await prisma.influencerWallet.findMany({
      where: {
        influencerId: +influencerId,
      }
    });
    
    if( Number(amount) > Number(walletExists[0]?.walletBalance)){
      return res.error("Cannot redeem more amount then wallet balance");
    }else{
    const invoice = await prisma.influencerInvoice.create({
      data: {
        influencerId: + influencerId,
        creditInfo: creditInfo,
        invoiceAmount: +amount,
        transType: 'REDEEM',
        invoiceSerialNo: 'REDEEM-'+  getFormattedDate()+"-"+influencerId,
      }
    });
    // Update the wallet!


    
    
      if(walletExists?.length){
        // Update the payment
        const newamount = Number(walletExists[0]?.walletBalance) - Number(amount);
  
        await prisma.influencerWallet.update({
          where: {
            id: walletExists[0]?.id
          },
          data:{
            walletBalance: newamount, 
          }
        });
      }
      return res.success(invoice);
    }

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


export default rechargewalletController;