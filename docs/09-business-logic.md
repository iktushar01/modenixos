# Business Logic

[← Back to index](README.md)

UI-level workflows and feature modules. Backend logic is documented in **modenixos-server** repository -> `docs/09-business-logic.md`.

---

## Onboarding

1. User registers and verifies email
2. Middleware detects no store → `/onboarding`
3. Onboarding page calls `POST /stores` via Server Action
4. `hasStore` cookie set → redirect `/dashboard`

---

## Dashboard modules

| Module | Key components | Actions |
|--------|----------------|---------|
| Products | `components/modules/products/` | `catalog.actions.ts` |
| Categories / Collections | Dashboard list + DnD reorder | `catalog.actions.ts` |
| Orders | Order table, status updates | via actions / API |
| Customers | CRM-style list | API |
| Reviews | Approve/reject UI | API |
| Coupons | CRUD (PRO plan) | API |
| Analytics | Recharts dashboards | API `/analytics/*` |
| Store settings | `components/modules/store/` | `store.actions.ts` |
| Billing | Stripe/SSLCommerz checkout UI | `billing.actions.ts` |
| Team | Invite/manage members | `shop-users.actions.ts` |

---

## Storefront

### Rendering

**`StorefrontRenderer.tsx`** — resolves theme from `store.theme.templateId` and renders theme-specific home/product components.

### Themes

Registry: `components/modules/storefront/themes/registry.ts`

| Template | Home | Product detail |
|----------|------|----------------|
| `theme1` | `Theme1Home` | `Theme1ProductDetail` |
| `theme2` | `Theme2Home` | `Theme2ProductDetail` |

### Cart & checkout

- Cart state: Zustand (client-side)
- Checkout: `storefront-orders.actions.ts` → `POST /public/stores/:slug/orders`
- SSLCommerz: `payment.actions.ts` → redirect to gateway

### Customer account

- Login/register/OTP via `storefront-customer.actions.ts`
- Wishlist and order history on account pages

---

## Admin panel

| Page | Purpose |
|------|---------|
| `/admin/subscriptions` | View/override store plans |
| `/admin/commission` | Commission settings and earnings |
| `/admin/admin-management` | Create admin users |

Uses `commission.actions.ts` and direct API calls.

---

## Plan-gated UI

Server enforces plan limits; client may hide or disable features:

| Feature | FREE | PRO+ |
|---------|------|------|
| Coupons | Hidden/limited | Full |
| Advanced analytics | Basic only | Full charts |
| Product limit | 50 max | Unlimited |

Limits defined server-side in `modenixos-server/src/config/planLimits.ts`.

---

## Sidebar navigation

- Client dashboard: `components/data/clientSidebar.ts`
- Admin: `components/data/adminSidebar.ts`
- Resolved via `lib/getSidebarData.ts`

---

## Related documentation

- [Pages & Routes](06-pages-and-routes.md)
- **modenixos-server** repository -> `docs/09-business-logic.md`
