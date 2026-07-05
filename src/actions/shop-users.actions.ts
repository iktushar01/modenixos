"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ShopUsersData, StoreMemberRole } from "@/types/shop-users.types";
import { revalidatePath } from "next/cache";

export async function getShopUsersAction() {
  const res = await httpClient.get<ShopUsersData>("/stores/me/members");
  return res.data;
}

export async function inviteShopUserAction(payload: { email: string; role: StoreMemberRole }) {
  const res = await httpClient.post("/stores/me/members", payload);
  revalidatePath("/dashboard/settings/users");
  return res.data;
}

export async function removeShopUserAction(memberId: string) {
  await httpClient.delete(`/stores/me/members/${memberId}`);
  revalidatePath("/dashboard/settings/users");
}

export async function revokeShopInvitationAction(invitationId: string) {
  await httpClient.delete(`/stores/me/invitations/${invitationId}`);
  revalidatePath("/dashboard/settings/users");
}

export async function acceptShopInvitationAction(token: string) {
  const res = await httpClient.post(`/stores/invitations/${token}/accept`, {});
  revalidatePath("/dashboard");
  return res.data;
}
