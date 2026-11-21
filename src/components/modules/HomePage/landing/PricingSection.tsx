"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import AnimatedContent from "@/components/AnimatedContent";
import { MarketingSectionHeader } from "../MarketingSectionHeader";
import { pricingPlans } from "../landing-data";
import { PricingCard } from "./PricingCard";

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section id="pricing" className="scroll-mt-28 border-b border-border/60 bg-muted/10 py-20 md:py-28">
      <div className="mkt-section max-w-5xl">
        <div className="text-center mb-14">
          <p className="mkt-label mb-4">Pricing</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.625rem]">
            Plans that scale with your business
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-muted-foreground md:text-base">
            Start free. Upgrade when you need more power. No surprises.
          </p>
        </div>

        {/* Billing toggle */}
        <motion.div
          {...(reduceMotion ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } })}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4"
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm">
            <span className="text-xs font-medium text-muted-foreground">Monthly</span>
            <Switch
              checked={yearly}
              onCheckedChange={setYearly}
              className="ml-2"
              aria-label="Switch to yearly billing"
            />
            <span className="text-xs font-medium text-muted-foreground">Yearly</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Save ~20% with annual billing
          </p>
        </motion.div>

        <Separator className="my-12" />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan, i) => (
            <AnimatedContent key={plan.name} distance={50} duration={0.75} delay={i * 0.1}>
              <PricingCard plan={plan} yearly={yearly} />
            </AnimatedContent>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          All plans include a public storefront and guest checkout. Upgrades take effect immediately.
        </p>
      </div>
    </section>
  );
}
