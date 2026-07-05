"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

interface TrendingScrollProps {
  store: Store;
  products: Product[];
  theme: StorefrontThemeConfig;
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
}

function TrendingNavButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border sf-border bg-transparent sf-fg hover:bg-[color-mix(in_srgb,var(--sf-muted)_60%,transparent)] disabled:opacity-30"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label="Previous products"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border sf-border bg-transparent sf-fg hover:bg-[color-mix(in_srgb,var(--sf-muted)_60%,transparent)] disabled:opacity-30"
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label="Next products"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TrendingScroll({
  store,
  products,
  theme,
  ratings,
  onQuickView,
}: TrendingScrollProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20">
      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          dragFree: false,
        }}
        className="w-full"
      >
        <div className="sf-section w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] sf-muted-fg">Trending</p>
              <h2 className="mt-2 text-3xl font-light sf-fg md:text-4xl">Popular Right Now</h2>
            </div>
            {products.length > 1 && <TrendingNavButtons />}
          </motion.div>
        </div>

        <div className="sf-section w-full">
          <CarouselContent className="-ml-4 pb-2">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[78%] pl-4 sm:basis-[52%] md:basis-[38%] lg:basis-[28%] xl:basis-[22%]"
              >
                <ProductCard
                  product={product}
                  store={store}
                  theme={theme}
                  rating={ratings[product.id]}
                  onQuickView={onQuickView}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
}
