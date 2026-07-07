"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Megaphone, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Overview", href: "/dashboard/marketing/newsletter", icon: Mail },
  { label: "Subscribers", href: "/dashboard/marketing/newsletter/subscribers", icon: Users },
  { label: "Campaigns", href: "/dashboard/marketing/newsletter/campaigns", icon: Megaphone },
  { label: "Settings", href: "/dashboard/marketing/newsletter/settings", icon: Settings },
] as const;

export function NewsletterNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Newsletter" className="dashboard-settings-nav mb-8">
      <div className="dashboard-segment-group">
        {LINKS.map((link) => {
          const active =
            link.href === "/dashboard/marketing/newsletter"
              ? pathname === link.href
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={active ? "true" : undefined}
              className={cn("dashboard-segment-btn")}
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
