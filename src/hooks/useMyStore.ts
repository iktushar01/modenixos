"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyStoreAction } from "@/actions/store.actions";

export function useMyStore() {
  return useQuery({
    queryKey: ["my-store"],
    queryFn: getMyStoreAction,
    staleTime: 60_000,
  });
}
