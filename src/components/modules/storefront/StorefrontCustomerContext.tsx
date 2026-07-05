"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { StorefrontCustomer } from "@/types/store.types";
import { logoutStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { useOptionalStorefront } from "./StorefrontContext";

interface StorefrontCustomerContextValue {
  slug: string;
  customer: StorefrontCustomer | null;
  setCustomer: (customer: StorefrontCustomer | null) => void;
  logout: () => Promise<void>;
}

const StorefrontCustomerContext = createContext<StorefrontCustomerContextValue | null>(null);

/** Legacy provider — prefer StorefrontContextProvider in the slug layout. */
export function StorefrontCustomerProvider({
  slug,
  initialCustomer,
  children,
}: {
  slug: string;
  initialCustomer: StorefrontCustomer | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<StorefrontCustomer | null>(initialCustomer);

  const logout = useCallback(async () => {
    await logoutStorefrontCustomerAction(slug);
    setCustomer(null);
    router.refresh();
  }, [slug, router]);

  const value = useMemo(
    () => ({ slug, customer, setCustomer, logout }),
    [slug, customer, logout],
  );

  return (
    <StorefrontCustomerContext.Provider value={value}>
      {children}
    </StorefrontCustomerContext.Provider>
  );
}

export function useStorefrontCustomer() {
  const storefront = useOptionalStorefront();
  const legacy = useContext(StorefrontCustomerContext);
  const router = useRouter();

  const logout = useCallback(async () => {
    const slug = storefront?.slug ?? legacy?.slug;
    if (!slug) return;
    await logoutStorefrontCustomerAction(slug);
    storefront?.setCustomer(null);
    legacy?.setCustomer(null);
    router.refresh();
  }, [storefront, legacy, router]);

  if (storefront) {
    return {
      slug: storefront.slug,
      customer: storefront.customer,
      setCustomer: storefront.setCustomer,
      logout,
    };
  }

  if (!legacy) {
    throw new Error("useStorefrontCustomer must be used within StorefrontCustomerProvider");
  }

  return { ...legacy, logout };
}

export function useOptionalStorefrontCustomer() {
  const storefront = useOptionalStorefront();
  const legacy = useContext(StorefrontCustomerContext);
  const router = useRouter();

  const logout = useCallback(async () => {
    const slug = storefront?.slug ?? legacy?.slug;
    if (!slug) return;
    await logoutStorefrontCustomerAction(slug);
    storefront?.setCustomer(null);
    legacy?.setCustomer(null);
    router.refresh();
  }, [storefront, legacy, router]);

  if (storefront) {
    return {
      slug: storefront.slug,
      customer: storefront.customer,
      setCustomer: storefront.setCustomer,
      logout,
    };
  }

  return legacy;
}
