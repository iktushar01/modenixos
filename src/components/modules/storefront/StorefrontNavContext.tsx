"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptionalStorefront } from "@/components/modules/storefront/StorefrontContext";
import {
  applyStorefrontScrollAfterNav,
  buildStorefrontPath,
  parseStorefrontHref,
  scrollStorefrontToHash,
  scrollStorefrontToTop,
} from "@/lib/storefront/navigation";

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
  const pendingHashRef = useRef<string | null>(null);
  const hasMountedRef = useRef(false);
  const previousPathnameRef = useRef(pathname);

  const currentSearch = searchParams.toString();
  const currentLocation = buildStorefrontPath(
    pathname,
    currentSearch ? `?${currentSearch}` : "",
  );
  const locationKey = `${pathname}?${currentSearch}`;

  useLayoutEffect(() => {
    if (optimisticLocation !== null && optimisticLocation === currentLocation) {
      setOptimisticLocation(null);
    }
  }, [currentLocation, optimisticLocation]);

  // Scroll after route updates (covers navigate(), Link, and browser back/forward).
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousPathnameRef.current = pathname;
      return;
    }

    const hash = pendingHashRef.current ?? window.location.hash;
    pendingHashRef.current = null;
    const pathChanged = previousPathnameRef.current !== pathname;
    previousPathnameRef.current = pathname;

    requestAnimationFrame(() => {
      if (pathChanged) {
        applyStorefrontScrollAfterNav(hash || undefined);
      } else if (hash) {
        scrollStorefrontToHash(hash);
      }
    });
  }, [locationKey, pathname]);

  const navigate = useCallback(
    (href: string) => {
      const { pathname: targetPath, search, hash } = parseStorefrontHref(href);
      const targetLocation = buildStorefrontPath(targetPath, search, hash);
      const targetBase = buildStorefrontPath(targetPath, search);

      if (targetLocation === currentLocation) {
        return;
      }

      if (targetBase === currentLocation && hash) {
        scrollStorefrontToHash(hash);
        startTransition(() => {
          router.push(targetLocation, { scroll: false });
        });
        return;
      }

      if (!targetPath || targetBase === optimisticLocation) return;

      const isPathnameChange = targetPath !== pathname;

      pendingHashRef.current = hash || null;
      setOptimisticLocation(targetBase);
      if (isPathnameChange) {
        scrollStorefrontToTop();
      }
      startTransition(() => {
        router.push(targetLocation, { scroll: false });
      });
    },
    [currentLocation, optimisticLocation, pathname, router],
  );

  useEffect(() => {
    if (!slug) return;
    const base = `/store/${slug}`;
    const routes = [
      base,
      `${base}/shop`,
      `${base}/cart`,
      `${base}/checkout`,
      `${base}/account/login`,
      `${base}/account/register`,
      `${base}/account/orders`,
      `${base}/account/wishlist`,
      `${base}/track`,
      `${base}/about`,
      `${base}/contact-us`,
      `${base}/privacy-policy`,
      `${base}/shipping-policy`,
      `${base}/return-exchange-policy`,
      `${base}/payment-refund-policy`,
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
