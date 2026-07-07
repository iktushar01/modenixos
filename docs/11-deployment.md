# Deployment Guide

[← Back to index](README.md)

## Prerequisites

- Production build of **modenixos-server** deployed and reachable
- Environment variables configured (see [Environment Variables](04-environment-variables.md))
- `ACCESS_TOKEN_SECRET` matches server production value

---

## Build

```bash
cd modenixos-client
pnpm install
pnpm build
```

---

## Environment (production)

```env
NEXT_PUBLIC_APP_NAME=ModenixOS
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ACCESS_TOKEN_SECRET=<production-secret-matching-server>
```

---

## Vercel (recommended)

1. Import repository / connect `modenixos-client` directory
2. Framework preset: **Next.js**
3. Set environment variables in project settings
4. Deploy

### Cross-origin cookies

If client and API are on different domains:

- Server `FRONTEND_URL` must match client URL
- Server cookies use `sameSite: "none"` and `secure: true` in production
- CORS on server must include client origin

---

## VPS / Node

```bash
pnpm build
pnpm start   # default port 3000
```

Use a reverse proxy (Nginx — **not included in repo**) for HTTPS.

Example topology:

```
https://yourdomain.com      → Next.js :3000
https://api.yourdomain.com  → Express :5000
```

---

## Post-deploy checks

| Check | URL |
|-------|-----|
| Landing | `https://yourdomain.com` |
| Login | Auth cookies set, dashboard loads |
| Storefront | `https://yourdomain.com/store/{slug}` |
| Images | Cloudinary images render (update `next.config.mjs` if needed) |

---

## Related documentation

- **modenixos-server** repository -> `docs/11-deployment.md`
- [Troubleshooting](13-troubleshooting.md)
