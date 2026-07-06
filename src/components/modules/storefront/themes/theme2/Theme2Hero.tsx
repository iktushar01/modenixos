"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { cn } from "@/lib/utils";

interface Theme2HeroProps {
  store: Store;
  theme: StorefrontThemeConfig;
}

export function Theme2Hero({ store, theme }: Theme2HeroProps) {
  const slides =
    theme.heroSlides.length > 0
      ? theme.heroSlides
      : store.banner
        ? [store.banner]
        : [];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const shopHref = `/store/${store.slug}/shop`;

  return (
    <section className="sf-theme2-hero sf-section w-full border-b sf-border">
      <div className="grid min-h-[min(78vh,720px)] gap-0 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <p className="sf-eyebrow mb-4">{store.brandName}</p>
          <h1 className="sf-display-xl max-w-xl">{theme.heroHeadline}</h1>
          <p className="sf-body-lg sf-muted-fg mt-5 max-w-md leading-relaxed">{theme.heroSubtext}</p>
          <Link
            href={shopHref}
            className="sf-btn-primary mt-8 inline-flex w-fit items-center gap-2 px-6 py-3 text-sm font-medium"
          >
            Shop collection
            <ArrowRight className="h-4 w-4" />
          </Link>
          {slides.length > 1 && (
            <div className="mt-10 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="sf-touch-target flex items-center justify-center p-1"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "block h-1 rounded-full transition-all duration-500",
                      i === index ? "w-8 bg-[var(--sf-primary)]" : "w-4 bg-[var(--sf-muted-fg)]/30",
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-0">
          {slides.length === 0 ? (
            <div className="sf-muted absolute inset-0" aria-hidden />
          ) : (
            <>
              <AnimatePresence mode="sync">
                <motion.div
                  key={slides[index]}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slides[index]!}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
              <div className="sf-hero-overlay pointer-events-none absolute inset-0" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
