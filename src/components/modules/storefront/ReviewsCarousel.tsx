"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Review } from "@/types/store.types";
import { Button } from "@/components/ui/button";

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
    <section className="border-y border-white/10 bg-white/[0.02] py-20">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Testimonials</p>
        <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">What Customers Say</h2>

        <div className="relative mt-12 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <Quote className="mx-auto h-8 w-8 text-white/20" />
              <div className="flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < current.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                  />
                ))}
              </div>
              {current.comment && (
                <p className="text-lg leading-relaxed text-white/70 md:text-xl">&ldquo;{current.comment}&rdquo;</p>
              )}
              <p className="text-sm font-medium text-white">{current.guestName ?? "Verified Customer"}</p>
              {current.product?.name && (
                <p className="text-xs text-white/40">Purchased {current.product.name}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {reviews.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white hover:bg-white/10" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white hover:bg-white/10" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
