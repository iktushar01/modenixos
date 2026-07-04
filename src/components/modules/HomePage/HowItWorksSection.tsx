"use client";

import { LayoutDashboard, Rocket, ShoppingCart, Store } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import SpotlightCard from "@/components/SpotlightCard";

const steps = [
  {
    icon: Rocket,
    title: "Launch your brand",
    description: "Register, verify email, and create your store with a unique slug in under 2 minutes.",
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-500",
    spotlight: "rgba(244, 63, 94, 0.1)" as const,
  },
  {
    icon: LayoutDashboard,
    title: "Manage from one dashboard",
    description: "Products, categories, collections, orders, customers, coupons, and analytics — all store-scoped.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-500",
    spotlight: "rgba(139, 92, 246, 0.1)" as const,
  },
  {
    icon: Store,
    title: "Publish your storefront",
    description: "Your live shop lives at /store/your-slug with theme colors, featured products, and collections.",
    color: "from-indigo-500/20 to-indigo-500/5",
    iconColor: "text-indigo-500",
    spotlight: "rgba(99, 102, 241, 0.1)" as const,
  },
  {
    icon: ShoppingCart,
    title: "Sell & fulfill orders",
    description: "Customers browse, add to cart, checkout as guests (COD). You update order status from the dashboard.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
    spotlight: "rgba(16, 185, 129, 0.1)" as const,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              How it <span className="homepage-gradient-text">works</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              From signup to first sale — a complete fashion-brand operating system in four steps.
            </p>
          </div>
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
                spotlightColor={step.spotlight}
                className="!border-border/50 !bg-card/70 !p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:!bg-card/30"
              >
                <FadeContent delay={index * 150} duration={600}>
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color}`}
                  >
                    <step.icon className={`h-7 w-7 ${step.iconColor}`} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {index + 1}
                  </p>
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
