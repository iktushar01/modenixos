"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image, Layers, Palette, Store, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Profile", href: "/dashboard/store", icon: Store },
  { label: "Branding", href: "/dashboard/store/branding", icon: Image },
  { label: "Header", href: "/dashboard/store/header", icon: Layers },
  { label: "Shipping", href: "/dashboard/store/shipping", icon: Truck },
  { label: "Appearance", href: "/dashboard/store/appearance", icon: Palette },
] as const;

export function StoreSettingsNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Store settings"
      className="admin-panel flex gap-1 overflow-x-auto p-1.5"
    >
      {LINKS.map((link) => {
        const active =
          link.href === "/dashboard/store"
            ? pathname === link.href
            : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-all",
              active
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4 shrink-0", active && "text-[var(--admin-accent-strong)]")} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
