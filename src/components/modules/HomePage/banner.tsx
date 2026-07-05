"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HowItWorksSection from "./HowItWorksSection";
import TryProjectSection from "./TryProjectSection";
import HeroMockup from "./HeroMockup";
import ProductTourSection from "./ProductTourSection";
import TechStackStrip from "./TechStackStrip";
import DeveloperSection from "./DeveloperSection";
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
  "h-11 rounded-md px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:h-12 sm:px-8";

const brandSpotlight = "rgba(112, 71, 235, 0.1)" as const;
const brandIcon = "text-[#7047EB] bg-[#7047EB]/10";

const features = [
  {
    icon: Store,
    title: "Multi-tenant stores",
    description: "Each brand gets an isolated store. Every API query is scoped by storeId.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: ShoppingBag,
    title: "Full commerce flow",
    description: "Storefront, cart, guest checkout, orders, coupons, and customer management.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: BarChart3,
    title: "Brand analytics",
    description: "Track revenue, orders, top products, and customer insights in real time.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: Layers,
    title: "Catalog management",
    description: "Categories, collections, products with images, variants, and SKU tracking.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: Shield,
    title: "Role-based access",
    description: "Store owners, platform admins, and guest shoppers — each with the right permissions.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
  {
    icon: Sparkles,
    title: "Live customization",
    description: "Logo, banner, theme colors, and publish toggle applied instantly on your storefront.",
    color: brandIcon,
    spotlight: brandSpotlight,
  },
];

const stats = [
  { to: 12, suffix: "+", label: "Demo products ready to browse", prefix: "" },
  { to: 4, suffix: "", label: "Steps from signup to first sale", prefix: "" },
  { to: 100, suffix: "%", label: "Tenant data isolation", prefix: "" },
  { to: 3, suffix: "", label: "Surfaces — store, dashboard, admin", prefix: "" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for trying ModenixOS",
    features: ["1 store", "Up to 50 products", "Basic analytics", "Public storefront"],
  },
  {
    name: "Pro",
    price: "$29/mo",
    desc: "For growing brands",
    features: ["Unlimited products", "Custom theme", "Coupons", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For agencies & platforms",
    features: ["Multiple stores", "API access", "Custom domains", "Dedicated support"],
  },
];

const faqs = [
  {
    q: "How fast can I try it?",
    a: "Open the demo storefront at /store/luxe-threads instantly, or log in with demo@modenixos.com / demo123456 to explore the owner dashboard.",
  },
  {
    q: "What can store owners do?",
    a: "Manage products, categories, collections, orders, customers, coupons, and analytics — all from a single store-scoped dashboard.",
  },
  {
    q: "Can customers checkout without an account?",
    a: "Yes. Guest checkout uses name and email. Cash on Delivery (COD) is enabled for the MVP.",
  },
  {
    q: "How is multi-tenancy enforced?",
    a: "Every business record has a storeId. Owner APIs use attachStoreId middleware so tenants never see each other's data.",
  },
  {
    q: "How do I run it locally?",
    a: "Clone modenixos-server and modenixos-client, run migrations, optionally seed demo data, and start both apps on ports 5000 and 3000. See the Developers section below.",
  },
];

export default function Homepage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <section className="relative overflow-hidden border-b border-border pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mkt-section grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <motion.div {...heroFade} transition={{ duration: 0.5 }}>
              <p className="mkt-label mb-6">Fashion Brand SaaS · Multi-tenant</p>
            </motion.div>

            <motion.h1
              {...heroFade}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Launch your fashion brand online —{" "}
              <span className="homepage-gradient-text">in one dashboard</span>
            </motion.h1>

            <motion.p
              {...heroFade}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0 md:text-lg"
            >
              {APP_NAME} gives brand owners a live storefront, order management, and analytics on a
              secure multi-tenant platform — no separate tools required.
            </motion.p>

            <motion.div
              {...heroFade}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button asChild size="lg" className={`${heroBtnClass} gap-2`}>
                <Link href="/store/luxe-threads" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Try demo store
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={`${heroBtnClass} gap-2`}>
                <Link href="/login">
                  <LayoutDashboard className="h-4 w-4" />
                  Explore dashboard
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className={`${heroBtnClass} px-5`}>
                <Link href="/register">Start free</Link>
              </Button>
            </motion.div>

            <motion.div
              {...heroFade}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 inline-flex flex-col items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-3 text-left sm:flex-row sm:items-center lg:inline-flex"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Demo credentials
              </span>
              <code className="rounded-md bg-background px-2 py-0.5 text-xs font-mono">
                demo@modenixos.com
              </code>
              <span className="hidden text-muted-foreground sm:inline">/</span>
              <code className="rounded-md bg-background px-2 py-0.5 text-xs font-mono">
                demo123456
              </code>
            </motion.div>
          </div>

          <HeroMockup />
        </div>
      </section>

      <TechStackStrip />

      <section className="border-b border-border py-16 md:py-20">
        <div className="mkt-section">
          <AnimatedContent distance={50} duration={0.8}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <FadeContent key={stat.label} delay={i * 100} duration={700}>
                  <div className="mkt-card rounded-md p-6 text-center transition-shadow hover:shadow-sm">
                    <p className="text-3xl font-semibold tracking-tight md:text-4xl">
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

      <section id="features" className="scroll-mt-28 border-b border-border py-20 md:py-28">
        <div className="mkt-section">
          <AnimatedContent distance={50} duration={0.8}>
            <MarketingSectionHeader
              label="Platform capabilities"
              title="Everything to run a fashion brand"
              description="From catalog to checkout to analytics — built for real multi-tenant SaaS architecture."
            />
          </AnimatedContent>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <AnimatedContent key={f.title} distance={40} duration={0.7} delay={i * 0.08}>
                <SpotlightCard
                  spotlightColor={f.spotlight}
                  className="mkt-card !p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-md ${f.color}`}>
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

      <TryProjectSection />

      <section id="pricing" className="scroll-mt-28 border-b border-border py-20 md:py-28">
        <div className="mkt-section max-w-5xl">
          <AnimatedContent distance={50} duration={0.8}>
            <MarketingSectionHeader
              label="Pricing"
              title="Simple pricing"
              description="Start free. Upgrade when you scale."
            />
          </AnimatedContent>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <AnimatedContent key={plan.name} distance={50} duration={0.75} delay={i * 0.1}>
                <div
                  className={`mkt-card rounded-md p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${
                    plan.highlight ? "ring-1 ring-[#7047EB]/30" : ""
                  }`}
                >
                  {plan.highlight && (
                    <p className="mkt-label mb-3 text-[#7047EB]">Popular</p>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                  <p className="mt-5 text-4xl font-semibold tracking-tight">{plan.price}</p>
                  <ul className="mt-6 space-y-2.5 text-left text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-[#7047EB]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-8 w-full rounded-md"
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <Link href="/register">
                      {plan.name === "Enterprise" ? "Contact us" : "Get started"}
                    </Link>
                  </Button>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 border-b border-border py-20 md:py-28">
        <div className="mkt-section max-w-3xl">
          <AnimatedContent distance={40} duration={0.8}>
            <MarketingSectionHeader title="Frequently asked questions" />
          </AnimatedContent>
          <div className="mt-12 space-y-4">
            {faqs.map((item, i) => (
              <FadeContent key={item.q} delay={i * 80} duration={600}>
                <div className="mkt-card rounded-md p-6 transition-shadow hover:shadow-sm">
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      <DeveloperSection />

      <section className="border-b border-border bg-muted/20 py-20 md:py-24">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="mkt-section max-w-3xl text-center">
            <p className="mkt-label mb-4">Get started</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
              See {APP_NAME} in action today
            </h2>
            <p className="mt-4 text-muted-foreground">
              Browse the live demo store or log in to the owner dashboard — no credit card required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className={`${heroBtnClass} gap-2`}>
                <Link href="/store/luxe-threads" target="_blank">
                  Open demo store
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={heroBtnClass}>
                <Link href="/login">Log in to dashboard</Link>
              </Button>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
