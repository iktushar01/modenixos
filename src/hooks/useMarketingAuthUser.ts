"use client";

import { syncAuthUserAction } from "@/actions/authActions/_syncAuthUserAction";
import { warmClientDashboardCookiesAction } from "@/actions/authActions/_warmClientDashboardCookiesAction";
import { normalizeMarketingRole } from "@/lib/marketing/authCta";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { UserFromCookie } from "@/types/auth.types";

const readUserCookie = (): UserFromCookie | null => {
  const raw = getCookie("user");
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as UserFromCookie;
  } catch {
    return null;
  }
};

export function useMarketingAuthUser() {
  const cookieUser = useMemo(() => readUserCookie(), []);

  const { data: syncedUser } = useQuery({
    queryKey: ["auth-user-sync"],
    queryFn: syncAuthUserAction,
    enabled: !cookieUser,
    staleTime: 60_000,
    retry: false,
  });

  const user = useMemo(() => {
    if (cookieUser) return cookieUser;
    if (syncedUser?.success && syncedUser.data) return syncedUser.data;
    return null;
  }, [cookieUser, syncedUser]);

  useEffect(() => {
    if (!user) return;
    const role = normalizeMarketingRole(user.role);
    if (role !== "CLIENT") return;
    void warmClientDashboardCookiesAction();
  }, [user]);

  return user;
}
