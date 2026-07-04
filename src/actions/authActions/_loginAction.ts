/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { setCookie } from "@/lib/cookieUtils";
import { HAS_STORE_COOKIE, HAS_STORE_MAX_AGE } from "@/lib/hasStoreCookie";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import {
  ILoginPayload,
  loginZodSchema,
} from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  // ❌ Validation fail
  if (!parsedPayload.success) {
    return {
      success: false,
      message:
        parsedPayload.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data
    );

    const { accessToken, refreshToken, token, user } =
      response.data;

    const {
      role,
      needPasswordChange,
      email,
    } = user;

    // ✅ Normalize role (very important)
    const normalizedRole = role.toUpperCase() as UserRole;

    // ✅ Set cookies
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      token,
      24 * 60 * 60
    );
    await setCookie("user", JSON.stringify(user), 7 * 24 * 60 * 60, false);

    if (normalizedRole === "CLIENT") {
      try {
        const storeRes = await httpClient.get("/stores/me");
        if (storeRes.data) {
          await setCookie(HAS_STORE_COOKIE, "1", HAS_STORE_MAX_AGE);
        }
      } catch {
        // Store check deferred to middleware on first dashboard visit
      }
    }

    // 🔐 Force password change
    if (needPasswordChange) {
      redirect(`/reset-password?email=${email}`);
    }

    // 🎯 Decide final route
    const targetPath =
      redirectPath &&
      isValidRedirectForRole(redirectPath, normalizedRole)
        ? redirectPath
        : getDefaultDashboardRoute(normalizedRole);

    // 🧠 Debug (remove later)
    console.log("ROLE:", normalizedRole);
    console.log("REDIRECTING TO:", targetPath);

    redirect(targetPath);
  } catch (error: any) {
    // ✅ Ignore Next.js redirect "error"
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    // 📩 Email not verified
    if (
      error?.response?.data?.message ===
      "Email not verified"
    ) {
      redirect(`/verify-email?email=${payload.email}`);
    }

    // ❌ Real error only
    console.error("LOGIN ERROR:", error);

    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    if (status === 429) {
      return {
        success: false,
        message: serverMessage ?? "Too many login attempts. Please wait a few minutes and try again.",
      };
    }

    return {
      success: false,
      message: serverMessage ?? `Login failed: ${error.message}`,
    };
  }
};