"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptionalStorefront } from "@/components/modules/storefront/StorefrontContext";
import { buildStorefrontPath, parseStorefrontHref } from "@/lib/storefront/navigation";

interface StorefrontNavContextValue {
  activePath: string;
  navigate: (href: string) => void;
  isNavigating: boolean;
}

const StorefrontNavContext = createContext<StorefrontNavContextValue | null>(null);

export function StorefrontNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storefront = useOptionalStorefront();
  const slug = storefront?.slug ?? "";
  const [optimisticLocation, setOptimisticLocation] = useState<string | null>(null);

  const currentSearch = searchParams.toString();
  const currentLocation = buildStorefrontPath(
    pathname,
    currentSearch ? `?${currentSearch}` : "",
  );

  useLayoutEffect(() => {
    if (optimisticLocation !== null && optimisticLocation === currentLocation) {
      setOptimisticLocation(null);
    }
  }, [currentLocation, optimisticLocation]);

  const navigate = useCallback(
    (href: string) => {
      const { pathname: targetPath, search, hash } = parseStorefrontHref(href);
      const targetLocation = buildStorefrontPath(targetPath, search, hash);
      const targetBase = buildStorefrontPath(targetPath, search);

      if (targetLocation === currentLocation) {
        return;
      }

      if (targetBase === currentLocation && hash) {
        startTransition(() => {
          router.push(targetLocation, { scroll: false });
        });
        requestAnimationFrame(() => {
          document.getElementById(hash.slice(1))?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
        return;
      }

      if (!targetPath || targetBase === optimisticLocation) return;

      setOptimisticLocation(targetBase);
      startTransition(() => {
        router.push(targetLocation, { scroll: false });
      });
    },
    [currentLocation, optimisticLocation, router],
  );

  useEffect(() => {
    if (!slug) return;
    const base = `/store/${slug}`;
    const routes = [
      base,
      `${base}/cart`,
      `${base}/checkout`,
      `${base}/account/login`,
      `${base}/account/register`,
      `${base}/account/orders`,
      `${base}/account/wishlist`,
      `${base}/track`,
    ];
    routes.forEach((route) => router.prefetch(route));
  }, [slug, router]);

  const activePath = optimisticLocation
    ? parseStorefrontHref(optimisticLocation).pathname
    : pathname;

  const value = useMemo<StorefrontNavContextValue>(
    () => ({
      activePath,
      navigate,
      isNavigating: optimisticLocation !== null,
    }),
    [activePath, navigate, optimisticLocation],
  );

  return (
    <StorefrontNavContext.Provider value={value}>{children}</StorefrontNavContext.Provider>
  );
}

export function useStorefrontNav() {
  const ctx = useContext(StorefrontNavContext);
  if (!ctx) {
    throw new Error("useStorefrontNav must be used within StorefrontNavProvider");
  }
  return ctx;
}

export function useOptionalStorefrontNav() {
  return useContext(StorefrontNavContext);
}
