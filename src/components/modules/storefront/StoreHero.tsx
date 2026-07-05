"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { cn } from "@/lib/utils";

interface StoreHeroProps {
  store: Store;
  theme: StorefrontThemeConfig;
}

export function StoreHero({ store, theme }: StoreHeroProps) {
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
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative h-[50vh] min-h-[320px] bg-gradient-to-br from-zinc-900 via-black to-zinc-950 md:h-[70vh]" />
    );
  }

  return (
    <section className="relative h-[50vh] min-h-[320px] overflow-hidden md:h-[70vh] lg:h-[85vh]">
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </section>
  );
}
