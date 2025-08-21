# Influencer Profile with Posts API Documentation

This document provides detailed information about the Influencer Profile API endpoint that fetches influencer data along with their social media posts.

## Endpoint
```
GET /profile/influencer/:username
```

## Description
Retrieves comprehensive influencer profile data including user information, social media details from multiple platforms, and paginated social media posts. This is a public endpoint that does not require authentication.

**Platform Priority Logic:**
- If both Instagram and YouTube are connected, Instagram posts will be returned
- If only one platform is connected, that platform's posts will be returned
- Both platform details are always included in the response regardless of which posts are shown

## URL Parameters
- `username` (string, required): The username of the influencer

## Query Parameters
- `skip` (number, optional, default: 0): Number of posts to skip for pagination
- `limit` (number, optional, default: 10, max: 50): Number of posts to return

## Request Example
```
GET /profile/influencer/johndoe?skip=0&limit=10
```

## Response Schema (Success - 200)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "email": "string|null",
      "phone": "string|null", 
      "type": "string",
      "createdAt": "string (ISO date)"
    },
    "influencer": {
      "id": "number",
      "name": "string|null",
      "city": "string|null",
      "ig_url": "string|null",
      "yt_url": "string|null",
      "amazon_tag": "string|null",
      "is_yt_eligible": "boolean",
      "is_insta_eligible": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    },
    "category": {
      "id": "number",
      "name": "string"
    },
    "socialDetails": {
      "instagramDetails": {
        "id": "number",
        "socialMediaType": "string",
        "name": "string|null",
        "username": "string|null",
        "biography": "string|null",
        "followersCount": "number|null",
        "followsCount": "number|null",
        "mediaCount": "number|null",
        "profilePictureUrl": "string|null",
        "website": "string|null",
        "isActive": "boolean",
        "provider": "string|null",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)"
      },
      "youtubeDetails": {
        "id": "number",
        "socialMediaType": "string",
        "name": "string|null",
        "username": "string|null",
        "biography": "string|null",
        "followersCount": "number|null",
        "followsCount": "number|null",
        "mediaCount": "number|null",
        "profilePictureUrl": "string|null",
        "website": "string|null",
        "isActive": "boolean",
        "provider": "string|null",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)"
      },
      "activePlatform": "string",        // Which platform's posts are being shown ("instagram" or "youtube")
      "connectedPlatforms": ["string"]   // Array of connected platform names
    },
    "posts": [
      {
        "id": "string",                   // Post/Video ID
        "title": "string",               // Post title or video title
        "description": "string",         // Full description/caption
        "mediaUrl": "string",            // Direct media URL or video URL
        "thumbnailUrl": "string|null",   // Thumbnail image URL
        "permalink": "string",           // Link to original post/video
        "publishedAt": "string (ISO date)", // Publication date
        "engagement": {
          "likes": "number",             // Number of likes
          "comments": "number",          // Number of comments
          "views": "number|null"         // Number of views (YouTube only)
        },
        "platform": "string",            // "instagram" or "youtube"
        "postType": "string"             // "video", "photo", "reel", etc.
      }
    ],
    "pagination": {
      "skip": "number",                  // Current skip value
      "limit": "number",                 // Current limit value  
      "total": "number",                 // Total posts available on active platform
      "returned": "number",              // Number of posts returned in this response
      "hasMore": "boolean",              // Whether more posts are available
      "nextSkip": "number|null"          // Next skip value for pagination (null if no more)
    },
    "stats": {
      "totalSocialPosts": "number",      // Total posts on active platform
      "activePlatform": "string",        // Which platform's posts are shown
      "totalEngagement": "number",       // Sum of likes + comments for returned posts
      "connectedPlatformsCount": "number" // Number of connected social platforms
    }
  }
}
```

## Response Example (Both Platforms Connected)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "john@example.com",
      "phone": "+1234567890",
      "type": "INFLUENCER",
      "createdAt": "2023-01-15T10:30:00.000Z"
    },
    "influencer": {
      "id": 5,
      "name": "John Doe",
      "city": "New York",
      "ig_url": "https://instagram.com/johndoe",
      "yt_url": "https://youtube.com/johndoe",
      "amazon_tag": "johndoe-20",
      "is_yt_eligible": true,
      "is_insta_eligible": true,
      "createdAt": "2023-01-15T10:35:00.000Z",
      "updatedAt": "2023-06-20T14:20:00.000Z"
    },
    "category": {
      "id": 2,
      "name": "Technology"
    },
    "socialDetails": {
      "instagramDetails": {
        "id": 10,
        "socialMediaType": "instagram",
        "name": "John Doe",
        "username": "johndoe",
        "biography": "Tech enthusiast sharing latest gadgets",
        "followersCount": 125000,
        "followsCount": 500,
        "mediaCount": 450,
        "profilePictureUrl": "https://instagram.com/profile/johndoe.jpg",
        "website": "https://johndoe.com",
        "isActive": true,
        "provider": "instagram",
        "createdAt": "2023-01-20T12:00:00.000Z",
        "updatedAt": "2023-06-20T08:30:00.000Z"
      },
      "youtubeDetails": {
        "id": 11,
        "socialMediaType": "youtube", 
        "name": "John Doe Tech",
        "username": "johndoe",
        "biography": "Weekly tech reviews and tutorials",
        "followersCount": 85000,
        "followsCount": 200,
        "mediaCount": 120,
        "profilePictureUrl": "https://youtube.com/profile/johndoe.jpg",
        "website": "https://johndoe.com",
        "isActive": true,
        "provider": "youtube",
        "createdAt": "2023-02-01T09:15:00.000Z",
        "updatedAt": "2023-06-19T16:45:00.000Z"
      },
      "activePlatform": "instagram",
      "connectedPlatforms": ["instagram", "youtube"]
    },
    "posts": [
      {
        "id": "18234567890123456",
        "title": "Just unboxed the latest smartphone! Amazing camera quality and...",
        "description": "Just unboxed the latest smartphone! Amazing camera quality and battery life. Full review coming soon! #tech #smartphone #review",
        "mediaUrl": "https://instagram.com/p/CdX1Y2Z3A4B/media/?size=l",
        "thumbnailUrl": "https://instagram.com/p/CdX1Y2Z3A4B/media/?size=m",
        "permalink": "https://instagram.com/p/CdX1Y2Z3A4B/",
        "publishedAt": "2023-06-22T15:30:00.000Z",
        "engagement": {
          "likes": 2450,
          "comments": 89,
          "views": null
        },
        "platform": "instagram",
        "postType": "photo"
      },
      {
        "id": "18234567890123457", 
        "title": "Behind the scenes of my studio setup! Swipe to see all the...",
        "description": "Behind the scenes of my studio setup! Swipe to see all the gear I use for content creation. Links in bio! #setup #studio #contentcreator",
        "mediaUrl": "https://instagram.com/p/CdW8X1Y2Z3A/media/?size=l",
        "thumbnailUrl": "https://instagram.com/p/CdW8X1Y2Z3A/media/?size=m", 
        "permalink": "https://instagram.com/p/CdW8X1Y2Z3A/",
        "publishedAt": "2023-06-21T12:15:00.000Z",
        "engagement": {
          "likes": 1890,
          "comments": 76,
          "views": null
        },
        "platform": "instagram",
        "postType": "carousel_album"
      }
    ],
    "pagination": {
      "skip": 0,
      "limit": 10,
      "total": 450,
      "returned": 2,
      "hasMore": true,
      "nextSkip": 10
    },
    "stats": {
      "totalSocialPosts": 450,
      "activePlatform": "instagram", 
      "totalEngagement": 4505,
      "connectedPlatformsCount": 2
    }
  }
}
```

## Response Example (Only YouTube Connected)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 124,
      "email": "jane@example.com", 
      "phone": null,
      "type": "INFLUENCER",
      "createdAt": "2023-03-10T14:20:00.000Z"
    },
    "influencer": {
      "id": 6,
      "name": "Jane Smith",
      "city": "Los Angeles",
      "ig_url": null,
      "yt_url": "https://youtube.com/janesmith",
      "amazon_tag": "janesmith-20",
      "is_yt_eligible": true,
      "is_insta_eligible": false,
      "createdAt": "2023-03-10T14:25:00.000Z",
      "updatedAt": "2023-06-20T10:15:00.000Z"
    },
    "category": {
      "id": 3,
      "name": "Lifestyle"
    },
    "socialDetails": {
      "instagramDetails": null,
      "youtubeDetails": {
        "id": 12,
        "socialMediaType": "youtube",
        "name": "Jane Smith Vlogs",
        "username": "janesmith",
        "biography": "Daily vlogs and lifestyle content",
        "followersCount": 45000,
        "followsCount": 150,
        "mediaCount": 85,
        "profilePictureUrl": "https://youtube.com/profile/janesmith.jpg",
        "website": "https://janesmith.blog",
        "isActive": true,
        "provider": "youtube",
        "createdAt": "2023-03-15T11:30:00.000Z",
        "updatedAt": "2023-06-20T09:45:00.000Z"
      },
      "activePlatform": "youtube",
      "connectedPlatforms": ["youtube"]
    },
    "posts": [
      {
        "id": "dQw4w9WgXcQ",
        "title": "My Morning Routine for Productivity | Lifestyle Vlog",
        "description": "Join me for my complete morning routine that keeps me productive throughout the day...",
        "mediaUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        "permalink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
        "publishedAt": "2023-06-20T08:00:00.000Z",
        "engagement": {
          "likes": 1250,
          "comments": 84,
          "views": 15420
        },
        "platform": "youtube",
        "postType": "video"
      }
    ],
    "pagination": {
      "skip": 0,
      "limit": 10,
      "total": 85,
      "returned": 1,
      "hasMore": true,
      "nextSkip": 10
    },
    "stats": {
      "totalSocialPosts": 85,
      "activePlatform": "youtube",
      "totalEngagement": 1334,
      "connectedPlatformsCount": 1
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Username parameter is required and must be a valid string"
}
```

### 404 Not Found  
```json
{
  "success": false,
  "message": "Social details not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong!"
}
```

## Key Features

### 1. **Multi-Platform Support**
- Handles influencers with Instagram, YouTube, or both platforms connected
- Provides separate details for each connected platform
- Clear indication of which platform's posts are being displayed

### 2. **Platform Prioritization** 
- **Instagram First**: When both platforms are connected, Instagram posts are shown
- **Fallback**: If Instagram is not available, YouTube posts are displayed
- **Transparency**: `activePlatform` field shows which platform's content is being returned

### 3. **Comprehensive Social Details**
- `instagramDetails`: Full Instagram account information (null if not connected)
- `youtubeDetails`: Full YouTube account information (null if not connected)
- `connectedPlatforms`: Array of all connected platform names
- `connectedPlatformsCount`: Total number of connected platforms

### 4. **Unified Post Format**
- Consistent structure for both Instagram and YouTube content
- Platform-specific fields (e.g., `views` for YouTube only)
- Engagement metrics normalized across platforms

### 5. **Enhanced Statistics**
- `activePlatform`: Which platform's posts are currently shown
- `totalSocialPosts`: Total posts available on the active platform
- `totalEngagement`: Sum of likes and comments for returned posts
- `connectedPlatformsCount`: Number of social platforms connected

## Usage Scenarios

### Scenario 1: Both Platforms Connected
- User has both Instagram and YouTube accounts linked
- API returns Instagram posts (prioritized)
- Both `instagramDetails` and `youtubeDetails` are populated
- `activePlatform` = "instagram"
- `connectedPlatforms` = ["instagram", "youtube"]

### Scenario 2: Only Instagram Connected
- User has only Instagram account linked  
- API returns Instagram posts
- `instagramDetails` is populated, `youtubeDetails` is null
- `activePlatform` = "instagram"
- `connectedPlatforms` = ["instagram"]

### Scenario 3: Only YouTube Connected
- User has only YouTube account linked
- API returns YouTube videos
- `youtubeDetails` is populated, `instagramDetails` is null
- `activePlatform` = "youtube" 
- `connectedPlatforms` = ["youtube"]

This API design provides maximum flexibility for frontend applications to display influencer profiles regardless of which social media platforms they have connected. 