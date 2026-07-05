"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ExternalLink,
  Layers,
  Palette,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HowItWorksSection from "./HowItWorksSection";
import HeroMockup from "./HeroMockup";
import ProductTourSection from "./ProductTourSection";
import SocialProofStrip from "./SocialProofStrip";
import TestimonialsSection from "./TestimonialsSection";
import { APP_NAME } from "@/lib/app-config";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { motion } from "motion/react";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import CountUp from "@/components/CountUp";
import SpotlightCard from "@/components/SpotlightCard";

const heroFade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const heroBtnClass =
  "h-11 rounded-lg px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:h-12 sm:px-8";

const brandSpotlight = "rgba(112, 71, 235, 0.1)" as const;
const brandIcon = "text-primary bg-primary/10";

const features = [
  {
    icon: Store,
    title: "Launch your storefront",
    description:
      "Publish a polished fashion storefront with your logo, colors, and collections — ready for customers in minutes.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: Layers,
    title: "Manage your catalog",
    description:
      "Organize products by category and collection. Add variants, sizes, colors, and rich product imagery.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: ShoppingBag,
    title: "Sell & checkout",
    description:
      "Cart, guest checkout, and order tracking built in. Customers shop smoothly; you stay in control.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: BarChart3,
    title: "Grow with analytics",
    description:
      "Track revenue, orders, and top products. See what's working and double down on your bestsellers.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: Tag,
    title: "Run promotions",
    description:
      "Create coupons and discounts to drive sales during launches, seasons, and special campaigns.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: Palette,
    title: "Make it yours",
    description:
      "Customize theme colors, typography, and branding so your store feels unmistakably on-brand.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
];

const stats = [
  { to: 5, suffix: " min", label: "Average time to launch your store", prefix: "" },
  { to: 50, suffix: "+", label: "Products on the free plan", prefix: "" },
  { to: 1, suffix: "", label: "Dashboard for your entire brand", prefix: "" },
  { to: 24, suffix: "/7", label: "Storefront always open for shoppers", prefix: "" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    desc: "Perfect for launching your first collection",
    features: [
      "1 brand store",
      "Up to 50 products",
      "Basic analytics",
      "Public storefront",
      "Guest checkout",
    ],
  },
  {
    name: "Growth",
    price: "$29",
    period: "/month",
    desc: "For brands ready to scale",
    features: [
      "Unlimited products",
      "Custom theme & branding",
      "Coupons & promotions",
      "Priority email support",
      "Advanced analytics",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    desc: "For agencies and multi-brand teams",
    features: [
      "Multiple brand stores",
      "Custom domains",
      "Dedicated onboarding",
      "API access",
      "Priority support",
    ],
  },
];

const faqs = [
  {
    q: "Do I need technical skills to use ModenixOS?",
    a: "No. ModenixOS is built for fashion founders, not developers. Create your brand, add products, customize your store, and start selling — all from an intuitive dashboard.",
  },
  {
    q: "How quickly can I launch my store?",
    a: "Most founders go from signup to a live storefront in under 10 minutes. Add your brand details, upload products, hit publish, and share your store link.",
  },
  {
    q: "Can customers buy without creating an account?",
    a: "Yes. Guest checkout lets shoppers purchase with just their name and email — fewer steps means more completed orders.",
  },
  {
    q: "What's included in the free plan?",
    a: "The Starter plan includes one store, up to 50 products, a public storefront, basic analytics, and guest checkout. No credit card required to start.",
  },
  {
    q: "Can I customize how my store looks?",
    a: "Absolutely. Upload your logo, set brand colors, choose typography, and organize products into collections so your storefront reflects your aesthetic.",
  },
];

export default function Homepage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="mkt-hero relative overflow-hidden border-b border-border pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="mkt-section grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <motion.div {...heroFade} transition={{ duration: 0.5 }}>
              <span className="mkt-badge mb-6 inline-flex">
                <Sparkles className="h-3.5 w-3.5" />
                The operating system for fashion brands
              </span>
            </motion.div>

            <motion.h1
              {...heroFade}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            >
              Launch your fashion brand online —{" "}
              <span className="homepage-gradient-text">without the complexity</span>
            </motion.h1>

            <motion.p
              {...heroFade}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0 md:text-lg"
            >
              {APP_NAME} gives you a beautiful storefront, order management, and growth
              analytics in one platform — so you can focus on designing, not configuring tools.
            </motion.p>

            <motion.div
              {...heroFade}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button asChild size="lg" className={`${heroBtnClass} gap-2 shadow-md`}>
                <Link href="/register">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={`${heroBtnClass} gap-2`}>
                <Link href="/store/luxe-threads" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View live demo
                </Link>
              </Button>
            </motion.div>

            <motion.p
              {...heroFade}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-5 text-sm text-muted-foreground"
            >
              No credit card required · Free plan available · Cancel anytime
            </motion.p>
          </div>

          <HeroMockup />
        </div>
      </section>

      <SocialProofStrip />

      {/* Stats */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="mkt-section">
          <AnimatedContent distance={50} duration={0.8}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <FadeContent key={stat.label} delay={i * 100} duration={700}>
                  <div className="mkt-stat-card rounded-xl p-6 text-center">
                    <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                      {stat.prefix}
                      <CountUp to={stat.to} duration={2} separator="," />
                      {stat.suffix}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </FadeContent>
              ))}
            </div>
          </AnimatedContent>
        </div>
      </section>

      <ProductTourSection />

      <HowItWorksSection />

      {/* Features */}
      <section id="features" className="scroll-mt-28 border-b border-border py-20 md:py-28">
        <div className="mkt-section">
          <AnimatedContent distance={50} duration={0.8}>
            <MarketingSectionHeader
              label="Platform"
              title="Everything to run a fashion brand"
              description="From your first product upload to your hundredth order — one platform handles it all."
            />
          </AnimatedContent>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <AnimatedContent key={f.title} distance={40} duration={0.7} delay={i * 0.08}>
                <SpotlightCard
                  spotlightColor={f.spotlight}
                  className="mkt-card !rounded-xl !p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </SpotlightCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-28 border-b border-border bg-muted/20 py-20 md:py-28">
        <div className="mkt-section max-w-5xl">
          <AnimatedContent distance={50} duration={0.8}>
            <MarketingSectionHeader
              label="Pricing"
              title="Plans that grow with your brand"
              description="Start free. Upgrade when you're ready to scale."
            />
          </AnimatedContent>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <AnimatedContent key={plan.name} distance={50} duration={0.75} delay={i * 0.1}>
                <div
                  className={`mkt-card relative flex h-full flex-col rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    plan.highlight ? "mkt-pricing-highlight ring-2 ring-primary/20" : ""
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <ul className="mt-6 flex-1 space-y-2.5 text-left text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-8 w-full rounded-lg"
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <Link href="/register">
                      {plan.name === "Scale" ? "Contact sales" : "Get started"}
                    </Link>
                  </Button>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-b border-border py-20 md:py-28">
        <div className="mkt-section max-w-3xl">
          <AnimatedContent distance={40} duration={0.8}>
            <MarketingSectionHeader title="Frequently asked questions" />
          </AnimatedContent>
          <div className="mt-12 space-y-4">
            {faqs.map((item, i) => (
              <FadeContent key={item.q} delay={i * 80} duration={600}>
                <div className="mkt-card rounded-xl p-6 transition-shadow hover:shadow-sm">
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkt-cta border-b border-border py-20 md:py-24">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="mkt-section max-w-3xl text-center">
            <p className="mkt-label mb-4">Ready to launch?</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
              Your fashion brand deserves a platform built for it
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join founders who launch faster with {APP_NAME}. Start free — no credit card required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className={`${heroBtnClass} gap-2 shadow-md`}>
                <Link href="/register">
                  Create your brand
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={`${heroBtnClass} gap-2`}>
                <Link href="/store/luxe-threads" target="_blank">
                  <Truck className="h-4 w-4" />
                  Explore demo store
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
