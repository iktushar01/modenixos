"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";

export type BillingPlan = {
  plan: "FREE" | "PRO" | "ENTERPRISE";
  label: string;
  priceMonthly: number | null;
  maxProducts: number;
  coupons: boolean;
  advancedAnalytics: boolean;
  customBranding: boolean;
  customDomain: boolean;
  prioritySupport: boolean;
  mrr: number;
  stripePriceConfigured: boolean;
};

export type BillingOverview = {
  store: { id: string; brandName: string; plan: string };
  subscription: {
    id: string;
    plan: string;
    status: string;
    stripeSubscriptionId?: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  };
  paymentMethods: Array<{
    id: string;
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
    isDefault: boolean;
  }>;
  invoices: Array<{
    id: string;
    amount: string | number;
    currency: string;
    status: string;
    invoiceUrl: string | null;
    pdfUrl: string | null;
    paidAt: string | null;
    createdAt: string;
  }>;
  usage: { productCount: number; memberCount: number };
  limits: BillingPlan;
  stripeConfigured: boolean;
};

export async function getBillingPlansAction() {
  const res = await httpClient.get<BillingPlan[]>("/billing/plans");
  return res.data ?? [];
}

export async function getBillingOverviewAction() {
  const res = await httpClient.get<BillingOverview>("/billing/overview");
  return res.data;
}

export async function createBillingCheckoutAction(plan: "PRO") {
  const res = await httpClient.post<{ url: string | null }>("/billing/checkout", { plan });
  return res.data;
}

export async function createBillingPortalAction() {
  const res = await httpClient.post<{ url: string | null }>("/billing/portal", {});
  return res.data;
}

export async function cancelBillingSubscriptionAction() {
  const res = await httpClient.post<{ message: string }>("/billing/cancel", {});
  revalidatePath("/dashboard/settings/billing");
  return res.data;
}

export async function getAdminSubscriptionsAction(params?: Record<string, unknown>) {
  return httpClient.get("/admin/subscriptions", { params });
}

export async function getAdminSubscriptionAction(storeId: string) {
  const res = await httpClient.get(`/admin/subscriptions/${storeId}`);
  return res.data;
}

export async function getAdminBillingAnalyticsAction() {
  const res = await httpClient.get<{
    mrr: number;
    arr: number;
    pastDue: number;
    totalInvoicesPaid: number;
    totalRevenue: number;
    planDistribution: Record<string, number>;
    activeSubscriptions: number;
  }>("/admin/billing/analytics");
  return res.data;
}

export async function getAdminFailedPaymentsAction() {
  const res = await httpClient.get("/admin/billing/failed-payments");
  return res.data ?? [];
}

export async function overrideStorePlanAction(storeId: string, plan: "FREE" | "PRO" | "ENTERPRISE") {
  await httpClient.patch(`/admin/stores/${storeId}/plan`, { plan });
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/admin-management");
}
