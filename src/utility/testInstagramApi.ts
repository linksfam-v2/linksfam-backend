import axios from 'axios';
import { InstagramMediaResponse } from './instagramApiTypes.js';

/**
 * Test function to verify Instagram Graph API call format
 * This is for testing purposes only - not used in production
 */
export async function testInstagramApiCall(postId: string, accessToken: string): Promise<InstagramMediaResponse | null> {
  try {
    const response = await axios.get<InstagramMediaResponse>(`https://graph.instagram.com/v22.0/${postId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,media_type,media_url,thumbnail_url'
      },
      timeout: 10000
    });

    console.log('Instagram API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: unknown; status?: number }; message?: string };
    console.error('Instagram API Error:', apiError.response?.data || apiError.message);
    return null;
  }
}

/**
 * Example usage:
 * const result = await testInstagramApiCall('18098703082451062', 'YOUR_ACCESS_TOKEN');
 */ 