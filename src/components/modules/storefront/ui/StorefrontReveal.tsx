"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { sfFadeUp, sfFadeUpStagger } from "@/lib/storefront/motion";
import { cn } from "@/lib/utils";

interface StorefrontRevealProps extends HTMLMotionProps<"div"> {
  staggerIndex?: number;
}

export function StorefrontReveal({
  staggerIndex,
  className,
  children,
  ...props
}: StorefrontRevealProps) {
  const motionProps = staggerIndex !== undefined ? sfFadeUpStagger(staggerIndex) : sfFadeUp;

  return (
    <motion.div className={cn(className)} {...motionProps} {...props}>
      {children}
    </motion.div>
  );
}
