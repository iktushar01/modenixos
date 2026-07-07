# Pages & Routes

[← Back to index](README.md)

All routes are defined under `src/app/`. Middleware (`proxy.ts`) controls access.

---

## Public routes (no platform auth)

| Path | Page file | Description |
|------|-----------|-------------|
| `/` | `(commonLayout)/page.tsx` | Marketing landing page |
| `/demo` | `demo/page.tsx` | Demo showcase |
| `/login` | `(authRouteGroup)/login/page.tsx` | Login |
| `/register` | `(authRouteGroup)/register/page.tsx` | Registration |
| `/verify-email` | `(authRouteGroup)/verify-email/page.tsx` | Email OTP verification |
| `/forgot-password` | `(authRouteGroup)/forgot-password/page.tsx` | Request reset OTP |
| `/reset-password` | `(authRouteGroup)/reset-password/page.tsx` | Reset password |
| `/google/callback` | `google/callback/page.tsx` | Google OAuth completion |
| `/payment/success` | `(commonLayout)/payment/success/page.tsx` | Payment success |
| `/payment/failed` | `(commonLayout)/payment/failed/page.tsx` | Payment failed |
| `/payment/cancelled` | `(commonLayout)/payment/cancelled/page.tsx` | Payment cancelled |
| `/invite/[token]` | `(commonLayout)/invite/[token]/page.tsx` | Accept store invitation |

---

## Authenticated common routes

| Path | Auth | Description |
|------|------|-------------|
| `/profile` | Any platform user | Edit profile |
| `/onboarding` | CLIENT | Create first store |

---

## Store owner dashboard (`CLIENT`)

| Path | Description |
|------|-------------|
| `/dashboard` | Dashboard home |
| `/dashboard/analytics` | Analytics charts |
| `/dashboard/products` | Product list |
| `/dashboard/products/new` | Create product |
| `/dashboard/products/[id]/edit` | Edit product |
| `/dashboard/categories` | Categories |
| `/dashboard/collections` | Collections |
| `/dashboard/orders` | Order list |
| `/dashboard/orders/new` | Manual order creation |
| `/dashboard/customers` | Customer list |
| `/dashboard/customers/[id]` | Customer detail |
| `/dashboard/reviews` | Review moderation |
| `/dashboard/coupons` | Coupon management |
| `/dashboard/store` | Shop profile |
| `/dashboard/store/branding` | Logos, banner |
| `/dashboard/store/theme` | Theme picker |
| `/dashboard/store/header` | Header config |
| `/dashboard/store/pages` | Policy page content |
| `/dashboard/store/shipping` | Shipping rules |
| `/dashboard/store/appearance` | Colors, typography |
| `/dashboard/settings` | General settings |
| `/dashboard/settings/billing` | Subscription billing |
| `/dashboard/settings/users` | Team members |

Sidebar links defined in `src/components/data/clientSidebar.ts`.

---

## Platform admin (`ADMIN` / `SUPER_ADMIN`)

| Path | Description |
|------|-------------|
| `/admin/dashboard` | Admin home |
| `/admin/dashboard/settings` | Admin settings |
| `/admin/admin-management` | Create admins (SUPER_ADMIN) |
| `/admin/subscriptions` | Subscription management |
| `/admin/commission` | Commission settings & earnings |
| `/admin/settings` | Platform settings |

Sidebar: `src/components/data/adminSidebar.ts`.

---

## Public storefront (`/store/[slug]`)

| Path | Description |
|------|-------------|
| `/store/[slug]` | Store home |
| `/store/[slug]/shop` | Product listing |
| `/store/[slug]/categories/[categorySlug]` | Category page |
| `/store/[slug]/collections/[collectionSlug]` | Collection page |
| `/store/[slug]/products/[id]` | Product detail |
| `/store/[slug]/cart` | Shopping cart |
| `/store/[slug]/checkout` | Checkout |
| `/store/[slug]/orders/confirmation` | Order confirmation |
| `/store/[slug]/track` | Order tracking |
| `/store/[slug]/account/login` | Customer login |
| `/store/[slug]/account/register` | Customer register |
| `/store/[slug]/account/orders` | Customer orders |
| `/store/[slug]/account/orders/[orderNumber]` | Order detail |
| `/store/[slug]/account/wishlist` | Wishlist |
| `/store/[slug]/about` | About page |
| `/store/[slug]/contact-us` | Contact |
| `/store/[slug]/privacy-policy` | Privacy |
| `/store/[slug]/shipping-policy` | Shipping |
| `/store/[slug]/return-exchange-policy` | Returns |
| `/store/[slug]/payment-refund-policy` | Payment & refund |

Storefront routes are **public** — middleware skips auth (`routeOwner === null`).

---

## API routes (Next.js)

| Path | Method | Purpose |
|------|--------|---------|
| `/api/auth/oauth/complete` | POST | Set auth cookies after Google OAuth |

---

## Middleware matcher

Excludes: `api`, `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt`, `.well-known`

See `src/proxy.ts` → `config.matcher`.

---

## Route protection diagram

```mermaid
flowchart TD
    R[Request] --> M{middleware}
    M -->|/store/*| P[Public - pass through]
    M -->|/login etc| A{Authenticated?}
    A -->|Yes| D[Redirect to dashboard]
    A -->|No| P
    M -->|/dashboard/*| C{CLIENT role?}
    C -->|No| X[Redirect]
    C -->|Yes| S{Has store?}
    S -->|No| O[/onboarding]
    S -->|Yes| P
    M -->|/admin/*| AD{ADMIN role?}
```

---

## Related documentation

- [Authentication](07-authentication.md)
- [Business Logic](09-business-logic.md)
