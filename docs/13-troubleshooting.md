# Troubleshooting

[← Back to index](README.md)

| Issue | Fix |
|-------|-----|
| Redirect loop to `/login` | Match `ACCESS_TOKEN_SECRET` with server; clear cookies |
| `NEXT_PUBLIC_API_BASE_URL is not defined` | Set in `.env.local` |
| API connection refused | Start modenixos-server on port 5000 |
| CORS errors | Set server `FRONTEND_URL` to client origin |
| Stuck on `/onboarding` | Create store; check `GET /stores/me` |
| Stuck on `/verify-email` | Complete OTP flow |
| Google login fails | Server Google OAuth env + `FRONTEND_URL` |
| Images 404 / blocked | Add your Cloudinary host to `next.config.mjs` `remotePatterns` |
| `packages field missing` (pnpm) | Add `pnpm-workspace.yaml` with `packages: ['.']` |
| Build type errors | Run `pnpm typecheck` |
| Upload fails in Server Action | Server running; body size limits in `next.config.mjs` |
| Storefront 404 | Store slug wrong or `isPublished: false` |
| Payment redirect wrong URL | Server `BACKEND_URL` / `FRONTEND_URL` in production |

---

## Diagnostic commands

```bash
pnpm typecheck
pnpm lint
pnpm build
```

```bash
# Verify API from machine
curl http://localhost:5000/health
```

---

## Server issues

See **modenixos-server** repository -> `docs/14-troubleshooting.md`.

---

## Related documentation

- [Installation](03-installation.md)
- [Environment Variables](04-environment-variables.md)
