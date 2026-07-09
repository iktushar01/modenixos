"use client";

import { LayoutDashboard, Package, Rocket, Store, ArrowRight } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import SpotlightCard from "@/components/SpotlightCard";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { howItWorksSteps } from "./landing-data";

const brandSpotlight = "rgba(112, 71, 235, 0.12)" as const;
const icons = [Rocket, Package, Store, LayoutDashboard];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative scroll-mt-28 overflow-hidden border-b border-border/60 bg-muted/5 py-20 md:py-32">
      {/* Decorative Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" aria-hidden="true" />
      
      <div className="mkt-section relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedContent distance={40} duration={0.8}>
          <MarketingSectionHeader
            label="How it works"
            title="From setup to first sale in four steps"
            description="No agencies, no code, no scattered tools. One platform built for operators who move fast."
          />
        </AnimatedContent>

        {/* Steps Grid Container */}
        <div className="relative mt-20">
          
          {/* Desktop Connecting SVG Progress Line */}
          <div className="absolute top-24 left-[12.5%] right-[12.5%] hidden h-[2px] bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 lg:block" aria-hidden="true">
            <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((step, index) => {
              const Icon = icons[index] ?? Rocket;
              const isLast = index === howItWorksSteps.length - 1;

              return (
                <AnimatedContent
                  key={step.title}
                  distance={30}
                  duration={0.8}
                  delay={index * 0.12}
                  threshold={0.1}
                >
                  <SpotlightCard
                    spotlightColor={brandSpotlight}
                    className="group mkt-glass-card relative flex h-full flex-col justify-between !rounded-2xl border border-border/50 bg-background/50 !p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:bg-background/80 hover:shadow-2xl hover:shadow-primary/5"
                  >
                    <FadeContent delay={index * 100} duration={500}>
                      
                      {/* Top Row: Icon and Large Subtle Number Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                          <Icon className="h-5 w-5 text-primary transition-colors duration-300" aria-hidden />
                        </div>
                        <span className="text-4xl font-black tracking-tighter text-muted-foreground/10 select-none transition-colors duration-500 group-hover:text-primary/10">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Text Content content */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/90">
                          {step.description}
                        </p>
                      </div>

                      {/* Bottom decorative interaction line/arrow */}
                      <div className="mt-6 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
                        <span>{isLast ? "Launch live" : "Next step"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>

                    </FadeContent>
                  </SpotlightCard>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}