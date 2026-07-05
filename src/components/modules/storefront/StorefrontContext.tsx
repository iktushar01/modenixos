"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Category, Store, StorefrontCustomer } from "@/types/store.types";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";

interface StorefrontContextValue {
  slug: string;
  store: Store;
  categories: Category[];
  customer: StorefrontCustomer | null;
  setCustomer: (customer: StorefrontCustomer | null) => void;
  customerReady: boolean;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontContextProvider({
  slug,
  store,
  categories,
  children,
}: {
  slug: string;
  store: Store;
  categories: Category[];
  children: ReactNode;
}) {
  const [customer, setCustomer] = useState<StorefrontCustomer | null>(null);
  const [customerReady, setCustomerReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStorefrontCustomerAction(slug)
      .then((data) => {
        if (!cancelled) setCustomer(data);
      })
      .catch(() => {
        if (!cancelled) setCustomer(null);
      })
      .finally(() => {
        if (!cancelled) setCustomerReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const value = useMemo(
    () => ({ slug, store, categories, customer, setCustomer, customerReady }),
    [slug, store, categories, customer, customerReady],
  );

  return (
    <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext);
  if (!ctx) {
    throw new Error("useStorefront must be used within StorefrontContextProvider");
  }
  return ctx;
}

export function useOptionalStorefront() {
  return useContext(StorefrontContext);
}
