"use server";

import { revalidatePath } from "next/cache";
import { publicFetchWithStoreCookie } from "@/lib/storefrontCustomerApi";
import { Order } from "@/types/store.types";

async function parseOrderResponse(res: Response): Promise<Order> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? "Failed to load order");
  }
  return json.data as Order;
}

async function parseOrdersResponse(res: Response): Promise<Order[]> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? "Failed to load orders");
  }
  return (json.data ?? []) as Order[];
}

export async function getMyOrdersAction(slug: string): Promise<Order[]> {
  const res = await publicFetchWithStoreCookie(slug, `/public/stores/${slug}/orders/me`, {
    cache: "no-store",
  });
  return parseOrdersResponse(res);
}

export async function getMyOrderAction(slug: string, orderNumber: string): Promise<Order> {
  const res = await publicFetchWithStoreCookie(
    slug,
    `/public/stores/${slug}/orders/${encodeURIComponent(orderNumber)}`,
    { cache: "no-store" },
  );
  return parseOrderResponse(res);
}

export async function trackGuestOrderAction(
  slug: string,
  orderNumber: string,
  email: string,
): Promise<Order> {
  const qs = new URLSearchParams({ orderNumber, email }).toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/orders/track?${qs}`,
    { cache: "no-store" },
  );
  return parseOrderResponse(res);
}

export async function revalidateStorefrontOrders(slug: string) {
  revalidatePath(`/store/${slug}/account/orders`);
  revalidatePath(`/store/${slug}/track`);
}
