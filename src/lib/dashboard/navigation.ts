/** Match dashboard sidebar href against the active path (optimistic or resolved). */
export function isDashboardNavActive(currentPath: string, href: string): boolean {
  // Root dashboard links must be exact — otherwise every /dashboard/* route matches.
  if (href === "/dashboard" || href === "/admin/dashboard") {
    return currentPath === href;
  }
  if (href === "/dashboard/store") {
    return currentPath === "/dashboard/store";
  }
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function getDashboardSkeletonVariant(pathname: string) {
  if (pathname === "/dashboard") return "overview" as const;
  if (pathname.startsWith("/dashboard/analytics")) return "analytics" as const;
  if (pathname.startsWith("/dashboard/store")) return "form-compact" as const;
  if (pathname.startsWith("/dashboard/settings")) return "form" as const;
  return "table" as const;
}
