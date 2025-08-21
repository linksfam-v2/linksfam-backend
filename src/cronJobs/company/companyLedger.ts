import cron from "node-cron";
import { prisma } from "../../db/db.js";
import { ShlinkApiClient } from "@shlinkio/shlink-js-sdk";
import { NodeHttpClient } from "@shlinkio/shlink-js-sdk/node";
import cronitor from 'cronitor';

const cronitorInstance = cronitor('af07c26ef0404708a730e54d04d835fc');

const monitor = new cronitorInstance.Monitor('company-ledger');

cron.schedule('55 23 * * *', async () => {
  monitor.ping({ state: 'run' });
  console.log('Running Company Ledger Cron at 11:55 PM..');
   // Get current date in 'Asia/Kolkata' timezone and compute the UTC range
   const currentDate = new Date();
   
   const kolkataOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds for IST
   
   const startTimeKolkata = new Date(currentDate.getTime() - kolkataOffset);

   startTimeKolkata.setUTCHours(0, 0, 0, 0);

   const endTimeKolkata = new Date(startTimeKolkata);

   endTimeKolkata.setUTCDate(startTimeKolkata.getUTCDate() + 1);

   const startDateUTC = startTimeKolkata.toISOString();

   const endDateUTC = endTimeKolkata.toISOString();

  try {
    const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

    const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);

    const companies = await prisma.company.findMany({
      include: {
        link: {
          include: {
            shortLinks: true,
          },
        },
      },
    });

    for (const company of companies) {
      let totalAmount = 0;

      for (const link of company.link) {
        const visitsData = await Promise.all(
          link.shortLinks.map((shortLink) =>
            apiClient.getShortUrlVisits(shortLink?.shLinkCode , {startDate: startDateUTC, endDate: endDateUTC})
          )
        );

        const totalVisits = visitsData.reduce(
          (acc, visit) => acc + visit.data.length,
          0
        );

        totalAmount += totalVisits * +link.fee;
      }

      await prisma.companyLedger.create({
        data: {
          companyId: company.id,
          amountSpent: totalAmount.toFixed(2),
          dateScheduled: new Date(),
        },
      });
      
      // Update the wallet!
      const walletExists = await prisma.companyWallet.findMany({
        where: {
          companyId: +company?.id,
        }
      });
  
      if(walletExists?.length){
        const newamount:number = Number(walletExists[0]?.walletBalance) - Number(totalAmount);
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
            companyId: +company?.id,
            walletBalance: -totalAmount,
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
