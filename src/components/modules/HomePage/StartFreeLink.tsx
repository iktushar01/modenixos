"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useMarketingAuthUser } from "@/hooks/useMarketingAuthUser";
import {
  getDefaultDashboardRoute,
  normalizeMarketingRole,
  resolveStartFreeHref,
  START_FREE_REGISTER_HREF,
} from "@/lib/marketing/authCta";
import { cn } from "@/lib/utils";

type StartFreeLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href?: string;
  children: ReactNode;
};

export function StartFreeLink({
  href,
  children,
  className,
  onClick,
  prefetch = true,
  ...props
}: StartFreeLinkProps) {
  const router = useRouter();
  const user = useMarketingAuthUser();
  const role = user ? normalizeMarketingRole(user.role) : null;

  const targetHref = useMemo(
    () => resolveStartFreeHref(Boolean(user), role, href),
    [href, role, user],
  );

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/register");
    router.prefetch("/onboarding");
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.prefetch("/admin/dashboard");
    }
  }, [router, role]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (targetHref.startsWith("/")) {
      event.preventDefault();
      router.push(targetHref, { scroll: false });
    }
  };

  return (
    <Link
      href={targetHref}
      prefetch={prefetch}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}

export function useStartFreeHref(explicitHref?: string) {
  const user = useMarketingAuthUser();
  const role = user ? normalizeMarketingRole(user.role) : null;
  return useMemo(
    () => resolveStartFreeHref(Boolean(user), role, explicitHref),
    [explicitHref, role, user],
  );
}

export { START_FREE_REGISTER_HREF, getDefaultDashboardRoute };
