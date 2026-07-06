"use client";

import AnimatedContent from "@/components/AnimatedContent";
import { MarketingSectionHeader } from "../MarketingSectionHeader";
import { features } from "../landing-data";
import { FeatureCard } from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-28 border-b border-border/60 py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Platform"
            title="Everything your business needs to sell online"
            description="From catalog to checkout to analytics — one cohesive system, not a patchwork of tools."
          />
        </AnimatedContent>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <AnimatedContent key={feature.title} distance={40} duration={0.7} delay={i * 0.05}>
              <FeatureCard feature={feature} />
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
