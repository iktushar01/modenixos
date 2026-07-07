"use client";

import { Sparkles } from "lucide-react";
import { StorefrontThemeConfig } from "@/lib/storefront";

interface AnnouncementBarProps {
  theme: StorefrontThemeConfig;
}

export function AnnouncementBar({ theme }: AnnouncementBarProps) {
  const text = theme.header.announcement.text?.trim();
  if (!theme.header.announcement.enabled || !text) return null;

  return (
    <div className="border-b sf-border bg-[linear-gradient(90deg,var(--primary),var(--accent))] text-[color:var(--primary-foreground)]">
      <div className="sf-section flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
        <Sparkles className="h-3.5 w-3.5" />
        <span>{text}</span>
      </div>
    </div>
  );
}
