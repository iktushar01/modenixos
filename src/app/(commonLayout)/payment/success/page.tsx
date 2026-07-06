"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order") ?? "—";
  const tranId = searchParams.get("tran_id") ?? "—";
  const amount = searchParams.get("amount");
  const store = searchParams.get("store");
  const storeBase = store ? `/store/${store}` : "/";

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
      <Card className="w-full border-emerald-500/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Payment successful</CardTitle>
          <CardDescription>Thank you! Your payment was confirmed and your order is being processed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-medium">{order}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-xs">{tranId}</span>
            </div>
            {amount && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Amount paid</span>
                <span className="font-medium">৳{Number(amount).toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href={storeBase}>Continue shopping</Link>
            </Button>
            {store && (
              <Button asChild variant="outline" className="flex-1 gap-2">
                <Link href={`${storeBase}/account/orders`}>
                  <ShoppingBag className="h-4 w-4" />
                  View orders
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
