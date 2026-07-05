"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { deleteCookie, setCookie } from "@/lib/cookieUtils";
import {
  publicFetchWithStoreCookie,
  storefrontCustomerCookieName,
} from "@/lib/storefrontCustomerApi";
import { StorefrontCustomer, WishlistItem } from "@/types/store.types";

const THIRTY_DAYS = 30 * 24 * 60 * 60;

export async function registerStorefrontCustomerAction(
  slug: string,
  data: { name: string; email: string; password: string },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/customers/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Registration failed");
  if (json.data?.token) {
    await setCookie(storefrontCustomerCookieName(slug), json.data.token, THIRTY_DAYS);
  }
  revalidatePath(`/store/${slug}`);
  revalidatePath(`/store/${slug}/account/login`);
  revalidatePath(`/store/${slug}/account/register`);
  revalidatePath(`/store/${slug}/account/wishlist`);
  return json.data.customer as StorefrontCustomer;
}

export async function loginStorefrontCustomerAction(
  slug: string,
  data: { email: string; password: string },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/customers/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Login failed");
  if (json.data?.token) {
    await setCookie(storefrontCustomerCookieName(slug), json.data.token, THIRTY_DAYS);
  }
  revalidatePath(`/store/${slug}`);
  revalidatePath(`/store/${slug}/account/login`);
  revalidatePath(`/store/${slug}/account/register`);
  revalidatePath(`/store/${slug}/account/wishlist`);
  return json.data.customer as StorefrontCustomer;
}

export async function logoutStorefrontCustomerAction(slug: string) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/customers/logout`,
    { method: "POST" },
  );
  await deleteCookie(storefrontCustomerCookieName(slug));
  revalidatePath(`/store/${slug}`);
}

export async function getStorefrontCustomerAction(slug: string) {
  const res = await publicFetchWithStoreCookie(
    slug,
    `/public/stores/${slug}/customers/me`,
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as StorefrontCustomer;
}

export async function getWishlistAction(slug: string) {
  const res = await publicFetchWithStoreCookie(slug, `/public/stores/${slug}/wishlist`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []) as WishlistItem[];
}

export async function addToWishlistAction(slug: string, productId: string) {
  const res = await publicFetchWithStoreCookie(slug, `/public/stores/${slug}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message ?? "Failed to add to wishlist");
  }
  revalidatePath(`/store/${slug}`);
  return true;
}

export async function removeFromWishlistAction(slug: string, productId: string) {
  const res = await publicFetchWithStoreCookie(
    slug,
    `/public/stores/${slug}/wishlist/${productId}`,
    { method: "DELETE" },
  );
  if (!res.ok) throw new Error("Failed to remove from wishlist");
  revalidatePath(`/store/${slug}`);
  return true;
}

export async function checkWishlistAction(slug: string, productId: string) {
  const res = await publicFetchWithStoreCookie(
    slug,
    `/public/stores/${slug}/wishlist/${productId}`,
  );
  if (!res.ok) return false;
  const json = await res.json();
  return !!json.data?.inWishlist;
}

export async function createPublicReviewAction(
  slug: string,
  data: {
    productId: string;
    rating: number;
    comment?: string;
    guestName?: string;
    guestEmail?: string;
  },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/reviews`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message ?? "Failed to submit review");
  }
  revalidateTag(`store-product-${slug}-${data.productId}`);
  revalidatePath(`/store/${slug}/products/${data.productId}`);
  return true;
}
