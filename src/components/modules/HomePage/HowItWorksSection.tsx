"use client";

import { LayoutDashboard, Palette, Rocket, ShoppingCart } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import SpotlightCard from "@/components/SpotlightCard";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const brandSpotlight = "rgba(112, 71, 235, 0.1)" as const;

const steps = [
  {
    icon: Rocket,
    title: "Create your brand",
    description:
      "Sign up, add your brand name and logo, and choose your currency. Your store is ready to customize.",
    iconColor: "text-primary",
  },
  {
    icon: Palette,
    title: "Build your catalog",
    description:
      "Add products with photos, variants, and collections. Set your theme colors to match your aesthetic.",
    iconColor: "text-primary",
  },
  {
    icon: LayoutDashboard,
    title: "Publish & share",
    description:
      "Hit publish and share your store link. Your storefront goes live instantly for customers worldwide.",
    iconColor: "text-primary",
  },
  {
    icon: ShoppingCart,
    title: "Sell & grow",
    description:
      "Receive orders, manage fulfillment, and track revenue. Use analytics to see what's driving growth.",
    iconColor: "text-primary",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b border-border bg-muted/20 py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="How it works"
            title="From idea to first sale in four steps"
            description="No agencies, no code, no scattered tools. Just one platform built for fashion founders."
          />
        </AnimatedContent>

        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <AnimatedContent
              key={step.title}
              distance={50}
              duration={0.75}
              delay={index * 0.1}
              threshold={0.15}
            >
              <SpotlightCard
                spotlightColor={brandSpotlight}
                className="mkt-card relative !rounded-xl !p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
              >
                <FadeContent delay={index * 150} duration={600}>
                  <div className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </FadeContent>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
