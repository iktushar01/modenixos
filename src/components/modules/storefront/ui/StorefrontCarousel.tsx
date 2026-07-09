"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const STOREFRONT_CAROUSEL_ITEM_CLASS =
  "basis-[85%] pl-4 sm:basis-[52%] sm:pl-6 md:basis-[38%] lg:basis-[28%] xl:basis-[24%]";

export const STOREFRONT_CAROUSEL_TILE_CLASS =
  "basis-[80%] pl-4 sm:basis-[48%] sm:pl-6 md:basis-[36%] lg:basis-[26%] xl:basis-[22%]";

export function StorefrontCarouselNavButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="sf-carousel-btn sf-touch-target h-11 w-11 sf-fg disabled:opacity-25"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="sf-carousel-btn sf-touch-target h-11 w-11 sf-fg disabled:opacity-25"
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
      </Button>
    </div>
  );
}

interface StorefrontCarouselHeaderActionProps {
  viewAllHref?: string;
  viewAllLabel?: string;
  itemCount: number;
}

export function StorefrontCarouselHeaderAction({
  viewAllHref,
  viewAllLabel = "View all",
  itemCount,
}: StorefrontCarouselHeaderActionProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
      {viewAllHref ? (
        <StorefrontNavLink
          href={viewAllHref}
          className="sf-eyebrow sf-link sf-link-slide sf-touch-target inline-flex items-center px-1 sf-hover-fg"
        >
          {viewAllLabel}
        </StorefrontNavLink>
      ) : null}
      {itemCount > 1 ? <StorefrontCarouselNavButtons /> : null}
    </div>
  );
}

interface StorefrontCarouselProps {
  children: ReactNode;
  className?: string;
}

export function StorefrontCarousel({ children, className }: StorefrontCarouselProps) {
  return (
    <Carousel
      opts={{ align: "start", containScroll: "trimSnaps" }}
      className={cn("w-full overflow-hidden", className)}
    >
      {children}
    </Carousel>
  );
}

interface StorefrontCarouselTrackProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function StorefrontCarouselTrack({
  children,
  className,
  contentClassName,
}: StorefrontCarouselTrackProps) {
  return (
    <div
      className={cn(
        "sf-section sf-carousel-fade-left sf-carousel-fade-right mt-6 w-full max-w-full overflow-visible sm:mt-8 [&>[data-slot='carousel-content']]:overflow-visible",
        className,
      )}
    >
      <CarouselContent className={cn("-ml-6 pb-2", contentClassName)}>
        {children}
      </CarouselContent>
    </div>
  );
}

interface StorefrontCarouselSlideProps {
  children: ReactNode;
  className?: string;
}

export function StorefrontCarouselSlide({
  children,
  className = STOREFRONT_CAROUSEL_ITEM_CLASS,
}: StorefrontCarouselSlideProps) {
  return <CarouselItem className={className}>{children}</CarouselItem>;
}
