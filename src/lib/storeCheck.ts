import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function checkUserHasStore(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
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
