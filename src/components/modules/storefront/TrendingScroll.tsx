"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { ProductCard } from "./ProductCard";
import { StorefrontSection } from "./ui";
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
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 sf-fg disabled:opacity-25"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label="Previous products"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 sf-fg disabled:opacity-25"
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label="Next products"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
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

  const navButtons = products.length > 1 ? <TrendingNavButtons /> : null;

  return (
    <section className="py-16 md:py-24">
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps" }}
        className="w-full"
      >
        <StorefrontSection
          eyebrow="Trending"
          title="Popular right now"
          action={
            <div className="flex items-center gap-4">
              <Link
                href={`/store/${store.slug}#shop`}
                className="sf-eyebrow sf-link hidden transition-colors sf-hover-fg sm:inline"
              >
                View all
              </Link>
              {navButtons}
            </div>
          }
        />

        <div className="sf-section sf-carousel-fade-left sf-carousel-fade-right mt-8 w-full">
          <CarouselContent className="-ml-6 pb-2">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[78%] pl-6 sm:basis-[52%] md:basis-[38%] lg:basis-[28%] xl:basis-[24%]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    product={product}
                    store={store}
                    theme={theme}
                    rating={ratings[product.id]}
                    onQuickView={onQuickView}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
}
