"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StoreNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Store not found</h1>
        <p className="max-w-md text-muted-foreground">
          This store does not exist, is not published yet, or is no longer available.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
