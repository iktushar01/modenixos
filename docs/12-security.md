# Security

[← Back to index](README.md)

## Client-side controls

| Control | Implementation |
|---------|----------------|
| Route protection | Edge middleware verifies JWT before dashboard/admin access |
| HTTP-only tokens | `accessToken` / `refreshToken` not set from client JS directly on login — Server Actions receive Set-Cookie from API |
| Role enforcement | Middleware redirects wrong-role users |
| Account state gates | Email verification and forced password reset enforced in middleware |
| OAuth handoff | `/api/auth/oauth/complete` validates payload before setting cookies |

---

## Exposed vs secret variables

| Variable | Exposure |
|----------|----------|
| `NEXT_PUBLIC_*` | Bundled into client JS — public |
| `ACCESS_TOKEN_SECRET` | Used in Edge middleware only — not in browser bundle |

---

## Recommendations

| Area | Action |
|------|--------|
| Secret sync | Rotate `ACCESS_TOKEN_SECRET` with server together |
| HTTPS | Always use HTTPS in production |
| CSP | Consider Content-Security-Policy headers at CDN/proxy |
| Dependencies | Run `pnpm audit` regularly |
| User cookie | `user` cookie is readable by JS — contains role/email only, no passwords |

---

## Known gaps

| Gap | Notes |
|-----|-------|
| No CSRF tokens | Relies on SameSite cookies + CORS |
| `user` cookie client-readable | Used for middleware fast path |
| Cloudinary host hardcoded | Wrong account = broken images, not a security issue |

Server security: **modenixos-server** repository -> `docs/13-security.md`.

---

## Related documentation

- [Authentication](07-authentication.md)
- [Known Limitations](14-known-limitations.md)
