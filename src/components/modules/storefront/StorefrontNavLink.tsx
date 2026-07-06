"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useOptionalStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";
import {
  isStorefrontClientNavHref,
  parseStorefrontHref,
  buildStorefrontPath,
} from "@/lib/storefront/navigation";

type StorefrontNavLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "prefetch"> & {
  children: ReactNode;
  onNavigate?: () => void;
};

export const StorefrontNavLink = memo(function StorefrontNavLink({
  href,
  children,
  onClick,
  onNavigate,
  scroll = false,
  ...props
}: StorefrontNavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nav = useOptionalStorefrontNav();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "");
  const { pathname: targetPath, search, hash } = parseStorefrontHref(hrefString);
  const targetLocation = buildStorefrontPath(targetPath, search, hash);
  const currentSearch = searchParams.toString();
  const currentLocation = buildStorefrontPath(
    pathname,
    currentSearch ? `?${currentSearch}` : "",
  );
  const isCrossRoute = targetLocation.split("#")[0] !== currentLocation.split("#")[0];
  const isHashNav = targetPath === pathname && !search && Boolean(hash);

  return (
    <Link
      href={href}
      prefetch
      scroll={scroll}
      onMouseEnter={() => {
        if (hrefString && isStorefrontClientNavHref(hrefString)) {
          router.prefetch(hrefString);
        }
      }}
      onClick={(event) => {
        if (nav && isStorefrontClientNavHref(hrefString) && (isCrossRoute || isHashNav)) {
          if (isCrossRoute) {
            event.preventDefault();
          }
          nav.navigate(hrefString);
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
