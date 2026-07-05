"use client";

import { StorefrontThemeConfig } from "@/lib/storefront";

interface AnnouncementBarProps {
  theme: StorefrontThemeConfig;
}

export function AnnouncementBar({ theme }: AnnouncementBarProps) {
  const { announcement } = theme.header;
  if (!announcement.enabled || !announcement.text) return null;

  return (
    <div className="sf-announcement w-full py-2.5 text-center text-sm">
      <p className="px-4 font-medium tracking-wide">{announcement.text}</p>
    </div>
  );
}
