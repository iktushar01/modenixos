# Known Limitations

[← Back to index](README.md)

| Limitation | Details |
|------------|---------|
| **Cloudinary hostname hardcoded** | `next.config.mjs` uses a specific `res.cloudinary.com/...` path — must update for other accounts |
| **Profile route in authUtils** | Lists `/my-profile` but app uses `/profile` |
| **No Docker / CI** | No container or pipeline config in client folder |
| **Limited client tests** | No test suite in modenixos-client |
| **Plan UI not fully gated** | Some PRO features may appear in UI but fail on API — server enforces limits |
| **Legacy README names** | README mentions `Injentro-client` — actual folder is `modenixos-client` |
| **Single API route** | Only `/api/auth/oauth/complete` — all other logic via Server Actions |

Platform-wide limitations: **modenixos-server** repository -> `docs/15-known-limitations.md`.

---

## Related documentation

- [Future Improvements](15-future-improvements.md)
