"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StorefrontSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function StorefrontSection({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  children,
  className,
  id,
}: StorefrontSectionProps) {
  const centered = align === "center";

  return (
    <section id={id} className={cn("sf-section w-full", className)}>
      {(eyebrow || title || subtitle || action) && (
        <header
          className={cn(
            "mb-8 flex flex-col gap-4 sm:mb-10 md:mb-12",
            centered && "items-center text-center",
            action && !centered && "sm:flex-row sm:items-end sm:justify-between",
          )}
        >
          <div className={cn("min-w-0 max-w-2xl", centered && "mx-auto")}>
            {eyebrow && <p className="sf-eyebrow">{eyebrow}</p>}
            {title && <h2 className="sf-display-lg mt-2 text-balance">{title}</h2>}
            {subtitle && <p className="sf-body-lg sf-muted-fg mt-2 sm:mt-3">{subtitle}</p>}
          </div>
          {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function StorefrontDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("sf-section w-full py-2", className)}
      aria-hidden
    >
      <hr className="sf-border mx-auto max-w-6xl border-t opacity-40" />
    </div>
  );
}

interface StorefrontCTAProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

export function StorefrontCTA({
  href,
  children,
  variant = "primary",
  className,
}: StorefrontCTAProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-7 py-2.5 text-xs uppercase tracking-[0.18em] transition-all duration-300",
        variant === "primary" && "sf-btn-primary hover:opacity-90",
        variant === "outline" && "sf-btn-outline hover:sf-muted",
        className,
      )}
    >
      {children}
    </a>
  );
}
