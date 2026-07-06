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
    return <div className="sf-t2-gallery-empty">No image</div>;
  }

  return (
    <div className="sf-t2-gallery">
      <div className="sf-t2-gallery-main relative aspect-[4/5] overflow-hidden sf-muted md:aspect-[16/10]">
        <Image src={mainSrc} alt={product.name} fill className="object-cover" priority unoptimized />
      </div>
      {images.length > 1 && (
        <div className="sf-t2-gallery-strip mt-3 flex gap-0 overflow-x-auto border-t sf-border">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "sf-t2-gallery-thumb relative h-20 w-20 shrink-0 border-r sf-border",
                activeIndex === i && !colorImage ? "opacity-100" : "opacity-45 hover:opacity-80",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
