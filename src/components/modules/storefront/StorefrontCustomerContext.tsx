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

interface StorefrontCustomerContextValue {
  slug: string;
  customer: StorefrontCustomer | null;
  setCustomer: (customer: StorefrontCustomer | null) => void;
  logout: () => Promise<void>;
}

const StorefrontCustomerContext = createContext<StorefrontCustomerContextValue | null>(null);

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
  const ctx = useContext(StorefrontCustomerContext);
  if (!ctx) {
    throw new Error("useStorefrontCustomer must be used within StorefrontCustomerProvider");
  }
  return ctx;
}

/** Safe hook for shared components that may render outside the slug layout. */
export function useOptionalStorefrontCustomer() {
  return useContext(StorefrontCustomerContext);
}
