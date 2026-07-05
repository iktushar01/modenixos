"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const href = link.external ? `${base}/${link.href}` : `${base}/account/${link.href}`;
        const active = link.external
          ? pathname === `${base}/track`
          : pathname.startsWith(`${base}/account/${link.href}`);
        const Icon = link.icon;

        return (
          <Link
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
          </Link>
        );
      })}
    </nav>
  );
}
