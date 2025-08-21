import axios from "axios";

export default async function refreshAccessToken(refreshToken : string) {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token; // new access token
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to refresh access token:', error.response?.data || error.message);
    } else {
      console.error('Failed to refresh access token:', error);
    }
    throw error;
  }
}
