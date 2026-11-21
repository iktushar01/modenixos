"use client";

import { motion } from "motion/react";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { testimonials } from "./landing-data";
import { TestimonialCard } from "./landing/TestimonialCard";

export default function TestimonialsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-border/60 py-20 md:py-28">
      <div className="mkt-section">
        <div className="text-center mb-14">
          <p className="mkt-label mb-4">Trusted by operators</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.625rem]">
            Loved across industries
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-muted-foreground md:text-base">
            From electronics to furniture to beauty — businesses choose ModenixOS to run smarter.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <TestimonialCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
