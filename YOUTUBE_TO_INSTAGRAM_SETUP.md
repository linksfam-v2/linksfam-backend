# YouTube Short to Instagram Reel Feature Setup

This document outlines the setup required for the YouTube Short to Instagram Reel cross-posting feature.

## Prerequisites

1. **YouTube Data API**: Your application must have the `https://www.googleapis.com/auth/youtube.readonly` scope to access video metadata.
2. **Instagram Graph API**: Your application must have Instagram Graph API access with `instagram_content_publish` scope.
3. **Cloud Storage**: You need a cloud storage service to temporarily host videos for Instagram upload.

**Note**: Video downloading is done using `ytdl-core` library, not the YouTube API, as Google's YouTube Data API v3 does not provide video download functionality.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# YouTube API Configuration
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# Cloud Storage Configuration (Choose one)
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# Alternative: Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Cloud Storage Setup

### Option 1: AWS S3

1. Create an S3 bucket for video storage
2. Set up IAM user with S3 upload permissions
3. Configure CORS policy to allow Instagram access
4. Update the `uploadVideoToCloudStorage` function in `src/utility/reelUtils.ts`

### Option 2: Cloudinary

1. Sign up for Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the `uploadVideoToCloudStorage` function in `src/utility/reelUtils.ts`

## API Endpoint

### POST `/api/v1/social/post-youtube-short-to-instagram`

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "videoId": "youtube_video_id",
  "caption": "Optional caption for Instagram reel"
}
```

**Response:**
```json
{
  "success": true,
  "message": "YouTube Short successfully posted to Instagram Reel",
  "data": {
    "youtubeVideoId": "video_id",
    "youtubeVideoTitle": "Video Title",
    "instagramPostId": "instagram_post_id",
    "instagramMediaId": "instagram_media_id",
    "caption": "Posted caption"
  }
}
```

## Usage Flow

1. User must have both YouTube and Instagram accounts connected
2. User selects a YouTube Short from their videos
3. User clicks "Post to Instagram" button
4. Frontend calls the API endpoint with the video ID
5. Backend downloads the video from YouTube
6. Backend uploads the video to cloud storage
7. Backend creates Instagram media container
8. Backend publishes the reel to Instagram
9. Backend cleans up temporary files

## Error Handling

The API handles various error scenarios:
- Missing YouTube/Instagram connections
- Expired tokens (with automatic refresh)
- Video not found or access denied
- Cloud storage failures
- Instagram API errors

## Security Considerations

- Tokens are stored encrypted in the database
- Temporary video files are cleaned up after processing
- Only video owners can download their own videos
- Rate limiting should be implemented for the endpoint

## Testing

1. Ensure you have test accounts connected for both platforms
2. Test with various video lengths and formats
3. Test error scenarios (expired tokens, missing videos, etc.)
4. Monitor cloud storage usage and costs

## Troubleshooting

### Common Issues

1. **"Cloud storage not configured"**: Update the `uploadVideoToCloudStorage` function
2. **"YouTube token expired"**: Ensure refresh tokens are properly stored
3. **"Video not found"**: Verify the user owns the video and has proper permissions
4. **"Instagram API error"**: Check Instagram app permissions and user account type

### Logs

Check the following logs for debugging:
- YouTube API errors
- Cloud storage upload errors
- Instagram API errors
- File system operations

## Future Enhancements

1. Add support for video transcoding/optimization
2. Implement batch processing for multiple videos
3. Add scheduling functionality
4. Create analytics tracking for cross-platform posts
5. Add support for other platforms (TikTok, Twitter, etc.) 