"use client";

import {
  keepPreviousData,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";

type DashboardQueryOptions<TQueryFnData, TError, TData> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData>,
  "placeholderData"
> & {
  placeholderData?: UseQueryOptions<TQueryFnData, TError, TData>["placeholderData"];
};

/** Dashboard queries keep previous page data while refetching — avoids flicker on navigation. */
export function useDashboardQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
>(
  options: DashboardQueryOptions<TQueryFnData, TError, TData> & {
    queryKey: QueryKey;
  },
) {
  return useQuery({
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    ...options,
  });
}
