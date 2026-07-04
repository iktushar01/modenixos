"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { Store } from "@/types/store.types";
import { revalidatePath } from "next/cache";

export async function createStoreAction(data: {
  brandName: string;
  slug: string;
  country: string;
  currency?: string;
  description?: string;
}) {
  const res = await httpClient.post<Store>("/stores", data);
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
  return res;
}
