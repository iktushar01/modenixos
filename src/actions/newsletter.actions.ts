"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export type NewsletterSettings = {
  enabled?: boolean;
  doubleOptIn?: boolean;
  welcomeEnabled?: boolean;
  welcomeSubject?: string;
  welcomeHeadline?: string;
  welcomeBody?: string;
  fromName?: string;
  replyTo?: string | null;
  footerText?: string;
  primaryColor?: string;
};

export type NewsletterSubscriber = {
  id: string;
  storeId: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED";
  source: string;
  subscribedAt: string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
  createdAt: string;
};

export type NewsletterCampaign = {
  id: string;
  storeId: string;
  type:
    | "PROMOTION"
    | "PRODUCT_SPOTLIGHT"
    | "NEW_ARRIVALS"
    | "COLLECTION"
    | "ANNOUNCEMENT"
    | "CUSTOM";
  status: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "FAILED" | "CANCELLED";
  subject: string;
  previewText?: string | null;
  headline?: string | null;
  bodyHtml?: string | null;
  productIds: string[];
  collectionId?: string | null;
  couponCode?: string | null;
  scheduledAt?: string | null;
  sentAt?: string | null;
  recipientCount: number;
  createdAt: string;
  updatedAt: string;
  collection?: { id: string; name: string; slug: string } | null;
};

export async function subscribeNewsletterAction(
  slug: string,
  email: string,
  source: "homepage" | "footer" | "checkout" = "homepage",
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to subscribe");
  return json.data as { ok: boolean; message: string; requiresConfirmation: boolean };
}

export async function confirmNewsletterAction(slug: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/newsletter/confirm?token=${encodeURIComponent(token)}`,
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to confirm subscription");
  return json.data;
}

export async function unsubscribeNewsletterAction(slug: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to unsubscribe");
  return json.data;
}

export async function getNewsletterStatsAction() {
  const res = await httpClient.get<{
    active: number;
    pending: number;
    unsubscribed: number;
    campaignsSent: number;
  }>("/newsletter/stats");
  return res.data;
}

export async function getNewsletterSubscribersAction(params?: Record<string, unknown>) {
  return httpClient.get<NewsletterSubscriber[]>("/newsletter/subscribers", { params });
}

export async function deleteNewsletterSubscriberAction(id: string) {
  await httpClient.delete(`/newsletter/subscribers/${id}`);
  revalidatePath("/dashboard/marketing/newsletter");
}

export async function getNewsletterSettingsAction() {
  const res = await httpClient.get<NewsletterSettings>("/newsletter/settings");
  return res.data;
}

export async function updateNewsletterSettingsAction(data: NewsletterSettings) {
  const res = await httpClient.patch<NewsletterSettings>("/newsletter/settings", data);
  revalidatePath("/dashboard/marketing/newsletter");
  return res.data;
}

export async function getNewsletterCampaignsAction(params?: Record<string, unknown>) {
  return httpClient.get<NewsletterCampaign[]>("/newsletter/campaigns", { params });
}

export async function getNewsletterCampaignAction(id: string) {
  const res = await httpClient.get<NewsletterCampaign>(`/newsletter/campaigns/${id}`);
  return res.data;
}

export async function createNewsletterCampaignAction(data: Record<string, unknown>) {
  const res = await httpClient.post<NewsletterCampaign>("/newsletter/campaigns", data);
  revalidatePath("/dashboard/marketing/newsletter");
  revalidatePath("/dashboard/marketing/newsletter/campaigns");
  return res.data;
}

export async function updateNewsletterCampaignAction(id: string, data: Record<string, unknown>) {
  const res = await httpClient.patch<NewsletterCampaign>(`/newsletter/campaigns/${id}`, data);
  revalidatePath("/dashboard/marketing/newsletter");
  revalidatePath(`/dashboard/marketing/newsletter/campaigns/${id}`);
  return res.data;
}

export async function sendNewsletterCampaignAction(id: string) {
  const res = await httpClient.post<NewsletterCampaign>(`/newsletter/campaigns/${id}/send`, {});
  revalidatePath("/dashboard/marketing/newsletter");
  revalidatePath(`/dashboard/marketing/newsletter/campaigns/${id}`);
  return res.data;
}

export async function deleteNewsletterCampaignAction(id: string) {
  await httpClient.delete(`/newsletter/campaigns/${id}`);
  revalidatePath("/dashboard/marketing/newsletter/campaigns");
}
