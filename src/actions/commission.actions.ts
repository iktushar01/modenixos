"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/httpClient";

export type CommissionSettings = {
  id: string;
  isEnabled: boolean;
  commissionType: "PERCENT" | "FIXED";
  commissionValue: number;
  commissionBase: "SUBTOTAL" | "TOTAL";
  triggerStatus: "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED";
  updatedAt: string;
};

export type PlatformEarning = {
  id: string;
  storeId: string;
  orderId: string;
  orderNumber: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  commissionType: "PERCENT" | "FIXED";
  commissionBase: "SUBTOTAL" | "TOTAL";
  currency: string;
  status: "EARNED" | "REVERSED";
  earnedAt: string;
  reversedAt?: string | null;
  store?: { id: string; brandName: string; slug: string };
  order?: { id: string; orderNumber: string; status: string; total: number };
};

export type CommissionAnalytics = {
  totalCommission: number;
  commissionThisMonth: number;
  reversedCommission: number;
  earnedOrderCount: number;
};

export async function getAdminCommissionSettingsAction() {
  const res = await httpClient.get<CommissionSettings>("/admin/commission/settings");
  return res.data;
}

export async function updateAdminCommissionSettingsAction(payload: Partial<CommissionSettings>) {
  const res = await httpClient.patch<CommissionSettings>("/admin/commission/settings", payload);
  revalidatePath("/admin/commission");
  return res.data;
}

export async function getAdminCommissionEarningsAction(params?: Record<string, unknown>) {
  return httpClient.get<PlatformEarning[]>("/admin/commission/earnings", { params });
}

export async function getAdminCommissionAnalyticsAction() {
  const res = await httpClient.get<CommissionAnalytics>("/admin/commission/analytics");
  return res.data;
}
