"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Ban, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { storeCartPath, storeCheckoutPath } from "@/lib/storePaths";

type PaymentStatus = "failed" | "cancelled";

export default function StorePaymentStatusPageClient({ status }: { status: PaymentStatus }) {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const tranId = searchParams.get("tran_id");
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return null;
  }

  const isFailed = status === "failed";
  const checkoutUrl = storeCheckoutPath(store.slug);
  const cartUrl = storeCartPath(store.slug);

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section flex min-h-[60vh] w-full items-center justify-center py-12 md:py-16">
        <div className="sf-editorial-card mx-auto w-full max-w-lg p-8 text-center">
          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
              isFailed ? "bg-destructive/10" : "bg-muted"
            }`}
          >
            {isFailed ? (
              <XCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Ban className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <p className="sf-eyebrow">{store.brandName}</p>
          <h1 className="sf-display-lg mt-2 text-2xl">
            {isFailed ? "Payment failed" : "Payment cancelled"}
          </h1>
          <p className="sf-muted-fg mt-3 text-sm">
            {order
              ? isFailed
                ? `We could not process payment for order ${order}. You can try again from checkout.`
                : `Payment for order ${order} was cancelled. No charges were made.`
              : isFailed
                ? "Your payment could not be processed. Please try again."
                : "You cancelled the payment. No charges were made."}
          </p>

          {tranId && (
            <p className="sf-muted-fg mt-2 font-mono text-xs">Transaction: {tranId}</p>
          )}

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Button asChild className="sf-btn-primary flex-1 rounded-full">
              <Link href={checkoutUrl}>{isFailed ? "Retry payment" : "Back to checkout"}</Link>
            </Button>
            <Button asChild variant="outline" className="sf-btn-outline flex-1 rounded-full">
              <Link href={cartUrl}>Return to cart</Link>
            </Button>
          </div>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
