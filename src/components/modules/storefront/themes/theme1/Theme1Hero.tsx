"use client";

import { useEffect, useState } from "react";
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
  const heroHeight = theme.layout.heroHeight || "60vh";

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section
        className="relative w-full sf-muted"
        style={{ height: heroHeight, minHeight: "280px" }}
      />
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight, minHeight: "280px" }}
    >
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Image src={src} alt="" fill priority={i === 0} className="object-cover" unoptimized />
        </div>
      ))}
    </section>
  );
}
