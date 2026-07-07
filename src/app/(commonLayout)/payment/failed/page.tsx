"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { storePaymentFailedPath } from "@/lib/storePaths";

function RedirectToStorePaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = searchParams.get("store");
  const order = searchParams.get("order") ?? undefined;
  const tranId = searchParams.get("tran_id") ?? undefined;

  useEffect(() => {
    if (store) {
      router.replace(storePaymentFailedPath(store, { order, tranId }));
      return;
    }
    router.replace("/");
  }, [order, router, store, tranId]);

  return <div className="min-h-[50vh]" />;
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <RedirectToStorePaymentFailed />
    </Suspense>
  );
}
