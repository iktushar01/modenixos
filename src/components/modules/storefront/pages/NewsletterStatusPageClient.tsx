"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { confirmNewsletterAction, unsubscribeNewsletterAction } from "@/actions/newsletter.actions";

export default function NewsletterConfirmPageClient({ mode }: { mode: "confirm" | "unsubscribe" }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { slug, store, categories, storeReady } = useStorefront();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!storeReady || !store || !token) return;
    const action = mode === "confirm" ? confirmNewsletterAction : unsubscribeNewsletterAction;
    action(slug, token)
      .then((result) => {
        setStatus("success");
        setMessage(result.message ?? "Done");
      })
      .catch((err: Error) => {
        setStatus("error");
        setMessage(err.message);
      });
  }, [mode, slug, store, storeReady, token]);

  if (!storeReady || !store) {
    return <div className="sf-section py-20 text-center">Loading…</div>;
  }

  const base = `/store/${store.slug}`;
  const Icon = status === "success" ? CheckCircle2 : XCircle;

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-20">
        <div className="mx-auto max-w-lg text-center">
          {status !== "loading" && (
            <Icon
              className={`mx-auto mb-6 h-14 w-14 ${status === "success" ? "text-[var(--sf-success)]" : "text-destructive"}`}
            />
          )}
          <h1 className="sf-display-lg">
            {mode === "confirm" ? "Subscription confirmed" : "Unsubscribed"}
          </h1>
          <p className="sf-muted-fg mt-4 text-sm">
            {status === "loading" ? "Please wait…" : message}
          </p>
          <Button asChild className="sf-btn-primary mt-8 rounded-full">
            <Link href={base}>Back to store</Link>
          </Button>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
