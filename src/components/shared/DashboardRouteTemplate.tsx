"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { getDashboardSkeletonForPath } from "@/components/shared/DashboardPageSkeleton";

interface DashboardReadyContextValue {
  markReady: () => void;
}

const DashboardReadyContext = createContext<DashboardReadyContextValue | null>(null);

export function useDashboardReady(ready: boolean) {
  const ctx = useContext(DashboardReadyContext);

  useEffect(() => {
    if (ready) ctx?.markReady();
  }, [ready, ctx]);
}

export function DashboardRouteTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    setContentReady(false);
  }, [pathname]);

  const markReady = useCallback(() => setContentReady(true), []);

  return (
    <DashboardReadyContext.Provider value={{ markReady }}>
      {!contentReady && getDashboardSkeletonForPath(pathname)}
      <div
        className={contentReady ? "animate-in fade-in duration-200" : "hidden"}
        aria-hidden={!contentReady}
      >
        {children}
      </div>
    </DashboardReadyContext.Provider>
  );
}
