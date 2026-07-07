# ModenixOS Client — Documentation

Next.js 15 frontend for ModenixOS — store owner dashboard, platform admin panel, and public storefronts.

**Companion app:** `modenixos-server` (separate GitHub repository) — API and backend docs in that repo's `docs/` folder.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev    # http://localhost:3000
```

Requires **modenixos-server** running on port 5000 (install from that repository's `docs/03-installation.md`).

---

## Documentation index

| # | Document | Description |
|---|----------|-------------|
| 1 | [Project Overview](01-project-overview.md) | UI features, pages, user flows |
| 2 | [Tech Stack](02-tech-stack.md) | Next.js, React, libraries |
| 3 | [Installation Guide](03-installation.md) | Local setup and production build |
| 4 | [Environment Variables](04-environment-variables.md) | `.env.local` reference |
| 5 | [Folder Structure](05-folder-structure.md) | App Router, components, actions |
| 6 | [Pages & Routes](06-pages-and-routes.md) | Every page and route group |
| 7 | [Authentication](07-authentication.md) | Middleware, cookies, role routing |
| 8 | [API Integration](08-api-integration.md) | Server Actions, HTTP client, public API |
| 9 | [Business Logic](09-business-logic.md) | Dashboard, storefront, themes |
| 10 | [Configuration](10-configuration.md) | next.config, middleware, scripts |
| 11 | [Deployment Guide](11-deployment.md) | Vercel and VPS deployment |
| 12 | [Security](12-security.md) | Client-side security notes |
| 13 | [Troubleshooting](13-troubleshooting.md) | Common issues |
| 14 | [Known Limitations](14-known-limitations.md) | Documented gaps |
| 15 | [Future Improvements](15-future-improvements.md) | Suggested enhancements |
| 16 | [Contributing](16-contributing.md) | Client dev conventions |

---

## Default URL

**http://localhost:3000**

## API dependency

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1` and match `ACCESS_TOKEN_SECRET` with the server.
