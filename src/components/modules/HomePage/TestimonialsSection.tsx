"use client";

import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "We went from idea to live store in an afternoon. Products, checkout, and orders — all in one place.",
    name: "Amira Chen",
    role: "Founder, Luxe Threads",
    initials: "AC",
  },
  {
    quote:
      "Finally a platform built for fashion. Collections, variants, and a storefront that actually looks premium.",
    name: "Jordan Ellis",
    role: "Creative Director, Urban Edge",
    initials: "JE",
  },
  {
    quote:
      "The dashboard gives me clarity on what's selling. I check revenue and top products every morning.",
    name: "Sofia Reyes",
    role: "Owner, Nova Atelier",
    initials: "SR",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Trusted by founders"
            title="Built for fashion entrepreneurs"
            description="Independent brands use ModenixOS to launch faster and run smarter."
          />
        </AnimatedContent>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <FadeContent key={item.name} delay={i * 100} duration={700}>
              <div className="mkt-card flex h-full flex-col rounded-xl p-6 transition-shadow hover:shadow-md">
                <Quote className="h-8 w-8 text-primary/40" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
