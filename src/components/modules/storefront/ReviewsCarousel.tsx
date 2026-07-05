"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Review } from "@/types/store.types";
import { StorefrontSection } from "./ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReviewsCarouselProps {
  reviews: Review[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);

  if (reviews.length === 0) return null;

  const current = reviews[index];
  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <section className="sf-border border-y sf-muted py-16 md:py-24">
      <StorefrontSection
        align="center"
        eyebrow="Testimonials"
        title="What customers say"
        className="mb-0"
      >
        <div className="relative mx-auto mt-12 max-w-3xl text-center">
          <span className="sf-quote-mark block" aria-hidden>
            &ldquo;
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-4 w-4", i < current.rating ? "sf-star-filled" : "sf-star-empty")}
                    strokeWidth={1.25}
                  />
                ))}
              </div>
              {current.comment && (
                <p className="sf-font-display sf-muted-fg text-xl italic leading-relaxed md:text-2xl">
                  {current.comment}
                </p>
              )}
              <p className="sf-eyebrow sf-fg">{current.guestName ?? "Verified customer"}</p>
              {current.product?.name && (
                <p className="sf-muted-fg text-xs">Purchased {current.product.name}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {reviews.length > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <Button variant="ghost" size="icon" onClick={prev} aria-label="Previous review">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={next} aria-label="Next review">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </StorefrontSection>
    </section>
  );
}
