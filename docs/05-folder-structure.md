# Folder Structure

[← Back to index](README.md)

```
modenixos-client/
├── public/                      # Static assets (logo, images)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── (authRouteGroup)/    # Auth pages
│   │   ├── (commonLayout)/      # Landing, profile, onboarding
│   │   ├── (dashboardLayout)/   # /dashboard and /admin
│   │   ├── (storefrontLayout)/  # /store/[slug]
│   │   ├── api/auth/oauth/complete/  # OAuth cookie handler
│   │   ├── demo/                # Demo page
│   │   └── google/callback/     # Google OAuth page
│   ├── actions/                 # Server Actions
│   │   ├── authActions/         # Login, register, profile, etc.
│   │   ├── catalog.actions.ts
│   │   ├── store.actions.ts
│   │   ├── billing.actions.ts
│   │   ├── payment.actions.ts
│   │   ├── storefront-customer.actions.ts
│   │   ├── storefront-orders.actions.ts
│   │   ├── commission.actions.ts
│   │   └── shop-users.actions.ts
│   ├── components/
│   │   ├── modules/             # Feature components
│   │   │   ├── storefront/      # Public shop UI + themes
│   │   │   ├── dashboard/       # Dashboard shell
│   │   │   ├── adminDashboardPages/
│   │   │   ├── products/
│   │   │   ├── store/
│   │   │   └── auth/
│   │   ├── data/                # Sidebar nav config
│   │   │   ├── clientSidebar.ts
│   │   │   └── adminSidebar.ts
│   │   ├── shared/
│   │   └── ui/                  # shadcn/ui primitives
│   ├── lib/
│   │   ├── axios/httpClient.ts  # Server-side HTTP client
│   │   ├── authUtils.ts         # Route ownership rules
│   │   ├── middlewareAuth.ts    # JWT helpers
│   │   ├── middlewareRefresh.ts # Token refresh in middleware
│   │   ├── middlewareStoreCheck.ts
│   │   ├── storefront/          # Theme types, templates
│   │   ├── storefrontCustomerApi.ts
│   │   ├── shopFilters.ts
│   │   └── app-config.ts
│   ├── middleware.ts            # Exports proxy
│   ├── proxy.ts                 # Edge auth middleware
│   ├── providers/               # React Query provider
│   ├── services/auth/           # Auth service layer
│   ├── styles/                  # Global + storefront CSS
│   ├── types/                   # TypeScript types
│   └── zod/                     # Client validation schemas
├── .env.example
├── next.config.mjs
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## Key directories

| Path | Responsibility |
|------|----------------|
| `src/app/` | Routes, layouts, page components |
| `src/actions/` | Server Actions — mutations and server-side fetches |
| `src/components/modules/storefront/` | Public shop UI, theme1/theme2 |
| `src/components/modules/` | Dashboard, admin, product forms |
| `src/lib/` | Auth, HTTP, storefront helpers |
| `src/proxy.ts` | Route protection and token refresh |
| `src/components/data/` | Sidebar navigation definitions |

---

## App Router groups

| Group | Layout file | URL scope |
|-------|-------------|-----------|
| `(authRouteGroup)` | `(authRouteGroup)/layout.tsx` | `/login`, `/register`, etc. |
| `(commonLayout)` | `(commonLayout)/layout.tsx` | `/`, `/profile`, `/onboarding` |
| `(dashboardLayout)` | `(dashboardLayout)/layout.tsx` | `/dashboard`, `/admin` |
| `(storefrontLayout)` | `(storefrontLayout)/layout.tsx` | `/store/[slug]/*` |

---

## Related documentation

- [Pages & Routes](06-pages-and-routes.md)
- [API Integration](08-api-integration.md)
