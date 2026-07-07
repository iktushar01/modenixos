# Tech Stack

[← Back to index](README.md)

## Core

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5 | App Router, SSR, Server Actions |
| React | 19.1 | UI library |
| TypeScript | 5.x | Type safety |
| pnpm | 11.9 | Package manager |

## Styling & UI

| Library | Purpose |
|---------|---------|
| Tailwind CSS 4 | Utility-first CSS |
| shadcn/ui + Radix UI | Component primitives |
| Lucide React | Icons |
| next-themes | Light / dark / system theme |
| class-variance-authority, clsx, tailwind-merge | Styling utilities |
| Framer Motion, Motion, GSAP | Animations |
| Sonner | Toast notifications |

## Data & forms

| Library | Purpose |
|---------|---------|
| TanStack React Query 5 | Client data fetching, caching |
| TanStack Form | Form state |
| React Hook Form | Forms |
| Zod 4 | Validation |
| Axios | HTTP requests (server-side with cookies) |

## Dashboard & storefront

| Library | Purpose |
|---------|---------|
| @tanstack/react-table | Data tables |
| @dnd-kit/* | Drag-and-drop reordering |
| Recharts | Analytics charts |
| Embla Carousel | Storefront carousels |
| react-easy-crop, react-image-crop | Image cropping |
| html2canvas, pdf-lib, jszip | Export utilities |

## Auth & state

| Library | Purpose |
|---------|---------|
| cookies-next | Cookie access in Server Actions |
| jsonwebtoken | JWT verification in middleware |
| Zustand | Client state (cart, UI) |

## Not used in client

| Technology | Where it lives |
|------------|----------------|
| PostgreSQL / Prisma | modenixos-server only |
| Better Auth (server) | OAuth handled via server + `/api/auth/oauth/complete` |
| Stripe / SSLCommerz SDKs | Payment redirects via server API |

---

## Related documentation

- [Configuration](10-configuration.md)
- **modenixos-server** repository -> `docs/02-tech-stack.md`
