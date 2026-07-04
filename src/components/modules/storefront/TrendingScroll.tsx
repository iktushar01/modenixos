"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

interface TrendingScrollProps {
  store: Store;
  products: Product[];
  theme: StorefrontThemeConfig;
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
}

export function TrendingScroll({ store, products, theme, ratings, onQuickView }: TrendingScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Trending</p>
            <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">Popular Right Now</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-none md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            store={store}
            theme={theme}
            rating={ratings[p.id]}
            onQuickView={onQuickView}
            layout="scroll"
          />
        ))}
      </div>
    </section>
  );
}
