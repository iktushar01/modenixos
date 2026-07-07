"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";
import { httpClient } from "@/lib/axios/httpClient";

export type BillingProvider = "STRIPE" | "SSLCOMMERZ";
export type BillingInterval = "MONTHLY" | "YEARLY";
export type StorePlanId = "FREE" | "PRO" | "PRO_PLUS" | "ULTRA";
export type PaidPlanId = "PRO" | "PRO_PLUS" | "ULTRA";

export type BillingPlan = {
  plan: StorePlanId;
  label: string;
  tagline: string;
  monthlyUsd: number;
  yearlyUsd: number;
  monthlyBdt: number;
  yearlyBdt: number;
  maxProducts: number;
  maxOrdersPerMonth: number;
  coupons: boolean;
  advancedAnalytics: boolean;
  customBranding: boolean;
  customDomain: boolean;
  prioritySupport: boolean;
  maxNewsletterSubscribers: number;
  maxNewsletterCampaignsPerMonth: number;
  maxProductsPerCampaign: number;
  comparisonFeatures: string[];
  mrr: number;
  stripePriceConfigured: boolean;
  sslPriceConfigured?: boolean;
};

export type BillingEntitlements = {
  plan: StorePlanId;
  subscriptionPlan: StorePlanId;
  status: string;
  limits: BillingPlan;
  isTrialing: boolean;
  trialDaysLeft: number | null;
  trialEndsAt: string | null;
  trialUsed: boolean;
  canStartTrial: boolean;
  billingInterval: BillingInterval;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  billingProvider: string | null;
  isPaid: boolean;
};

export type ComparisonRow = {
  key: string;
  label: string;
  values: Record<"FREE" | "PRO" | "PRO_PLUS" | "ULTRA", string | boolean>;
};

export type BillingOverview = {
  store: { id: string; brandName: string; plan: string };
  subscription: {
    id: string;
    plan: string;
    status: string;
    billingProvider?: string | null;
    billingInterval?: BillingInterval;
    stripeSubscriptionId?: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    trialEndsAt?: string | null;
    trialUsed?: boolean;
  };
  entitlements: BillingEntitlements;
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
    provider?: string | null;
    invoiceUrl: string | null;
    pdfUrl: string | null;
    paidAt: string | null;
    createdAt: string;
  }>;
  usage: { productCount: number; memberCount: number };
  limits: BillingPlan;
  comparisonRows: ComparisonRow[];
  stripeConfigured: boolean;
  sslConfigured?: boolean;
};

export async function getBillingPlansAction() {
  const res = await httpClient.get<BillingPlan[]>("/billing/plans");
  return res.data ?? [];
}

export async function getBillingOverviewAction() {
  const res = await httpClient.get<BillingOverview>("/billing/overview");
  return res.data;
}

export async function createBillingCheckoutAction(
  plan: PaidPlanId,
  provider: BillingProvider = "STRIPE",
  interval: BillingInterval = "MONTHLY",
) {
  try {
    const res = await httpClient.post<{ url: string | null }>("/billing/checkout", {
      plan,
      provider,
      interval,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? "Failed to start checkout.");
    }
    throw error;
  }
}

export async function startBillingTrialAction() {
  try {
    const res = await httpClient.post<{ message: string; entitlements: BillingEntitlements }>(
      "/billing/start-trial",
      {},
    );
    revalidatePath("/dashboard/settings/billing");
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? "Failed to start trial.");
    }
    throw error;
  }
}

export async function createBillingPortalAction() {
  try {
    const res = await httpClient.post<{ url: string | null }>("/billing/portal", {});
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? "Failed to open billing portal.");
    }
    throw error;
  }
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

export async function overrideStorePlanAction(
  storeId: string,
  plan: StorePlanId | "ENTERPRISE",
) {
  await httpClient.patch(`/admin/stores/${storeId}/plan`, { plan });
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/admin-management");
}
