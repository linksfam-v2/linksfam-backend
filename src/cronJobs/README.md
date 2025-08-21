# Cron Jobs

This directory contains all the scheduled cron jobs for the LinksFam backend application.

## Available Cron Jobs

### Company Cron Jobs
- **companyLedger.js** - Manages company ledger entries
- **companyInvoice.js** - Handles company invoice generation

### Influencer Cron Jobs
- **influencerLedger.js** - Manages influencer ledger entries
- **influencersInvoice.js** - Handles influencer invoice generation (runs weekly on Sundays at 11:30 PM IST)
- **refreshInstagramReelUrls.js** - Refreshes expired Instagram reel URLs (runs daily at midnight IST)

## Instagram Reel URL Refresh Cron Job

### Purpose
Instagram Graph API provides signed URLs for media content that expire after a certain period. This cron job refreshes these URLs daily to ensure they remain accessible.

### Schedule
- **Frequency**: Daily
- **Time**: 00:00 (midnight) IST
- **Timezone**: Asia/Kolkata

### Functionality
1. Fetches all active Instagram social accounts from `InfluencerSocialDetails`
2. For each account, retrieves all associated Instagram reels from `NewestInstagramReels`
3. Calls Instagram Graph API to get fresh signed URLs for each reel
4. Updates the database with new `media_url` and `thumbnail_url`
5. Handles errors gracefully:
   - Marks accounts as inactive if tokens are invalid
   - Logs but continues if individual reels are not found
   - Implements rate limiting with 100ms delays between requests

### API Endpoint Used
```
GET https://graph.instagram.com/v22.0/{media-id}
?access_token={access-token}
&fields=id,media_type,media_url,thumbnail_url
```

### Error Handling
- **401/403 errors**: Marks the social account as inactive
- **404 errors**: Logs that the reel may have been deleted
- **Rate limiting**: 100ms delay between API calls
- **Timeout**: 10-second timeout for each API request

### Monitoring
Uses Cronitor for monitoring job execution with states:
- `run`: Job started
- `complete`: Job completed successfully  
- `fail`: Job failed with errors

### Dependencies
- `node-cron`: For scheduling
- `axios`: For HTTP requests to Instagram API
- `cronitor`: For monitoring
- `@prisma/client`: For database operations 