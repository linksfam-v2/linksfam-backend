import cron from "node-cron";
import { prisma } from "../../db/db.js";
import axios from "axios";
import cronitor from 'cronitor';
import { InstagramMediaResponse } from "../../utility/instagramApiTypes.js";

const cronitorInstance = cronitor('af07c26ef0404708a730e54d04d835fc');
const monitor = new cronitorInstance.Monitor('refresh-instagram-reel-urls');

// Run every day at midnight (00:00) IST
cron.schedule('0 0 * * *', async () => {
  monitor.ping({ state: 'run' });
  
  console.log('Running Instagram Reel URL Refresh Cron at midnight...');
  
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
        // Get all Instagram reels for this social account
        const instagramReels = await prisma.newestInstagramReels.findMany({
          where: {
            socialId: socialDetail.id
          }
        });

        console.log(`Processing ${instagramReels.length} reels for user ${socialDetail.userId}`);

        for (const reel of instagramReels) {
          try {
            // Fetch fresh URLs from Instagram Graph API
            const response = await axios.get<InstagramMediaResponse>(`https://graph.instagram.com/v22.0/${reel.postId}`, {
              params: {
                access_token: socialDetail.token,
                fields: 'id,media_type,media_url,thumbnail_url'
              },
              timeout: 10000 // 10 second timeout
            });

            const { media_url, thumbnail_url } = response.data;

            // Update the reel with new URLs
            await prisma.newestInstagramReels.update({
              where: {
                id: reel.id
              },
              data: {
                media_url: media_url || reel.media_url, // Keep existing if new one is null
                thumbnail_url: thumbnail_url || reel.thumbnail_url // Keep existing if new one is null
              }
            });

            console.log(`Updated URLs for reel ${reel.postId}`);
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (reelError: unknown) {
            const error = reelError as { response?: { data?: unknown; status?: number }; message?: string };
            console.error(`Error updating reel ${reel.postId}:`, error.response?.data || error.message);
            
            // If the post is not found (404) or access is forbidden (403), 
            // it might be deleted or access revoked - log but continue
            if (error.response?.status === 404) {
              console.log(`Reel ${reel.postId} not found - may have been deleted`);
            } else if (error.response?.status === 403) {
              console.log(`Access forbidden for reel ${reel.postId} - token may be invalid`);
            }
          }
        }

      } catch (socialError: unknown) {
        const error = socialError as { response?: { data?: unknown; status?: number }; message?: string };
        console.error(`Error processing social account ${socialDetail.id}:`, error.response?.data || error.message);
        
        // If token is invalid, mark the social account as inactive
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log(`Marking social account ${socialDetail.id} as inactive due to invalid token`);
          await prisma.influencerSocialDetails.update({
            where: { id: socialDetail.id },
            data: { isActive: false }
          });
        }
      }
    }

    console.log('Instagram Reel URL Refresh Cron completed successfully');
    monitor.ping({ state: 'complete' });

  } catch (error: unknown) {
    console.error('Error in Instagram Reel URL Refresh Cron:', error);
    monitor.ping({ state: 'fail' });
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata',
});

console.log('Instagram Reel URL Refresh Cron job scheduled to run daily at midnight IST'); 