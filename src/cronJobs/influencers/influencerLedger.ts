import cron from "node-cron";
import { prisma } from "../../db/db.js";
import { ShlinkApiClient } from "@shlinkio/shlink-js-sdk";
import { NodeHttpClient } from "@shlinkio/shlink-js-sdk/node";
import cronitor from 'cronitor';

const cronitorInstance = cronitor('af07c26ef0404708a730e54d04d835fc');

const monitor = new cronitorInstance.Monitor('influencer-ledger');

cron.schedule('50 23 * * *', async () => {
  try{
  monitor.ping({ state: 'run' });
  
  console.log('Running Company Ledger Cron at 12:AM..');
   // Get current date in 'Asia/Kolkata' timezone and compute the UTC range
   const currentDate = new Date();
   
   const kolkataOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds for IST
   
   const startTimeKolkata = new Date(currentDate.getTime() - kolkataOffset);
 
   startTimeKolkata.setUTCHours(0, 0, 0, 0);
 
   const endTimeKolkata = new Date(startTimeKolkata);
 
   endTimeKolkata.setUTCDate(startTimeKolkata.getUTCDate() + 1);
 
   const startDateUTC = startTimeKolkata.toISOString();
 
   const endDateUTC = endTimeKolkata.toISOString();
 
    const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };
 
    const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
 
    const influencers = await prisma.influencer.findMany({});
 
    for (const inf of influencers) {
 
      let totalAmount = 0;
 
      const allShortLinks = await prisma.shortLinks.findMany({
        where: {
          influencerId: inf?.id,
        },
        include: {
         link: true,
        }
      })
 
      for(const shrt of allShortLinks){
         const views = await apiClient.getShortUrlVisits(shrt?.shLinkCode , {startDate: startDateUTC, endDate: endDateUTC})
         totalAmount = totalAmount + views?.data?.length * +shrt?.link?.fee
      }
 
   
      await prisma.influencerLedger.create({
        data: {
          influencerId: inf?.id,
          amountRecieved: totalAmount.toFixed(2),
          dateScheduled: new Date(),
        },
      });
      
      // Update the wallet!
      const walletExists = await prisma.influencerWallet.findMany({
        where: {
          influencerId: +inf?.id,
        }
      });
  
      if(walletExists?.length){
        const newamount:number = Number(walletExists[0]?.walletBalance) + Number(totalAmount);
        await prisma.influencerWallet.update({
          where: {
            id: walletExists[0]?.id
          },
          data:{
            walletBalance: newamount, 
          }
        });
      }else{
        await prisma.influencerWallet.create({
          data: {
            influencerId: +inf?.id,
            walletBalance: +totalAmount,
          }
        })
      }
    }
    console.log('End of Company Ledger Cron..');
    monitor.ping({ state: 'complete' });
  } catch (error) {
    console.error('Error in Company Ledger Cron:', error);
    monitor.ping({ state: 'fail'});
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});
