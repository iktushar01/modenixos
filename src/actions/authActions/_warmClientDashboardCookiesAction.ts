"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setCookie } from "@/lib/cookieUtils";
import { HAS_STORE_COOKIE, HAS_STORE_MAX_AGE } from "@/lib/hasStoreCookie";

/** Cache hasStore for faster dashboard middleware on marketing → dashboard navigations. */
export async function warmClientDashboardCookiesAction() {
  try {
    const res = await httpClient.get("/stores/me");
    const hasStore = Boolean(res.data);
    await setCookie(HAS_STORE_COOKIE, hasStore ? "1" : "0", HAS_STORE_MAX_AGE);
    return { hasStore };
  } catch {
    return { hasStore: false };
  }
}
