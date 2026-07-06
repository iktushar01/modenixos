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
    <div className="sf-t2-announcement relative w-full overflow-hidden border-b sf-border">
      <div className={cn("flex items-center", isLong && "sf-t2-marquee-track")}>
        {isLong ? (
          <>
            <p className="sf-t2-announcement-text shrink-0 px-6">{announcement.text}</p>
            <p className="sf-t2-announcement-text shrink-0 px-6" aria-hidden>
              {announcement.text}
            </p>
          </>
        ) : (
          <p className="sf-t2-announcement-text w-full text-center">{announcement.text}</p>
        )}
      </div>
    </div>
  );
}
