"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface DashboardNavContextValue {
  /** Resolved or optimistic path — use for sidebar active state. */
  activePath: string;
  /** Set on click before the router updates the URL. */
  navigate: (href: string) => void;
  isNavigating: boolean;
}

const DashboardNavContext = createContext<DashboardNavContextValue | null>(null);

export function DashboardNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (optimisticPath !== null && optimisticPath === pathname) {
      setOptimisticPath(null);
    }
  }, [pathname, optimisticPath]);

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === pathname || href === optimisticPath) return;
      setOptimisticPath(href);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [pathname, optimisticPath, router],
  );

  const value = useMemo<DashboardNavContextValue>(
    () => ({
      activePath: optimisticPath ?? pathname,
      navigate,
      isNavigating: optimisticPath !== null,
    }),
    [optimisticPath, pathname, navigate],
  );

  return (
    <DashboardNavContext.Provider value={value}>{children}</DashboardNavContext.Provider>
  );
}

export function useDashboardNav() {
  const ctx = useContext(DashboardNavContext);
  if (!ctx) {
    throw new Error("useDashboardNav must be used within DashboardNavProvider");
  }
  return ctx;
}
