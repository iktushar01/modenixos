"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { useStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";
import { Heart, Package, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const links: Array<{
  href: string;
  label: string;
  icon: typeof Package;
  external?: boolean;
}> = [
  { href: "orders", label: "Orders", icon: Package },
  { href: "wishlist", label: "Wishlist", icon: Heart },
  { href: "track", label: "Track order", icon: Search, external: true },
];

export function AccountNav({ base }: { base: string }) {
  const { activePath } = useStorefrontNav();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const href = link.external ? `${base}/${link.href}` : `${base}/account/${link.href}`;
        const { pathname: hrefPath } = parseStorefrontHref(href);
        const active = link.external
          ? activePath === `${base}/track` || activePath.startsWith(`${base}/track/`)
          : activePath.startsWith(`${base}/account/${link.href}`);
        const Icon = link.icon;

        return (
          <StorefrontNavLink
            key={link.href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide uppercase transition-colors",
              active
                ? "sf-primary border-transparent"
                : "sf-border sf-muted-fg hover:sf-fg hover:border-[color-mix(in_srgb,var(--sf-primary)_35%,var(--sf-border))]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {link.label}
          </StorefrontNavLink>
        );
      })}
    </nav>
  );
}
