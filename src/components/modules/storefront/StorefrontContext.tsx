"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getPublicStoreAction,
  getPublicCategoriesAction,
} from "@/actions/catalog.actions";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { Category, Store, StorefrontCustomer } from "@/types/store.types";
import type { StorefrontColorMode } from "@/lib/storefront/types";

interface StorefrontContextValue {
  slug: string;
  store: Store | null;
  categories: Category[];
  storeReady: boolean;
  storeNotFound: boolean;
  customer: StorefrontCustomer | null;
  setCustomer: (customer: StorefrontCustomer | null) => void;
  customerReady: boolean;
  /** Server-read color mode cookie for skeleton SSR/hydration */
  initialColorMode: StorefrontColorMode | null;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontContextProvider({
  slug,
  initialColorMode = null,
  children,
}: {
  slug: string;
  initialColorMode?: StorefrontColorMode | null;
  children: ReactNode;
}) {
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeReady, setStoreReady] = useState(false);
  const [storeNotFound, setStoreNotFound] = useState(false);
  const [customer, setCustomer] = useState<StorefrontCustomer | null>(null);
  const [customerReady, setCustomerReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStoreReady(false);
    setStoreNotFound(false);
    setStore(null);
    setCategories([]);
    setCustomer(null);
    setCustomerReady(false);

    Promise.all([
      getPublicStoreAction(slug),
      getPublicCategoriesAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
    ])
      .then(([storeData, categoriesRes]) => {
        if (cancelled) return;
        if (!storeData) {
          setStoreNotFound(true);
          return;
        }
        setStore(storeData);
        setCategories((categoriesRes.data ?? []) as Category[]);
      })
      .catch(() => {
        if (!cancelled) setStoreNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setStoreReady(true);
      });

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
    () => ({
      slug,
      store,
      categories,
      storeReady,
      storeNotFound,
      customer,
      setCustomer,
      customerReady,
      initialColorMode,
    }),
    [slug, store, categories, storeReady, storeNotFound, customer, customerReady, initialColorMode],
  );

  if (storeReady && storeNotFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Store not found</h1>
        <p className="text-muted-foreground">
          This store does not exist or is no longer available.
        </p>
      </div>
    );
  }

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
