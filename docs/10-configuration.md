# Configuration

[← Back to index](README.md)

## package.json scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `next lint` | ESLint (Next.js config) |
| `typecheck` | `tsc --noEmit` | TypeScript check |

Package manager: **pnpm@11.9.0** (`packageManager` field).

---

## next.config.mjs

| Setting | Value | Purpose |
|---------|-------|---------|
| `images.remotePatterns` | `res.cloudinary.com` | Allow Cloudinary images in `<Image>` |
| `experimental.serverActions.bodySizeLimit` | `10mb` | Large multipart uploads |
| `experimental.proxyClientMaxBodySize` | `10mb` | Multipart body limit (Next 15.5+) |
| `experimental.staleTimes.dynamic` | `30` | Client router cache (seconds) |
| `experimental.staleTimes.static` | `180` | Static route cache |

> **Note:** Cloudinary hostname is hardcoded to a specific cloud path. Update for your Cloudinary account.

---

## tsconfig.json

| Option | Value |
|--------|-------|
| `strict` | `true` |
| `paths` | `@/*` → `./src/*` |
| `jsx` | `preserve` |
| Next.js plugin | enabled |

---

## ESLint

- Config: `eslint.config.mjs`
- Extends: `eslint-config-next`
- Plugin: `@tanstack/eslint-plugin-query`

**Prettier:** not configured in this project.

---

## Middleware

| File | Role |
|------|------|
| `src/middleware.ts` | Re-exports `proxy` and `config` |
| `src/proxy.ts` | Auth, refresh, role routing, store check |

Matcher excludes static assets and `api` routes (except middleware runs on pages only).

---

## Path alias

```typescript
import { foo } from "@/lib/foo";  // → src/lib/foo
```

---

## Docker / PM2 / Nginx / CI

**Not implemented** in modenixos-client.

---

## Related documentation

- [Deployment](11-deployment.md)
- [Authentication](07-authentication.md)
