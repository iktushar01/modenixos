"use client";

import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import { MarketingSectionHeader } from "../MarketingSectionHeader";
import { faqs } from "../landing-data";

export default function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-28 border-b border-border/60 py-20 md:py-28">
      <div className="mkt-section max-w-3xl">
        <AnimatedContent distance={40} duration={0.8}>
          <MarketingSectionHeader title="Frequently asked questions" />
        </AnimatedContent>
        <div className="mt-12 space-y-4">
          {faqs.map((item, i) => (
            <FadeContent key={item.q} delay={i * 80} duration={600}>
              <details className="mkt-glass-card group rounded-2xl p-6 transition-shadow open:shadow-md">
                <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}
