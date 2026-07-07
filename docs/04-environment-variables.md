# Environment Variables

[← Back to index](README.md)

File: **`.env.local`** (development) or hosting provider env UI (production).

Canonical example: `modenixos-client/.env.example`

---

## Variables

| Variable | Required | Default | Purpose | Used in |
|----------|----------|---------|---------|---------|
| `NEXT_PUBLIC_APP_NAME` | No | `ModenixOS` | App title in UI | `lib/app-config.ts` |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | — | Backend REST base URL | Server Actions, `httpClient.ts`, middleware |
| `NEXT_PUBLIC_BASE_URL` | No | `http://localhost:3000` | Frontend URL | Reserved for future redirects |
| `ACCESS_TOKEN_SECRET` | Yes | — | JWT verification in Edge middleware | `lib/middlewareAuth.ts` — **must match server** |
| `NEXT_PUBLIC_DEMO_STORE_SLUG` | No | `luxe-threads` | Demo page store slug | `lib/app-config.ts` |

---

## Example `.env.local`

```env
NEXT_PUBLIC_APP_NAME=ModenixOS
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
```

### Production example

```env
NEXT_PUBLIC_APP_NAME=ModenixOS
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ACCESS_TOKEN_SECRET=<same-as-server-production-secret>
```

---

## Server variables

Database, email, Stripe, Cloudinary, and all backend secrets are configured in **modenixos-server** only.

See **modenixos-server** repository -> `docs/04-environment-variables.md`.

---

## Security notes

- `NEXT_PUBLIC_*` variables are exposed to the browser — never put secrets in them
- `ACCESS_TOKEN_SECRET` is used in middleware (server-side at the Edge) — still must match the backend but is not prefixed with `NEXT_PUBLIC_`

---

## Related documentation

- [Installation](03-installation.md)
- [Authentication](07-authentication.md)
