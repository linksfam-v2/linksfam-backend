import cron from "node-cron";
import { prisma } from "../../db/db.js";
import axios from "axios";
import cronitor from 'cronitor';

const cronitorInstance = cronitor('af07c26ef0404708a730e54d04d835fc');
const monitor = new cronitorInstance.Monitor('refresh-instagram-access-tokens');

interface SocialDetail {
  id: number;
  userId: number;
  token: string;
  socialMediaType: string;
  updatedAt: Date;
  expires_at: Date | null;
}

async function refreshInstagramToken(socialDetail: SocialDetail): Promise<boolean> {
  try {
    console.log(`Refreshing Instagram token for user ${socialDetail.userId} (expires: ${socialDetail.expires_at?.toISOString()})`);

    // Refresh Instagram long-lived token
    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: socialDetail.token
      },
      timeout: 10000
    });

    const { access_token } = response.data;
    
    // Calculate new expiry date (60 days from now)
    const newExpiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // Update the database with new token and expiry
    await prisma.influencerSocialDetails.update({
      where: {
        id: socialDetail.id
      },
      data: {
        token: access_token,
        expires_at: newExpiryDate
      }
    });

    console.log(`Successfully refreshed Instagram token for user ${socialDetail.userId}, new expiry: ${newExpiryDate.toISOString()}`);
    return true;

  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
    console.error(`Error refreshing Instagram token for user ${socialDetail.userId}:`, axiosError.response?.data || axiosError.message);
    
    // If token is invalid, mark the social account as inactive
    if (axiosError.response?.status === 400 || axiosError.response?.status === 401) {
      console.log(`Marking Instagram account ${socialDetail.id} as inactive due to invalid token`);
      await prisma.influencerSocialDetails.update({
        where: { id: socialDetail.id },
        data: { isActive: false }
      });
    }
    
    return false;
  }
}



// Run every day at 2 AM (02:00) IST
cron.schedule('0 2 * * *', async () => {
  monitor.ping({ state: 'run' });
  
  console.log('Running Instagram Access Token Refresh Cron at 2 AM IST...');
  
  try {
    // Calculate the date 7 days from now
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Find all Instagram tokens that expire in the next 7 days
    const expiringTokens = await prisma.influencerSocialDetails.findMany({
      where: {
        isActive: true,
        expires_at: {
          lte: sevenDaysFromNow, // Less than or equal to 7 days from now
          gte: new Date() // Greater than or equal to now (not already expired)
        },
        socialMediaType: 'instagram'
      }
    });

    console.log(`Found ${expiringTokens.length} Instagram tokens expiring in the next 7 days`);

    let refreshedCount = 0;
    let errorCount = 0;

    // Process each expiring Instagram token
    for (const socialDetail of expiringTokens) {
      try {
        const success = await refreshInstagramToken(socialDetail);

        if (success) {
          refreshedCount++;
        } else {
          errorCount++;
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: unknown) {
        console.error(`Error processing Instagram token refresh for social detail ${socialDetail.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Instagram Access Token Refresh Cron completed: ${refreshedCount} tokens refreshed, ${errorCount} errors`);
    monitor.ping({ state: 'complete' });

  } catch (error: unknown) {
    console.error('Error in Instagram Access Token Refresh Cron:', error);
    monitor.ping({ state: 'fail' });
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});

console.log('Instagram Access Token Refresh Cron job scheduled to run daily at 2 AM IST'); 