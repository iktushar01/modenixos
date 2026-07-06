"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { storeShopPath } from "@/lib/storePaths";
import { ProductCard } from "./ProductCard";
import { StorefrontSection } from "./ui";
import {
  StorefrontCarousel,
  StorefrontCarouselHeaderAction,
  StorefrontCarouselSlide,
  StorefrontCarouselTrack,
} from "./ui";

interface TrendingScrollProps {
  store: Store;
  products: Product[];
  theme: StorefrontThemeConfig;
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
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
    <section className="py-16 md:py-24">
      <StorefrontCarousel>
        <StorefrontSection
          eyebrow="Trending"
          title="Popular right now"
          action={
            <StorefrontCarouselHeaderAction
              viewAllHref={storeShopPath(store.slug)}
              itemCount={products.length}
            />
          }
        />

        <StorefrontCarouselTrack>
          {products.map((product) => (
            <StorefrontCarouselSlide key={product.id}>
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
            </StorefrontCarouselSlide>
          ))}
        </StorefrontCarouselTrack>
      </StorefrontCarousel>
    </section>
  );
}
