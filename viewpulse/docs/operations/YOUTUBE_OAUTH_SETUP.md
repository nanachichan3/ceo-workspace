# YouTube OAuth Setup — Vercel Deployment

## Overview

Viewpulse uses YouTube OAuth for authenticated analytics. This document covers the required environment variables and setup steps.

## Required Environment Variables

Configure these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Value | Notes |
|----------|-------|-------|
| `YOUTUBE_CLIENT_ID` | Google Cloud OAuth Client ID | From Google Cloud Console |
| `YOUTUBE_CLIENT_SECRET` | Google Cloud OAuth Client Secret | From Google Cloud Console |
| `YOUTUBE_REDIRECT_URI` | `https://viewpulse.xyz/api/youtube/auth/callback` | Update for your domain |

## Google Cloud Console Setup

### 1. Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. Add authorized redirect URI: `https://viewpulse.xyz/api/youtube/auth/callback`

### 2. Copy Credentials to Vercel

```
YOUTUBE_CLIENT_ID = your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET = your-client-secret
YOUTUBE_REDIRECT_URI = https://viewpulse.xyz/api/youtube/auth/callback
```

### 3. Update OAuth URI for Local Development

For local dev, add localhost variant:
- Redirect URI: `http://localhost:3000/api/youtube/auth/callback`

## Local Development

Create `.env.local` with:
```bash
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/auth/callback
```

## Verification

After setting up:
1. Visit Viewpulse production URL
2. Click "Connect YouTube" button
3. Complete OAuth flow
4. Verify channel data appears in dashboard

## Troubleshooting

### "redirect_uri_mismatch" Error
- Ensure `YOUTUBE_REDIRECT_URI` in Vercel matches exactly
- For production: `https://your-domain.com/api/youtube/auth/callback`
- For local: `http://localhost:3000/api/youtube/auth/callback`

### OAuth Scopes Required
- `https://www.googleapis.com/auth/youtube.readonly` — View YouTube channel data
- `https://www.googleapis.com/auth/yt-analytics.readonly` — View YouTube analytics

## Related Links

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [YouTube Analytics API](https://developers.google.com/youtube/analytics)
- [Google Cloud OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
