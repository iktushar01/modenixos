# Installation Guide

[← Back to index](README.md)

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ |
| pnpm | 11.9 (see `packageManager` in `package.json`) |
| modenixos-server | Running on port 5000 |
| PostgreSQL | Configured for the server |

---

## Install

```bash
pnpm install
```

If you see `packages field missing or empty`, ensure `pnpm-workspace.yaml` contains:

```yaml
packages:
  - '.'
```

---

## Environment setup

```bash
cp .env.example .env.local
```

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_NAME` | No | `ModenixOS` |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_BASE_URL` | No | `http://localhost:3000` |
| `ACCESS_TOKEN_SECRET` | Yes | Must match server |

Optional (used in code):

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_DEMO_STORE_SLUG` | `luxe-threads` | Demo page store slug (`lib/app-config.ts`) |

See [Environment Variables](04-environment-variables.md).

---

## Start the server first

Clone and run the **`modenixos-server`** repository (separate GitHub repo):

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

---

## Development

```bash
pnpm dev
```

Open **http://localhost:3000**

---

## Production build

```bash
pnpm build
pnpm start
```

Set production env vars in your hosting provider (Vercel, etc.).

---

## Verify

| Check | Expected |
|-------|----------|
| Landing page | Loads at `/` |
| Login | Connects to server API |
| Dashboard | Redirects after login (CLIENT) |
| Storefront | `/store/{slug}` if store published |

---

## Related documentation

- **modenixos-server** repository -> `docs/03-installation.md`
- [Deployment](11-deployment.md)
- [Troubleshooting](13-troubleshooting.md)
