"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface DashboardNavContextValue {
  pendingHref: string | null;
  startNavigation: (href: string) => void;
}

const DashboardNavContext = createContext<DashboardNavContextValue | null>(null);

export function DashboardNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const startNavigation = useCallback((href: string) => {
    if (href !== pathname) {
      window.dispatchEvent(new Event("dashboard:nav-start"));
      setPendingHref(href);
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  return (
    <DashboardNavContext.Provider value={{ pendingHref, startNavigation }}>
      {children}
    </DashboardNavContext.Provider>
  );
}

export function useDashboardNav() {
  const ctx = useContext(DashboardNavContext);
  if (!ctx) {
    throw new Error("useDashboardNav must be used within DashboardNavProvider");
  }
  return ctx;
}

/** @deprecated Pages render their own loading UI; kept for compatibility. */
export function useDashboardReady(_ready: boolean) {
  // no-op — navigation skeleton is driven by click + pathname, not API readiness
}
