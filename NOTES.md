# koinYOU Notes

## Feature Ideas

- **Highlights & sticky notes** — let users highlight verses and add sticky notes, like a real Bible
- **Character/avatar builder** — replace the cross SVG placeholder with a custom character picker
- **Cloudinary for profile pics** — if avatar builder doesn't pan out, store uploads in Cloudinary so they don't reset on redeploy

## Architecture Decisions

### JWT over session-based auth (Passport.js sessions)

Passport.js is still used here — it handles the Google OAuth flow (redirects, callbacks, user creation). The change was switching from Passport's session management to JWT for how the user stays logged in after OAuth.

**Why JWT:**
- Sessions require a store (we were using MongoDB via connect-mongo) — every authenticated request hits the DB just to verify identity
- Vercel is serverless — each function invocation is stateless, so in-memory sessions don't persist across requests. A MongoDB session store works but adds latency on every request
- JWT is self-contained — the token is signed and verified locally with no DB lookup, which is faster and naturally fits serverless
- Simpler infrastructure — removed express-session and connect-mongo as dependencies entirely

**How it works now:**
1. User logs in via Google OAuth (Passport handles this)
2. On callback, server signs a JWT with the user's MongoDB ID and sets it as an httpOnly cookie
3. On every subsequent request, the `attachUser` middleware reads the cookie, verifies the JWT, and fetches the user from MongoDB once
4. Protected routes just check `req.user`

**Trade-off:** JWT tokens can't be invalidated server-side (unlike sessions). If you wanted to force-logout a user, you'd need a token denylist. Acceptable for this app.

## To-do

- Add NIV_ID and BIBLE_API_KEY to Vercel frontend env vars and redeploy
- Push all uncommitted frontend changes
