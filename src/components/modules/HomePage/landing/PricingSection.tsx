"use client";

import { useState } from "react";
import AnimatedContent from "@/components/AnimatedContent";
import { MarketingSectionHeader } from "../MarketingSectionHeader";
import { pricingPlans } from "../landing-data";
import { PricingCard } from "./PricingCard";
import { cn } from "@/lib/utils";

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-28 border-b border-border/60 bg-muted/15 py-20 md:py-28">
      <div className="mkt-section max-w-5xl">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Pricing"
            title="Plans that scale with your business"
            description="Start free. Upgrade when you need more power. No surprises."
          />
        </AnimatedContent>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <span className="ml-1 text-xs opacity-80">-20%</span>
          </button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan, i) => (
            <AnimatedContent key={plan.name} distance={50} duration={0.75} delay={i * 0.1}>
              <PricingCard plan={plan} yearly={yearly} />
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
