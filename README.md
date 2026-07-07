# ModenixOS Client

Next.js 15 frontend for ModenixOS — store owner dashboard, platform admin panel, and public storefronts.

## Documentation

**Full handover documentation:** [`docs/README.md`](docs/README.md)

| Quick links | |
|-------------|---|
| [Installation](docs/03-installation.md) | Setup and build |
| [Environment variables](docs/04-environment-variables.md) | `.env.local` reference |
| [Pages & routes](docs/06-pages-and-routes.md) | Every UI route |
| [Authentication](docs/07-authentication.md) | Middleware and cookies |
| [Deployment](docs/11-deployment.md) | Production guide |

**Companion backend:** separate GitHub repo `modenixos-server` — see its `docs/README.md`.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev    # http://localhost:3000
```

Requires the **modenixos-server** API running on port 5000 (see that repo's `docs/03-installation.md`).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |

## Environment

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:5000/api/v1` |
| `ACCESS_TOKEN_SECRET` | Must match server |

Default URL: **http://localhost:3000**
