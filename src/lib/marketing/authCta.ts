import type { UserRole } from "@/lib/authUtils";
import { getDefaultDashboardRoute } from "@/lib/authUtils";

export function normalizeMarketingRole(role: string | undefined): UserRole | null {
  const upper = role?.toUpperCase();
  if (
    upper === "SUPER_ADMIN" ||
    upper === "ADMIN" ||
    upper === "CLIENT" ||
    upper === "COMMON"
  ) {
    return upper;
  }
  return null;
}

export { getDefaultDashboardRoute };

export const START_FREE_REGISTER_HREF = "/register";

export function resolveStartFreeHref(
  isAuthenticated: boolean,
  role: UserRole | null,
  explicitHref?: string,
) {
  if (explicitHref && explicitHref !== START_FREE_REGISTER_HREF) {
    return explicitHref;
  }
  if (isAuthenticated && role) {
    return getDefaultDashboardRoute(role);
  }
  return START_FREE_REGISTER_HREF;
}
