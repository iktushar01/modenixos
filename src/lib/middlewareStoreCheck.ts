import { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function checkHasStoreFromRequest(request: NextRequest): Promise<boolean> {
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
