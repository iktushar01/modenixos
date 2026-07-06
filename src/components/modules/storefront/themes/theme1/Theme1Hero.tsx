"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { cn } from "@/lib/utils";

interface Theme1HeroProps {
  store: Store;
  theme: StorefrontThemeConfig;
}

export function Theme1Hero({ store, theme }: Theme1HeroProps) {
  const slides =
    theme.heroSlides.length > 0
      ? theme.heroSlides
      : store.banner
        ? [store.banner]
        : [];

  const [index, setIndex] = useState(0);
  const heroHeight = theme.layout.heroHeight || "72vh";

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="sf-muted sf-hero-height w-full" aria-hidden />
    );
  }

  return (
    <section
      className="sf-hero-height relative w-full overflow-hidden"
      style={{ "--sf-hero-h": heroHeight } as CSSProperties}
    >
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            className={cn("object-cover", i === index && "sf-hero-ken-burns")}
            unoptimized
          />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 sm:gap-2 md:bottom-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="sf-touch-target flex items-center justify-center p-2"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            >
              <span
                className={cn(
                  "block h-1 rounded-full bg-white/90 shadow-sm transition-all duration-300",
                  i === index ? "w-8 opacity-100" : "w-4 opacity-45",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
