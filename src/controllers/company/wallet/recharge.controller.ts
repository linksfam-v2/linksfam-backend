import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";
import { StandardCheckoutClient, Env } from 'pg-sdk-node';

const clientId = "INDSLAV_2502251724113026422627";

const clientSecret = "NmRmMDAyZjUtMmJmZi00M2Y2LWFjZjEtZmE0MjNmMDczODU4";

const clientVersion = 1;

const env = Env.SANDBOX;

const rechargeController  = async (req:Request, res:Response) => {
  
  const { status} = req.body;

  const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
  
  const merchantOrderId = status;  

  client.getOrderStatus(merchantOrderId).then(async(response) => {
    const state = response.state;
    if(state === "COMPLETED") {
      try{
        const invoice = await prisma.companyInvoice.findMany({
          where: {
            creditInfo: {
              equals: {
                merchantOrderId: status,
                status:'PENDING',
              }
            }
          }
        });
        if (!invoice.length) {
          res.success("Invoice not found");
          return;
        }
        const { companyId, invoiceAmount, id } = invoice[0];
    
        await prisma.companyInvoice.update({
          where: { id: id},
          data: {
            creditInfo: {
              merchantOrderId: status,
              status:'SUCCESS',
            }
          }
        });
        // Update the wallet!
        const walletExists = await prisma.companyWallet.findMany({
          where: {
            companyId: +companyId,
          }
        });
    
        if(walletExists?.length){
          // Update the payment
          const newamount = Number(walletExists[0]?.walletBalance) + Number(invoiceAmount);
          
          await prisma.companyWallet.update({
            where: {
              id: walletExists[0]?.id
            },
            data:{
              walletBalance: newamount, 
            }
          });
        }else{
          await prisma.companyWallet.create({
            data: {
              companyId: +companyId,
              walletBalance: invoiceAmount,
            }
          })
        }
        res.success(invoice);
    } catch (err:unknown){
      res.error('Something went wrong!', 400, err);
    }
  }else{
    const invoice = await prisma.companyInvoice.findMany({
      where: {
        creditInfo: {
          equals: {
            merchantOrderId: status,
            status:'PENDING',
          }
        }
      }
    });
    if (!invoice.length) {
      res.success("Invoice not found");
      return;
    }
    const { id } = invoice[0];
    
    await prisma.companyInvoice.update({
      where: { id: id},
      data: {
        creditInfo: {
          merchantOrderId: status,
          status:state,
        }
      }
    });
    res.success({message:'Payment Failed'});
    }
  })
};

export default rechargeController;