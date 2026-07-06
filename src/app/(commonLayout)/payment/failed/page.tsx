"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const store = searchParams.get("store");
  const checkoutUrl = store ? `/store/${store}/checkout` : "/";

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
      <Card className="w-full border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment failed</CardTitle>
          <CardDescription>
            {order
              ? `We could not process payment for order ${order}. You can try again.`
              : "Your payment could not be processed. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href={checkoutUrl}>Retry payment</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={checkoutUrl}>Return to checkout</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <PaymentFailedContent />
    </Suspense>
  );
}
