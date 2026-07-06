"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDashboardNav } from "@/components/shared/DashboardNavContext";

const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Subtle content-area transition on route change.
 * Layout (sidebar/header) stays mounted — only this wrapper animates.
 */
export function DashboardPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isNavigating, activePath } = useDashboardNav();
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : 0.15;
  const pendingNav = isNavigating && activePath !== pathname;

  if (pendingNav) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: EASE }}
      style={{ willChange: "opacity, transform" }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
