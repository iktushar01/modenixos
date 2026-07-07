# Contributing Guide

[← Back to index](README.md)

## Setup

See [Installation Guide](03-installation.md). Run server and client together during development.

---

## Conventions

### Components

- Feature UI: `src/components/modules/{feature}/`
- Shared: `src/components/shared/`
- Primitives: `src/components/ui/` (shadcn)

### Data mutations

- Prefer **Server Actions** in `src/actions/`
- Forward cookies via `httpClient` — do not store tokens in localStorage

### Routes

- Add pages under correct App Router group
- Update `lib/authUtils.ts` if route needs protection
- Update sidebar in `components/data/clientSidebar.ts` or `adminSidebar.ts`

### Styling

- Tailwind CSS v4
- Follow existing component patterns
- Storefront styles: `src/styles/storefront-theme.css`

---

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

---

## Documentation

When adding features, update:

| Change | Document |
|--------|----------|
| New page | `06-pages-and-routes.md` |
| New env var | `04-environment-variables.md` + `.env.example` |
| New Server Action | `08-api-integration.md` |
| Auth change | `07-authentication.md` |

Also update **modenixos-server** repository ``docs/`` if API changes.

---

## Related documentation

- [Folder Structure](05-folder-structure.md)
- **modenixos-server** repository -> `docs/17-contributing.md`
