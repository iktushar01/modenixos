"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, Review } from "@/types/store.types";
import { WriteReviewDialog } from "./WriteReviewDialog";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  storeSlug: string;
  product: Product;
  reviews: Review[];
}

function buildDistribution(reviews: Review[]) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, r.rating)) as keyof typeof dist;
    dist[key] += 1;
  }
  return dist;
}

export function ProductReviews({ storeSlug, product, reviews }: ProductReviewsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const dist = buildDistribution(reviews);
  const maxCount = Math.max(...Object.values(dist), 1);

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="sf-eyebrow">Reviews</p>
          <h2 className="sf-display-lg mt-2 text-xl">Customer reviews</h2>
        </div>
        <Button size="sm" className="sf-btn-primary rounded-full px-5" onClick={() => setDialogOpen(true)}>
          Write review
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_1fr]">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-3xl font-bold sf-fg">
            {count}/{count}
          </p>
          <div className="flex justify-center gap-0.5 md:justify-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(avg) ? "sf-star-filled" : "sf-star-empty",
                )}
              />
            ))}
          </div>
          <p className="sf-muted-fg text-sm">({avg.toFixed(1)})</p>
          <p className="sf-muted-fg text-xs">{count} Reviews</p>
          <p className="sf-muted-fg text-xs">Verified Purchase</p>
        </div>

        <div className="space-y-2">
          {([5, 4, 3, 2, 1] as const).map((stars) => (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-3 sf-muted-fg">{stars}</span>
              <div className="sf-rating-bar h-2 flex-1 overflow-hidden rounded-full border">
                <div
                  className="sf-rating-bar-fill h-full transition-all"
                  style={{ width: `${(dist[stars] / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right sf-muted-fg">{dist[stars]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-semibold sf-fg">Product Reviews</h3>
        {reviews.length === 0 ? (
          <p className="sf-muted-fg text-sm">No reviews available for this product.</p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="sf-border border-b pb-6 last:border-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium sf-fg">{r.guestName ?? "Customer"}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r.rating ? "sf-star-filled" : "sf-star-empty",
                        )}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="sf-muted-fg text-sm">{r.comment}</p>}
                {r.reply && (
                  <p className="sf-muted-fg mt-2 border-l-2 pl-3 text-sm italic sf-border">
                    Store reply: {r.reply}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <WriteReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        storeSlug={storeSlug}
        productId={product.id}
        productName={product.name}
      />
    </section>
  );
}
