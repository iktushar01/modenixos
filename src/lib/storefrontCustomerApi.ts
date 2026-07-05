const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const storefrontCustomerCookieName = (slug: string) =>
  `sf_customer_${slug.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

export async function publicFetchWithStoreCookie(
  slug: string,
  path: string,
  init?: RequestInit,
) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const name = storefrontCustomerCookieName(slug);
  const token = cookieStore.get(name)?.value;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Cookie", `${name}=${token}`);
  }

  return fetch(`${API}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}
