"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { StorefrontCTA } from "../../ui";
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
  const base = `/store/${store.slug}`;
  const headline = theme.heroHeadline || store.brandName;
  const subtext = theme.heroSubtext || store.description || "Curated pieces for the modern wardrobe.";

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section
        className="relative flex w-full items-center justify-center sf-muted"
        style={{ height: heroHeight, minHeight: "320px" }}
      >
        <div className="sf-section text-center">
          <p className="sf-eyebrow">Welcome</p>
          <h1 className="sf-display-xl mt-3">{store.brandName}</h1>
          <p className="sf-body-lg sf-muted-fg mx-auto mt-4 max-w-lg">{subtext}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <StorefrontCTA href={`${base}#shop`}>Shop now</StorefrontCTA>
            <StorefrontCTA href={`${base}#about`} variant="outline">
              Our story
            </StorefrontCTA>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight, minHeight: "420px" }}
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

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--sf-image-overlay) 85%, transparent) 0%, color-mix(in srgb, var(--sf-image-overlay) 35%, transparent) 45%, transparent 100%)",
        }}
      />

      <div className="sf-section absolute inset-0 flex flex-col justify-end pb-12 md:pb-16">
        <div className="max-w-2xl">
          <p className="sf-eyebrow sf-image-overlay-fg">{store.brandName}</p>
          <h1 className="sf-display-xl sf-image-overlay-fg mt-3">{headline}</h1>
          <p className="sf-body-lg sf-image-overlay-muted mt-4 max-w-xl">{subtext}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StorefrontCTA href={`${base}#shop`}>Shop collection</StorefrontCTA>
            <StorefrontCTA href={`${base}#about`} variant="outline">
              Discover more
            </StorefrontCTA>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-0.5 w-8 transition-all duration-300",
                  i === index ? "sf-image-overlay-fg w-12 opacity-100" : "sf-image-overlay-muted opacity-40",
                )}
                style={{ backgroundColor: "currentColor" }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
