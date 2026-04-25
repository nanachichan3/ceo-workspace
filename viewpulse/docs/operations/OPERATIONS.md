# Operations — ViewPulse

## Deployment

**Platform:** Vercel
**Region:** Unknown (Cloud provider)
**URL:** https://viewpulse.xyz (or similar)

## YouTube OAuth

YouTube OAuth is now fully implemented and requires environment variables to be configured:

See [YOUTUBE_OAUTH_SETUP.md](./YOUTUBE_OAUTH_SETUP.md) for detailed setup instructions.

Quick setup:
1. Create OAuth credentials in Google Cloud Console
2. Set `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REDIRECT_URI` in Vercel
3. Add authorized redirect URI matching your production domain

## Maintenance

### Regular Tasks
| Task | Frequency | Owner |
|------|-----------|-------|
| Dependency updates | Weekly | CTO |
| Monitor uptime | Daily | Heartbeat |
| YouTube API changes | As needed | CTO |

### Known Fragilities
1. **Browser compatibility** — CSS assumes modern browser
2. **Large file handling** — No progress indicator

## Support

### User Issues
- Privacy questions → Direct to docs
- YouTube auth errors → Check OAuth setup guide
- Feature requests → GitHub discussions

### No Current Support Infrastructure
- No email support
- No status page
- No bug bounty program

## Security

### Privacy Guarantees
1. **No data collection** — Analytics data stays with YouTube API
2. **No cookies** — No tracking cookies
3. **Minimal analytics** — PostHog for product metrics only
4. **Open source** — Code can be audited

### Audit Needed
- [ ] Security best practices review
- [ ] Dependency audit
- [ ] CSP headers review

## Environment Variables

```bash
# YouTube OAuth (required for authenticated features)
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=https://viewpulse.xyz/api/youtube/auth/callback

# Optional
NEXT_PUBLIC_GITHUB_URL=https://github.com/nanachichan3/youtube-analytic
```
