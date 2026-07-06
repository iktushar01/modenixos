"use client";

import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { testimonials } from "./landing-data";
import { TestimonialCard } from "./landing/TestimonialCard";

export default function TestimonialsSection() {
  return (
    <section className="border-b border-border/60 py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Trusted by operators"
            title="Loved across industries"
            description="From electronics to furniture to beauty — businesses choose ModenixOS to run smarter."
          />
        </AnimatedContent>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <FadeContent key={item.name} delay={i * 80} duration={700}>
              <TestimonialCard item={item} />
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
