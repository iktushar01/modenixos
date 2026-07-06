"use client";

import { usePathname } from "next/navigation";
import { getStorefrontSkeletonForPath } from "./getStorefrontSkeletonForPath";

export function StorefrontRouteLoading() {
  const pathname = usePathname();
  return getStorefrontSkeletonForPath(pathname);
}
