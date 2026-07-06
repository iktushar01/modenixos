"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Image, Layers, LayoutTemplate, Palette, Store, Truck } from "lucide-react";

const LINKS = [
  { label: "Profile", href: "/dashboard/store", icon: Store },
  { label: "Branding", href: "/dashboard/store/branding", icon: Image },
  { label: "Theme", href: "/dashboard/store/theme", icon: LayoutTemplate },
  { label: "Header", href: "/dashboard/store/header", icon: Layers },
  { label: "Pages", href: "/dashboard/store/pages", icon: FileText },
  { label: "Shipping", href: "/dashboard/store/shipping", icon: Truck },
  { label: "Appearance", href: "/dashboard/store/appearance", icon: Palette },
] as const;

export function StoreSettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Store settings" className="dashboard-settings-nav">
      <div className="dashboard-segment-group">
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
              data-active={active ? "true" : undefined}
              className="dashboard-segment-btn"
            >
              <Icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
