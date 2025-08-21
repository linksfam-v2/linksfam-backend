import cron from "node-cron";
import { prisma } from "../../db/db.js";
import { ShlinkApiClient } from "@shlinkio/shlink-js-sdk";
import { NodeHttpClient } from "@shlinkio/shlink-js-sdk/node";
import cronitor from 'cronitor';

const cronitorInstance = cronitor('af07c26ef0404708a730e54d04d835fc');

const monitor = new cronitorInstance.Monitor('influencer-invoice');

cron.schedule('30 23 * * 0', async () => {  // '0' stands for Sunday
  monitor.ping({ state: 'run' });

  console.log('Running Weekend Cron at Sunday 11:30 PM..');
  try {
    const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

    const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);

    const currentDate = new Date();

    const kolkataOffset = 5.5 * 60 * 60 * 1000; 

    const currentDateKolkata = new Date(currentDate.getTime() - kolkataOffset);
    
    const lastMonday = new Date(currentDateKolkata);

    lastMonday.setDate(currentDateKolkata.getDate() - (currentDateKolkata.getDay() === 0 ? 6 : currentDateKolkata.getDay() - 1));

    lastMonday.setHours(0, 0, 0, 0); // Set time to 12:00 AM

    // Calculate the end of the last week (Sunday 11:30 PM IST)
    const lastSunday = new Date(lastMonday);

    lastSunday.setDate(lastMonday.getDate() + 6); // Move to Sunday

    lastSunday.setHours(23, 30, 0, 0); // Set time to 11:30 PM

    const startDateUTC = lastMonday.toISOString();

    const endDateUTC = lastSunday.toISOString();

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
      await prisma.influencerInvoice.create({
        data: {
          influencerId: +inf?.id,
          start:startDateUTC,
          end: endDateUTC,
          invoiceAmount: +totalAmount,
          invoiceSerialNo: 'EARNING-'+getFormattedDate()+"-"+inf?.id,
          transType: 'EARNING',

        },
      });
    }
    console.log('End of Weekend Cron..');
    monitor.ping({ state: 'complete' });
  } catch (error) {
    console.error('Error in Weekend Cron:', error);
    monitor.ping({ state: 'fail'});
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});

function getFormattedDate() {
  const today = new Date();
  
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
  const day = today.getDate().toString().padStart(2, '0'); // Add leading zero if necessary
  
  return `${year}-${month}-${day}`;
}
