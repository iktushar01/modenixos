"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Thin top bar — visible immediately on route change while the next page loads. */
export function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 600);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity duration-150",
        active ? "opacity-100" : "opacity-0",
      )}
      aria-hidden
    >
      <div className="h-full w-1/3 animate-[navigation-progress_0.6s_ease-in-out_infinite] bg-primary" />
    </div>
  );
}
