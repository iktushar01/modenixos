"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/store.types";

interface ProductGalleryProps {
  product: Product;
  selectedColor?: string;
  colorImages?: Record<string, string>;
}

export function ProductGallery({ product, selectedColor, colorImages }: ProductGalleryProps) {
  const colorImage =
    selectedColor && colorImages?.[selectedColor] ? colorImages[selectedColor] : null;
  const images = product.images.length > 0 ? product.images : [];
  const [activeIndex, setActiveIndex] = useState(0);

  const mainSrc =
    colorImage ?? images[activeIndex] ?? images[0] ?? null;

  if (!mainSrc) {
    return (
      <div className="sf-muted flex aspect-square items-center justify-center rounded-lg">
        No image
      </div>
    );
  }

  return (
    <div className="flex gap-3 md:gap-4">
      {images.length > 1 && (
        <div className="flex flex-col gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-14 overflow-hidden rounded border-2 transition-colors sm:h-20 sm:w-16",
                activeIndex === i && !colorImage
                  ? "border-[var(--sf-primary)]"
                  : "sf-border border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
      <div className="sf-border relative min-h-[320px] flex-1 overflow-hidden rounded-lg border bg-white sm:min-h-[480px]">
        <Image
          src={mainSrc}
          alt={product.name}
          fill
          className="object-contain p-2"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
