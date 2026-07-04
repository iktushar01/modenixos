"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { HAS_STORE_COOKIE } from "@/lib/hasStoreCookie";
import { cookies } from "next/headers";

export const logoutAction = async (): Promise<{ success: boolean }> => {
  try {
    await httpClient.post("/auth/logout", {});
  } catch (error: unknown) {
    const maybeAxios = error as { message?: string };
    console.error("BACKEND_LOGOUT_ERROR:", maybeAxios.message ?? "Logout failed");
    // Still clear cookies even if backend call fails
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("better-auth.session_data");
    cookieStore.delete("user");
    cookieStore.delete(HAS_STORE_COOKIE);
  }

  // ✅ Do NOT call redirect() here — it throws internally and kills onSuccess.
  // Let the client handle navigation after this returns.
  return { success: true };
};
