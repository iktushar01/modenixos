"use client";

import { Category, Store } from "@/types/store.types";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { AccountAuthLayout } from "./AccountAuthLayout";
import { StorefrontOtpAuthForm } from "./StorefrontOtpAuthForm";

export default function StorefrontRegisterClient({
  store,
  categories = [],
}: {
  store: Store;
  categories?: Category[];
}) {
  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <AccountAuthLayout
          title="Create account"
          subtitle={`Join ${store.brandName} — we'll email you a code to verify your address.`}
        >
          <StorefrontOtpAuthForm store={store} mode="register" />
        </AccountAuthLayout>
      </main>
    </StorefrontPageShell>
  );
}
