import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from './cloudStorage.js';
import ytdl from 'ytdl-core';

const streamPipeline = promisify(pipeline);

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
}

export interface InstagramReelResponse {
  id: string;
  media_id?: string;
}

/**
 * Download YouTube video using ytdl-core
 * Note: This downloads the video directly from YouTube, not using the API
 */
export async function downloadYouTubeVideo(
  videoId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _accessToken: string
): Promise<string> {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const videoPath = path.join(tempDir, `${videoId}_${uuidv4()}.mp4`);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Check if video exists and is accessible
    const info = await ytdl.getInfo(videoUrl);
    
    // Filter for video formats suitable for Instagram (mp4, reasonable quality)
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highest',
      filter: format => format.container === 'mp4' && format.hasVideo && format.hasAudio
    });

    if (!format) {
      throw new Error('No suitable video format found');
    }

    // Download video stream
    const videoStream = ytdl(videoUrl, { format });
    const writeStream = fs.createWriteStream(videoPath);
    
    // Stream the video to file
    await streamPipeline(videoStream, writeStream);
    
    return videoPath;
  } catch (error) {
    console.error('Error downloading YouTube video:', error);
    throw new Error(`Failed to download YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get YouTube video details
 */
export async function getYouTubeVideoDetails(
  videoId: string,
  accessToken: string
): Promise<YouTubeVideoDetails> {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        part: 'snippet,contentDetails',
        id: videoId
      }
    });

    const video = response.data.items?.[0];
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
      duration: video.contentDetails.duration
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    throw new Error(`Failed to fetch video details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload video to cloud storage and return public URL
 */
export async function uploadVideoToCloudStorage(videoPath: string): Promise<string> {
  return await uploadToS3(videoPath);
}

/**
 * Create Instagram media container for reel
 */
export async function createInstagramMediaContainer(
  igUserId: string,
  videoUrl: string,
  caption: string,
  accessToken: string
): Promise<string> {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${igUserId}/media`,
      null,
      {
        params: {
          media_type: 'REELS',
          video_url: videoUrl,
          caption: caption,
          access_token: accessToken
        },
        timeout: 60000 // 1 minute timeout
      }
    );

    return response.data.id;
  } catch (error) {
    console.error('Error creating Instagram media container:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Instagram API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw new Error(`Failed to create media container: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Publish Instagram reel
 */
export async function publishInstagramReel(
  igUserId: string,
  creationId: string,
  accessToken: string
): Promise<InstagramReelResponse> {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token: accessToken
        },
        timeout: 60000 // 1 minute timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error publishing Instagram reel:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Instagram API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw new Error(`Failed to publish reel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get Instagram user ID from access token
 */
export async function getInstagramUserId(accessToken: string): Promise<string> {
  try {
    const response = await axios.get('https://graph.instagram.com/me', {
      params: {
        fields: 'id',
        access_token: accessToken
      }
    });

    return response.data.id;
  } catch (error) {
    console.error('Error getting Instagram user ID:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Instagram API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw new Error(`Failed to get Instagram user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clean up temporary files
 */
export function cleanupTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
}

/**
 * Refresh YouTube access token if expired
 */
export async function refreshYouTubeToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing YouTube token:', error);
    throw new Error(`Failed to refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 