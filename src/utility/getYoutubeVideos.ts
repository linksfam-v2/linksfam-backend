import axios from 'axios';
import { prisma } from '../db/db.js';

export interface NewestYoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  publishedDate: Date;
  likes?: number;
  comments?: number;
  viewCount?: number;
  socialId: number;
}

interface YouTubeVideoResponse {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
    publishedAt: string;
  };
  statistics: {
    likeCount?: string;
    commentCount?: string;
    viewCount?: string;
  };
}

interface OAuthCredentials {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  tokenExpiry: Date;
  socialId: number;
}

async function refreshAccessTokenAndUpdateDB(credentials: OAuthCredentials): Promise<string> {
  const res = await axios.post('https://oauth2.googleapis.com/token', null, {
    params: {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const newAccessToken = res.data.access_token;
  const expiresInMs = res.data.expires_in * 1000;
  const tokenExpiry = new Date(Date.now() + expiresInMs);

  // Update DB
  await prisma.influencerSocialDetails.update({
    where: { id: credentials.socialId },
    data: {
      token: newAccessToken,
      expires_at: tokenExpiry,
    },
  });

  return newAccessToken;
}

async function fetchWithAutoRefresh<T>(
  requestFn: (token: string) => Promise<T>,
  credentials: OAuthCredentials
): Promise<T> {
  const now = new Date();

  // 🔁 Proactive check
  if (credentials.tokenExpiry && credentials.tokenExpiry <= now) {
    credentials.accessToken = await refreshAccessTokenAndUpdateDB(credentials);
  }

  try {
    return await requestFn(credentials.accessToken);
  } catch (error: unknown) {
    const isUnauthorized = error instanceof Error && 
      'response' in error && 
      typeof error.response === 'object' && 
      error.response !== null && 
      'status' in error.response && 
      error.response.status === 401;
    
    if (!isUnauthorized) throw error;

    // 🔁 Reactive fallback
    credentials.accessToken = await refreshAccessTokenAndUpdateDB(credentials);
    return await requestFn(credentials.accessToken);
  }
}

export async function getNewestYoutubeVideosWithRefresh(
  credentials: OAuthCredentials, 
  skip: number = 0,
  limit: number = 10
): Promise<NewestYoutubeVideo[]> {
  return await fetchWithAutoRefresh(async (accessToken) => {
    // Get uploads playlist ID
    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: 'contentDetails',
        mine: true,
      },
    });

    const uploadsPlaylistId =
      channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error('Could not retrieve uploads playlist ID.');
    }

    // Calculate pagination parameters for YouTube API
    // YouTube API uses pageToken for pagination, not numeric offsets
    // We'll need to fetch incrementally if skip > 0
    let currentPageToken: string | undefined = undefined;
    const currentSkip = 0;
    const maxResultsPerPage = Math.min(50, limit); // YouTube API max is 50

    // Fetch videos from uploads playlist
    const playlistItemsRes = await axios.get(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          part: 'contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: maxResultsPerPage,
        },
      }
    );
    
    // If we need to skip items, we need to fetch additional pages
    let allItems = [...playlistItemsRes.data.items];
    currentPageToken = playlistItemsRes.data.nextPageToken;
    
    // Continue fetching pages until we have enough items to satisfy the skip parameter
    while (currentSkip + allItems.length < skip + limit && currentPageToken) {
      const additionalPageRes = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            part: 'contentDetails',
            playlistId: uploadsPlaylistId,
            maxResults: maxResultsPerPage,
            pageToken: currentPageToken,
          },
        }
      );
      
      allItems = [...allItems, ...additionalPageRes.data.items];
      currentPageToken = additionalPageRes.data.nextPageToken;
    }
    
    // Apply skip and limit
    const paginatedItems = allItems.slice(skip, skip + limit);
    
    const videoIds = paginatedItems.map(
      (item: { contentDetails: { videoId: string } }) => item.contentDetails.videoId
    );
    
    if (videoIds.length === 0) {
      return [];
    }

    // Get full details + stats
    const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        part: 'snippet,statistics',
        id: videoIds.join(','),
      },
    });

    return videosRes.data.items.map(
      (video: YouTubeVideoResponse): NewestYoutubeVideo => ({
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl:
          video.snippet.thumbnails.high?.url ||
          video.snippet.thumbnails.medium?.url ||
          video.snippet.thumbnails.default?.url ||
          '',
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
        publishedDate: new Date(video.snippet.publishedAt),
        likes: video.statistics.likeCount ? parseInt(video.statistics.likeCount, 10) : undefined,
        comments: video.statistics.commentCount
          ? parseInt(video.statistics.commentCount, 10)
          : undefined,
        viewCount: video.statistics.viewCount
          ? parseInt(video.statistics.viewCount, 10)
          : undefined,
        socialId: credentials.socialId,
      })
    );
  }, credentials);
}
