"use client";

import { LayoutDashboard, Package, Rocket, Store } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import SpotlightCard from "@/components/SpotlightCard";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { howItWorksSteps } from "./landing-data";

const brandSpotlight = "rgba(112, 71, 235, 0.08)" as const;
const icons = [Rocket, Package, Store, LayoutDashboard];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b border-border/60 bg-muted/10 py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="How it works"
            title="From setup to first sale in four steps"
            description="No agencies, no code, no scattered tools. One platform built for operators who move fast."
          />
        </AnimatedContent>

        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step, index) => {
            const Icon = icons[index] ?? Rocket;
            return (
              <AnimatedContent
                key={step.title}
                distance={50}
                duration={0.75}
                delay={index * 0.1}
                threshold={0.15}
              >
                <SpotlightCard
                  spotlightColor={brandSpotlight}
                  className="mkt-glass-card relative !rounded-2xl !p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  <FadeContent delay={index * 150} duration={600}>
                    <div className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                      {index + 1}
                    </div>
                    <div className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" aria-hidden />
                    </div>
                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </FadeContent>
                </SpotlightCard>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
