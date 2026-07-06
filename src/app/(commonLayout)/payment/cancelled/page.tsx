"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const store = searchParams.get("store");
  const checkoutUrl = store ? `/store/${store}/checkout` : "/";
  const cartUrl = store ? `/store/${store}/cart` : "/";

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Ban className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Payment cancelled</CardTitle>
          <CardDescription>
            {order
              ? `Payment for order ${order} was cancelled. No charges were made.`
              : "You cancelled the payment. No charges were made."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href={checkoutUrl}>Retry payment</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={cartUrl}>Return to cart</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <PaymentCancelledContent />
    </Suspense>
  );
}
