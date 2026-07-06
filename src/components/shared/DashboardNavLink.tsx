"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useDashboardNav } from "@/components/shared/DashboardNavContext";

type DashboardNavLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "prefetch"> & {
  children: ReactNode;
  onNavigate?: () => void;
};

export const DashboardNavLink = memo(function DashboardNavLink({
  href,
  children,
  onClick,
  onNavigate,
  scroll = false,
  ...props
}: DashboardNavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { navigate } = useDashboardNav();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "");

  return (
    <Link
      href={href}
      prefetch
      scroll={scroll}
      onMouseEnter={() => {
        if (hrefString) router.prefetch(hrefString);
      }}
      onClick={(event) => {
        if (hrefString && hrefString !== pathname) {
          event.preventDefault();
          navigate(hrefString);
        }
        onNavigate?.();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Link>
  );
});
