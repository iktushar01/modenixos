"use client";

import { Star } from "lucide-react";
import { Review } from "@/types/store.types";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  const featured = reviews.slice(0, 6);

  return (
    <section className="sf-t2-section">
      <div className="sf-section">
        <div className="sf-t2-section-head mb-10">
          <p className="sf-t2-label">Voices</p>
          <h2 className="sf-t2-section-title">Customer notes</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((review) => (
            <blockquote key={review.id} className="sf-t2-review-card">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < review.rating ? "sf-star-filled" : "sf-star-empty",
                    )}
                    strokeWidth={1.25}
                  />
                ))}
              </div>
              {review.comment && (
                <p className="sf-t2-review-text mt-4">&ldquo;{review.comment}&rdquo;</p>
              )}
              <footer className="sf-t2-review-author mt-5">
                {review.guestName ?? "Verified customer"}
                {review.product?.name && (
                  <span className="sf-t2-review-product"> · {review.product.name}</span>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
