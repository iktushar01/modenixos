import type { UserFromCookie } from "@/types/auth.types";

export function parseUserCookie(value: string | undefined): UserFromCookie | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as UserFromCookie;
  } catch {
    return null;
  }
}
