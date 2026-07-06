"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface DashboardAsyncContentProps {
  /** True when there is no displayable data yet (first load). */
  showPlaceholder: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Stable min-height shell with skeleton → content fade.
 * Prevents layout shift while data loads after instant navigation.
 */
export function DashboardAsyncContent({
  showPlaceholder,
  skeleton,
  children,
  className,
}: DashboardAsyncContentProps) {
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0 : 0.2;

  if (showPlaceholder) {
    return (
      <div
        className={className ?? "min-h-[320px]"}
        aria-busy="true"
        aria-live="polite"
      >
        {skeleton}
      </div>
    );
  }

  return (
    <motion.div
      key="dashboard-content"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: EASE }}
      style={{ willChange: "opacity" }}
      className={className ?? "min-h-[320px]"}
    >
      {children}
    </motion.div>
  );
}
