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

  const mainSrc = colorImage ?? images[activeIndex] ?? images[0] ?? null;

  if (!mainSrc) {
    return (
      <div className="sf-muted flex aspect-[4/5] items-center justify-center">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      {images.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "sf-image-zoom relative h-16 w-14 shrink-0 overflow-hidden border-2 md:h-20 md:w-16",
                activeIndex === i && !colorImage
                  ? "border-[var(--sf-primary)]"
                  : "sf-border border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
      <div className="sf-image-zoom sf-border sf-surface relative order-1 min-h-[360px] flex-1 overflow-hidden border md:order-2 md:min-h-[520px]">
        <Image
          src={mainSrc}
          alt={product.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
