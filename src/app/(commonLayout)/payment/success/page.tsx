"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { storeBasePath, storeOrderConfirmationPath } from "@/lib/storePaths";

function RedirectToStorePaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = searchParams.get("store");
  const order = searchParams.get("order");
  const email = searchParams.get("email");
  const tranId = searchParams.get("tran_id") ?? undefined;

  useEffect(() => {
    if (store && order && email) {
      router.replace(storeOrderConfirmationPath(store, { order, email, tranId }));
      return;
    }
    if (store) {
      router.replace(storeBasePath(store));
      return;
    }
    router.replace("/");
  }, [email, order, router, store, tranId]);

  return <div className="min-h-[50vh]" />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <RedirectToStorePaymentSuccess />
    </Suspense>
  );
}
