"use client";

import { StorefrontThemeConfig } from "@/lib/storefront";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
  theme: StorefrontThemeConfig;
}

export function AnnouncementBar({ theme }: AnnouncementBarProps) {
  const { announcement } = theme.header;
  if (!announcement.enabled || !announcement.text) return null;

  const isLong = announcement.text.length > 60;

  return (
    <div className="sf-announcement sf-border relative w-full overflow-hidden border-b py-2">
      <div className={cn("flex items-center justify-center", isLong && "whitespace-nowrap")}>
        {isLong ? (
          <div className="flex w-max">
            <p className="sf-marquee sf-eyebrow px-8">{announcement.text}</p>
            <p className="sf-marquee sf-eyebrow px-8" aria-hidden>
              {announcement.text}
            </p>
          </div>
        ) : (
          <p className="sf-eyebrow px-4">{announcement.text}</p>
        )}
      </div>
    </div>
  );
}
