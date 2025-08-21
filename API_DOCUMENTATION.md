# API Documentation

## Public Profile Endpoints

### Get Influencer Profile by Username

**Endpoint:** `GET /api/v1/profile/influencer/:username`

**Description:** Retrieves an influencer's public profile information by their username. This endpoint does not require authentication and is designed for public access.

**Parameters:**
- `username` (path parameter, required): The username of the influencer as stored in the `InfluencerSocialDetails` table

**Response Format:**
```json
{
  "code": 200,
  "status": "Success",
  "message": "Influencer profile fetched successfully!",
  "data": {
    "user": {
      "id": 1,
      "email": "influencer@example.com",
      "phone": "+1234567890",
      "isActive": true,
      "type": "INFLUENCER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "referralCode": "ABC123"
    },
    "influencer": {
      "id": 1,
      "categoryId": 1,
      "name": "Influencer Name",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "ig_url": "https://instagram.com/username",
      "yt_url": "https://youtube.com/channel/...",
      "amazon_tag": "tag-20",
      "is_yt_eligible": true,
      "is_insta_eligible": true,
      "category": {
        "id": 1,
        "name": "Technology"
      },
      "socialAccounts": [
        {
          "id": 1,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "facebook": "facebook_handle",
          "instagram": "instagram_handle",
          "x": "x_handle",
          "youtube": "youtube_handle"
        }
      ]
    },
    "socialDetails": {
      "id": 1,
      "socialMediaType": "youtube",
      "name": "Channel Name",
      "email": "channel@example.com",
      "provider": "google_provider_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true,
      "biography": "Channel description...",
      "followers_count": 10000,
      "follows_count": 100,
      "media_count": 50,
      "profile_picture_url": "https://example.com/profile.jpg",
      "stories": 5,
      "username": "channel_username",
      "website": "https://youtube.com/@channel_username"
    },
    "shopPosts": [
      {
        "id": 1,
        "title": "Product Title",
        "description": "Product description...",
        "productUrls": ["https://example.com/product1"],
        "mediaUrl": "https://example.com/media.jpg",
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

1. **Invalid Username (400 Bad Request):**
```json
{
  "code": 400,
  "status": "error",
  "message": "Username parameter is required and must be a valid string",
  "error": {}
}
```

2. **Influencer Not Found (404 Not Found):**
```json
{
  "code": 400,
  "status": "error",
  "message": "Influencer not found with the provided username",
  "error": {}
}
```

3. **Inactive Profile (404 Not Found):**
```json
{
  "code": 400,
  "status": "error",
  "message": "Influencer profile is not active",
  "error": {}
}
```

4. **Server Error (500 Internal Server Error):**
```json
{
  "code": 400,
  "status": "error",
  "message": "Internal server error while fetching influencer profile",
  "error": {}
}
```

**Security Notes:**
- This endpoint excludes sensitive information such as:
  - Authentication tokens
  - Refresh tokens
  - OTP codes
  - Phyllo account IDs
  - Token expiration times
- Only active users and social accounts are returned
- No authentication is required for this public endpoint

**Usage Examples:**

```bash
# Get influencer profile by username
curl -X GET "https://your-api-domain.com/api/v1/profile/influencer/john_doe"

# Response will include user info, influencer details, social details, and shop posts
``` 