"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Profile", href: "/dashboard/store" },
  { label: "Branding", href: "/dashboard/store/branding" },
  { label: "Header", href: "/dashboard/store/header" },
  { label: "Appearance", href: "/dashboard/store/appearance" },
];

export function StoreSettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-lg border bg-muted/40 p-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/dashboard/store"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
