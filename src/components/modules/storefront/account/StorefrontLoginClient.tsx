"use client";

import { Category, Store } from "@/types/store.types";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { AccountAuthLayout } from "./AccountAuthLayout";
import { StorefrontOtpAuthForm } from "./StorefrontOtpAuthForm";

export default function StorefrontLoginClient({
  store,
  categories = [],
  nextPath,
}: {
  store: Store;
  categories?: Category[];
  nextPath?: string;
}) {
  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <AccountAuthLayout
          title="Log in"
          subtitle={`Sign in to ${store.brandName} with a one-time code sent to your email.`}
        >
          <StorefrontOtpAuthForm store={store} mode="login" nextPath={nextPath} />
        </AccountAuthLayout>
      </main>
    </StorefrontPageShell>
  );
}
