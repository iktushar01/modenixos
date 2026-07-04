import { NextRequest, NextResponse } from "next/server";
import { HAS_STORE_COOKIE, readHasStoreCookie } from "./hasStoreCookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function checkHasStoreFromRequest(request: NextRequest): Promise<boolean> {
  const cached = readHasStoreCookie(request.cookies);
  if (cached !== null) {
    return cached;
  }

  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;
    if (!accessToken || !API_BASE) return false;

    const res = await fetch(`${API_BASE}/stores/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken ?? ""}`,
      },
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}

export function applyHasStoreCookie(response: NextResponse, hasStore: boolean) {
  response.cookies.set(HAS_STORE_COOKIE, hasStore ? "1" : "0", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}
