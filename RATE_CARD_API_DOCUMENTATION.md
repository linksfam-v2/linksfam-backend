# Rate Card API Documentation

This document provides detailed information about the Rate Card API endpoints for influencers. The Rate Card feature allows influencers to showcase their content pricing (Reel, Post, Link-in-bio, Custom Combo, etc.) on their shop page to attract brands and streamline collaboration.

## Base URLs
- **Full Base URL**: `https://backend.linksfam.com/api/v1`
- **Authenticated endpoints**: `/api/influencer/rate-card` (Add, Update)
- **Public endpoints**: `/api/rate-card` (Get Rate Card)

## Authentication
- **Add Rate Card** and **Update Rate Card** endpoints require authentication. Include the JWT token in the request headers:
```
Authorization: Bearer <your-jwt-token>
```
- **Get Rate Card** endpoint is public and does not require authentication.

---

## 1. Add Rate Card

### Endpoint
```
POST https://backend.linksfam.com/api/v1/influencer/rate-card
```

### Description
Creates a new rate card for the authenticated influencer. Each influencer can have only one rate card. If a rate card already exists, use the update endpoint instead.

### Request Schema
```json
{
  "reelCharge": "number (optional)",                     // Instagram Reel pricing
  "storyCharge": "number (optional)",                    // Instagram Story pricing
  "carouselPostCharge": "number (optional)",             // Instagram Carousel Post pricing
  "linkInBioCharge": "number (optional)",                // Link in Bio (7 Days) pricing
  "instagramComboPackage": "number (optional)",          // Instagram Combo Package pricing
  "youtubeShortCharge": "number (optional)",             // YouTube Short pricing
  "youtubeIntegrationCharge": "number (optional)",       // YouTube Integration pricing
  "youtubeDedicatedVideoCharge": "number (optional)",    // YouTube Dedicated Video pricing
  "customComboPackage": "string (optional)",             // Custom Combo/Package description
  "minimumCollaborationValue": "number (optional)",      // Minimum collaboration value
  "availableForBarterDeals": "boolean (optional)"        // Available for barter deals
}
```

### Request Example
```json
{
  "reelCharge": 2000,
  "storyCharge": 800,
  "carouselPostCharge": 1500,
  "linkInBioCharge": 500,
  "instagramComboPackage": 3500,
  "youtubeShortCharge": 2500,
  "youtubeIntegrationCharge": 4000,
  "youtubeDedicatedVideoCharge": 8000,
  "customComboPackage": "Custom package includes 1 Reel + 3 Stories + Link in Bio for 1 week",
  "minimumCollaborationValue": 5000,
  "availableForBarterDeals": true
}
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "message": "Rate card created successfully",
  "data": {
    "id": "number",                                // Auto-generated rate card ID
    "reelCharge": "number|null",                   // Instagram Reel pricing
    "storyCharge": "number|null",                  // Instagram Story pricing
    "carouselPostCharge": "number|null",           // Instagram Carousel Post pricing
    "linkInBioCharge": "number|null",              // Link in Bio pricing
    "instagramComboPackage": "number|null",        // Instagram Combo Package pricing
    "youtubeShortCharge": "number|null",           // YouTube Short pricing
    "youtubeIntegrationCharge": "number|null",     // YouTube Integration pricing
    "youtubeDedicatedVideoCharge": "number|null",  // YouTube Dedicated Video pricing
    "customComboPackage": "string|null",           // Custom Combo/Package description
    "minimumCollaborationValue": "number|null",    // Minimum collaboration value
    "availableForBarterDeals": "boolean",          // Available for barter deals
    "influencerId": "number",                      // Associated influencer ID
    "createdAt": "string (ISO date)",              // Creation timestamp
    "updatedAt": "string (ISO date)"               // Last update timestamp
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "message": "Rate card created successfully",
  "data": {
    "id": 1,
    "reelCharge": 2000,
    "storyCharge": 800,
    "carouselPostCharge": 1500,
    "linkInBioCharge": 500,
    "instagramComboPackage": 3500,
    "youtubeShortCharge": 2500,
    "youtubeIntegrationCharge": 4000,
    "youtubeDedicatedVideoCharge": 8000,
    "customComboPackage": "Custom package includes 1 Reel + 3 Stories + Link in Bio for 1 week",
    "minimumCollaborationValue": 5000,
    "availableForBarterDeals": true,
    "influencerId": 5,
    "createdAt": "2023-06-23T10:30:00.000Z",
    "updatedAt": "2023-06-23T10:30:00.000Z"
  }
}
```

### Error Responses
- **400 Bad Request**: Rate card already exists, invalid numeric values, or validation errors
- **404 Not Found**: Influencer profile not found
- **500 Internal Server Error**: Server error

---

## 2. Update Rate Card

### Endpoint
```
PUT https://backend.linksfam.com/api/v1/influencer/rate-card
```

### Description
Updates an existing rate card for the authenticated influencer. Only provided fields will be updated. If no rate card exists, use the create endpoint instead.

### Request Schema
```json
{
  "reelCharge": "number (optional)",                     // Instagram Reel pricing
  "storyCharge": "number (optional)",                    // Instagram Story pricing
  "carouselPostCharge": "number (optional)",             // Instagram Carousel Post pricing
  "linkInBioCharge": "number (optional)",                // Link in Bio (7 Days) pricing
  "instagramComboPackage": "number (optional)",          // Instagram Combo Package pricing
  "youtubeShortCharge": "number (optional)",             // YouTube Short pricing
  "youtubeIntegrationCharge": "number (optional)",       // YouTube Integration pricing
  "youtubeDedicatedVideoCharge": "number (optional)",    // YouTube Dedicated Video pricing
  "customComboPackage": "string (optional)",             // Custom Combo/Package description
  "minimumCollaborationValue": "number (optional)",      // Minimum collaboration value
  "availableForBarterDeals": "boolean (optional)"        // Available for barter deals
}
```

### Request Example (Partial Update)
```json
{
  "reelCharge": 2500,
  "storyCharge": 1000,
  "customComboPackage": "Updated: Custom package includes 1 Reel + 5 Stories + Link in Bio for 2 weeks",
  "availableForBarterDeals": false
}
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "message": "Rate card updated successfully",
  "data": {
    "id": "number",                                // Rate card ID
    "reelCharge": "number|null",                   // Instagram Reel pricing
    "storyCharge": "number|null",                  // Instagram Story pricing
    "carouselPostCharge": "number|null",           // Instagram Carousel Post pricing
    "linkInBioCharge": "number|null",              // Link in Bio pricing
    "instagramComboPackage": "number|null",        // Instagram Combo Package pricing
    "youtubeShortCharge": "number|null",           // YouTube Short pricing
    "youtubeIntegrationCharge": "number|null",     // YouTube Integration pricing
    "youtubeDedicatedVideoCharge": "number|null",  // YouTube Dedicated Video pricing
    "customComboPackage": "string|null",           // Custom Combo/Package description
    "minimumCollaborationValue": "number|null",    // Minimum collaboration value
    "availableForBarterDeals": "boolean",          // Available for barter deals
    "influencerId": "number",                      // Associated influencer ID
    "createdAt": "string (ISO date)",              // Creation timestamp
    "updatedAt": "string (ISO date)"               // Last update timestamp
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "message": "Rate card updated successfully",
  "data": {
    "id": 1,
    "reelCharge": 2500,
    "storyCharge": 1000,
    "carouselPostCharge": 1500,
    "linkInBioCharge": 500,
    "instagramComboPackage": 3500,
    "youtubeShortCharge": 2500,
    "youtubeIntegrationCharge": 4000,
    "youtubeDedicatedVideoCharge": 8000,
    "customComboPackage": "Updated: Custom package includes 1 Reel + 5 Stories + Link in Bio for 2 weeks",
    "minimumCollaborationValue": 5000,
    "availableForBarterDeals": false,
    "influencerId": 5,
    "createdAt": "2023-06-23T10:30:00.000Z",
    "updatedAt": "2023-06-23T15:45:00.000Z"
  }
}
```

### Error Responses
- **400 Bad Request**: Invalid numeric values or validation errors
- **404 Not Found**: Influencer profile not found or rate card not found
- **500 Internal Server Error**: Server error

---

## 3. Get Rate Card

### Endpoint
```
GET https://backend.linksfam.com/api/v1/rate-card
```

### Description
Retrieves the rate card for a specific influencer. This is a public endpoint that does not require authentication and is used to display pricing on influencer shop pages.

### Query Parameters
- `influencerId` (number, required): The ID of the influencer whose rate card to fetch

### Request Example
```
GET https://backend.linksfam.com/api/v1/rate-card?influencerId=5
```

### Response Schema (Success - 200)
```json
{
  "success": true,
  "data": {
    "influencer": {
      "id": "number",              // Influencer ID
      "name": "string|null",       // Influencer name
      "city": "string|null"        // Influencer city
    },
    "rateCard": {
      "id": "number",                                // Rate card ID
      "reelCharge": "number|null",                   // Instagram Reel pricing
      "storyCharge": "number|null",                  // Instagram Story pricing
      "carouselPostCharge": "number|null",           // Instagram Carousel Post pricing
      "linkInBioCharge": "number|null",              // Link in Bio pricing
      "instagramComboPackage": "number|null",        // Instagram Combo Package pricing
      "youtubeShortCharge": "number|null",           // YouTube Short pricing
      "youtubeIntegrationCharge": "number|null",     // YouTube Integration pricing
      "youtubeDedicatedVideoCharge": "number|null",  // YouTube Dedicated Video pricing
      "customComboPackage": "string|null",           // Custom Combo/Package description
      "minimumCollaborationValue": "number|null",    // Minimum collaboration value
      "availableForBarterDeals": "boolean",          // Available for barter deals
      "createdAt": "string (ISO date)",              // Creation timestamp
      "updatedAt": "string (ISO date)"               // Last update timestamp
    }
  }
}
```

### Response Example (Success)
```json
{
  "success": true,
  "data": {
    "influencer": {
      "id": 5,
      "name": "John Doe",
      "city": "New York"
    },
    "rateCard": {
      "id": 1,
      "reelCharge": 2500,
      "storyCharge": 1000,
      "carouselPostCharge": 1500,
      "linkInBioCharge": 500,
      "instagramComboPackage": 3500,
      "youtubeShortCharge": 2500,
      "youtubeIntegrationCharge": 4000,
      "youtubeDedicatedVideoCharge": 8000,
      "customComboPackage": "Custom package includes 1 Reel + 5 Stories + Link in Bio for 2 weeks",
      "minimumCollaborationValue": 5000,
      "availableForBarterDeals": false,
      "createdAt": "2023-06-23T10:30:00.000Z",
      "updatedAt": "2023-06-23T15:45:00.000Z"
    }
  }
}
```

### Error Responses
- **400 Bad Request**: Missing or invalid influencerId
- **404 Not Found**: Influencer not found or rate card not found
- **500 Internal Server Error**: Server error

---

## General Error Response Schema
```json
{
  "success": false,
  "message": "string",      // Error description
  "error": "object|null"    // Additional error details (in development)
}
```

## Validation Rules

### Add/Update Rate Card Validation
- All pricing fields (`reelCharge`, `storyCharge`, etc.): Must be non-negative numbers if provided
- `customComboPackage`: Maximum 1000 characters if provided
- `availableForBarterDeals`: Must be boolean if provided
- `minimumCollaborationValue`: Must be non-negative number if provided

### Get Rate Card Validation
- `influencerId`: Required, must be a valid positive integer

## Business Rules

### Rate Card Management
- Each influencer can have only one rate card
- Rate cards are optional - influencers can choose to add them or skip for now
- All pricing fields are optional, allowing flexible pricing models
- Rate cards are publicly visible on influencer shop pages
- Only the influencer can create/update their own rate card

### UI/UX Integration
- Rate cards display in a "🧾 Rates & Offers" or "📋 Work With Me" section
- Empty rate cards are not displayed on shop pages
- Rate cards use clean card format with category tabs (Instagram / YouTube / Custom)
- "Update Your Rates" button visible only when influencer is logged in

## Sample Rate Card Display Format
```
📋 Work With Me

🎥 YouTube:
- Shorts: ₹2500
- Dedicated Video: ₹8000
- Integration: ₹4000

📸 Instagram:
- Reel: ₹2500
- Story: ₹1000
- Carousel Post: ₹1500
- Link in Bio: ₹500
- Combo Package: ₹3500

💼 Custom:
- Custom package includes 1 Reel + 5 Stories + Link in Bio for 2 weeks

📋 Notes:
- Minimum collaboration value: ₹5000
- Barter deals: Not available
```

## Status Codes Summary
- **200**: Success
- **400**: Bad Request (validation errors, invalid parameters, rate card already exists)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found (influencer/rate card doesn't exist)
- **500**: Internal Server Error

## Rate Card Categories

### Instagram Pricing
- **Reel Charge**: Pricing for Instagram Reels
- **Story Charge**: Pricing for Instagram Stories
- **Carousel Post**: Pricing for Instagram Carousel Posts
- **Link in Bio**: Pricing for Link in Bio placement (7 Days)
- **Instagram Combo Package**: Pricing for combined Instagram services

### YouTube Pricing
- **YouTube Short**: Pricing for YouTube Shorts
- **YouTube Integration**: Pricing for product integration in existing videos
- **YouTube Dedicated Video**: Pricing for dedicated product videos

### Other Offers
- **Custom Combo Package**: Free text field for describing custom packages
- **Minimum Collaboration Value**: Minimum budget required for collaborations
- **Available for Barter Deals**: Whether influencer accepts non-monetary collaborations 