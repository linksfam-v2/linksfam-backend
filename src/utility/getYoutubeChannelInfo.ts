import axios from 'axios';

async function getYoutubeChannelInfo(accessToken: string) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        part: 'snippet,statistics,brandingSettings',
        mine: true
      }
    });

    const channel = response.data.items?.[0];
    if (channel) {
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnails: channel.snippet.thumbnails,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        handle: channel.snippet.customUrl || channel.brandingSettings.channel?.handle || null
      };
    } else {
      console.warn("No YouTube channel found for this user.");
      return null;
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data: unknown } };
      console.error("Error fetching YouTube channel info:", axiosError.response?.data);
    } else if (error instanceof Error) {
      console.error("Error fetching YouTube channel info:", error.message);
    } else {
      console.error("Error fetching YouTube channel info:", error);
    }
    return null;
  }
}

export default getYoutubeChannelInfo;
