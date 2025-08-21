import cron from "node-cron";
import { prisma } from "../../db/db.js";
import axios from "axios";
import cronitor from 'cronitor';

const cronitorInstance = cronitor('af07c26ef0404708a730e54d04d835fc');
const monitor = new cronitorInstance.Monitor('refresh-instagram-profile-pictures');

// Run every day at 1 AM (01:00) IST
cron.schedule('0 1 * * *', async () => {
  monitor.ping({ state: 'run' });
  
  console.log('Running Instagram Profile Picture URL Refresh Cron at 1 AM IST...');
  
  try {
    // Get all Instagram social details with active tokens
    const instagramSocialDetails = await prisma.influencerSocialDetails.findMany({
      where: {
        socialMediaType: 'instagram',
        isActive: true
      }
    });

    console.log(`Found ${instagramSocialDetails.length} active Instagram accounts`);

    for (const socialDetail of instagramSocialDetails) {
      try {
        console.log(`Processing profile picture refresh for user ${socialDetail.userId}`);

        // Fetch fresh profile picture URL from Instagram Graph API
        const response = await axios.get(`https://graph.instagram.com/v22.0/me`, {
          params: {
            access_token: socialDetail.token,
            fields: 'profile_picture_url'
          },
          timeout: 10000 // 10 second timeout
        });

        const { profile_picture_url } = response.data;

        // Update the social detail with new profile picture URL
        await prisma.influencerSocialDetails.update({
          where: {
            id: socialDetail.id
          },
          data: {
            profile_picture_url: profile_picture_url || socialDetail.profile_picture_url // Keep existing if new one is null
          }
        });

        console.log(`Updated profile picture URL for user ${socialDetail.userId}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (socialError: unknown) {
        const error = socialError as { response?: { data?: unknown; status?: number }; message?: string };
        console.error(`Error updating profile picture for user ${socialDetail.userId}:`, error.response?.data || error.message);
        
        // If the token is invalid or expired, mark the social account as inactive
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log(`Marking social account ${socialDetail.id} as inactive due to invalid token`);
          await prisma.influencerSocialDetails.update({
            where: { id: socialDetail.id },
            data: { isActive: false }
          });
        }
      }
    }

    console.log('Instagram Profile Picture URL Refresh Cron completed successfully');
    monitor.ping({ state: 'complete' });

  } catch (error: unknown) {
    console.error('Error in Instagram Profile Picture URL Refresh Cron:', error);
    monitor.ping({ state: 'fail' });
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});

console.log('Instagram Profile Picture URL Refresh Cron job scheduled to run daily at 1 AM IST'); 