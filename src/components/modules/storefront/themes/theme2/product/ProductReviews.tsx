"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Product, Review } from "@/types/store.types";
import { WriteReviewDialog } from "../../theme1/product/WriteReviewDialog";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  storeSlug: string;
  product: Product;
  reviews: Review[];
}

export function ProductReviews({ storeSlug, product, reviews }: ProductReviewsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  return (
    <section className="sf-t2-product-reviews mt-12 border-t sf-border pt-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="sf-t2-label">Reviews</p>
          <h2 className="sf-t2-section-title mt-2 text-2xl">Customer notes</h2>
          {count > 0 && (
            <p className="sf-t2-section-sub mt-2">
              {avg.toFixed(1)} average · {count} {count === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
        <button type="button" className="sf-t2-btn-ghost" onClick={() => setDialogOpen(true)}>
          Write a review
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="sf-t2-section-sub">No reviews yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="divide-y sf-border border-t">
          {reviews.map((review) => (
            <li key={review.id} className="py-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3.5 w-3.5", i < review.rating ? "sf-star-filled" : "sf-star-empty")}
                    strokeWidth={1.25}
                  />
                ))}
              </div>
              {review.comment && <p className="sf-t2-review-text mt-3">{review.comment}</p>}
              <p className="sf-t2-review-author mt-3">{review.guestName ?? "Verified customer"}</p>
            </li>
          ))}
        </ul>
      )}

      <WriteReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        storeSlug={storeSlug}
        product={product}
      />
    </section>
  );
}
