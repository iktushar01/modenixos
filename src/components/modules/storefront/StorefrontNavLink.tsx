"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, startTransition, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { useOptionalStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";
import {
  buildStorefrontPath,
  isStorefrontClientNavHref,
  parseStorefrontHref,
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
  const nav = useOptionalStorefrontNav();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "");
  const { pathname: targetPath, search, hash } = parseStorefrontHref(hrefString);
  const targetLocation = buildStorefrontPath(targetPath, search, hash);
  const isHashNav = targetPath === pathname && !search && Boolean(hash);
  const isInStoreHref = isStorefrontClientNavHref(hrefString);
  const shouldUseStoreNav =
    isInStoreHref && (isHashNav || targetPath !== pathname || Boolean(search));

  return (
    <Link
      href={href}
      prefetch
      scroll={scroll}
      onMouseEnter={() => {
        if (isInStoreHref) {
          router.prefetch(hrefString);
        }
      }}
      onTouchStart={() => {
        if (isInStoreHref) {
          router.prefetch(hrefString);
        }
      }}
      onClick={(event) => {
        if (nav && shouldUseStoreNav) {
          event.preventDefault();
          nav.navigate(targetLocation);
        } else if (isInStoreHref && shouldUseStoreNav) {
          event.preventDefault();
          startTransition(() => {
            router.push(targetLocation, { scroll: false });
          });
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
