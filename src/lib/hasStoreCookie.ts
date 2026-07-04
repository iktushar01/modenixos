export const HAS_STORE_COOKIE = "hasStore";

export const HAS_STORE_MAX_AGE = 7 * 24 * 60 * 60;

export function readHasStoreCookie(
  cookies: { get: (name: string) => { value: string } | undefined },
): boolean | null {
  const value = cookies.get(HAS_STORE_COOKIE)?.value;
  if (value === "1") return true;
  if (value === "0") return false;
  return null;
}
