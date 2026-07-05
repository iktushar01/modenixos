"use client";

import { LayoutDashboard, Rocket, ShoppingCart, Store } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import SpotlightCard from "@/components/SpotlightCard";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const brandSpotlight = "rgba(112, 71, 235, 0.1)" as const;

const steps = [
  {
    icon: Rocket,
    title: "Launch your brand",
    description: "Register, verify email, and create your store with a unique slug in under 2 minutes.",
    iconColor: "text-[#7047EB]",
  },
  {
    icon: LayoutDashboard,
    title: "Manage from one dashboard",
    description: "Products, categories, collections, orders, customers, coupons, and analytics — all store-scoped.",
    iconColor: "text-[#7047EB]",
  },
  {
    icon: Store,
    title: "Publish your storefront",
    description: "Your live shop lives at /store/your-slug with theme colors, featured products, and collections.",
    iconColor: "text-[#7047EB]",
  },
  {
    icon: ShoppingCart,
    title: "Sell & fulfill orders",
    description: "Customers browse, add to cart, checkout as guests (COD). You update order status from the dashboard.",
    iconColor: "text-[#7047EB]",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b border-border py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Process"
            title="How it works"
            description="From signup to first sale — a complete fashion-brand operating system in four steps."
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
                className="mkt-card !p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-sm"
              >
                <FadeContent delay={index * 150} duration={600}>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-[#7047EB]/10">
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <p className="mkt-label mt-4">Step {index + 1}</p>
                  <h3 className="mt-2 font-semibold">{step.title}</h3>
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
