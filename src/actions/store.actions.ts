"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setCookie } from "@/lib/cookieUtils";
import { HAS_STORE_COOKIE, HAS_STORE_MAX_AGE } from "@/lib/hasStoreCookie";
import { Store } from "@/types/store.types";
import { revalidatePath, revalidateTag } from "next/cache";

async function revalidateStorefront() {
  try {
    const res = await httpClient.get<Store>("/stores/me");
    if (res.data?.slug) {
      revalidateTag(`store-public-${res.data.slug}`);
      revalidatePath(`/store/${res.data.slug}`);
    }
  } catch {
    // Store may not exist yet during onboarding
  }
}

export async function createStoreAction(data: {
  brandName: string;
  slug: string;
  country: string;
  currency?: string;
  description?: string;
}) {
  const res = await httpClient.post<Store>("/stores", data);
  await setCookie(HAS_STORE_COOKIE, "1", HAS_STORE_MAX_AGE);
  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return res;
}

export async function getMyStoreAction() {
  try {
    const res = await httpClient.get<Store>("/stores/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function updateStoreAction(id: string, data: FormData | Record<string, unknown>) {
  const res = await httpClient.patch<Store>(`/stores/${id}`, data);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/store");
  revalidatePath("/dashboard/store/branding");
  revalidatePath("/dashboard/store/header");
  revalidatePath("/dashboard/store/pages");
  revalidatePath("/dashboard/store/shipping");
  revalidatePath("/dashboard/store/payments");
  revalidatePath("/dashboard/store/appearance");
  await revalidateStorefront();
  return res;
}

export async function revalidateStoreBrandingAction() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/store");
  revalidatePath("/dashboard/store/branding");
  await revalidateStorefront();
}
