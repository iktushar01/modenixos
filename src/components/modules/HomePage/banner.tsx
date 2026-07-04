"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  Layers,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HowItWorksSection from "./HowItWorksSection";
import TryProjectSection from "./TryProjectSection";
import { APP_NAME } from "@/lib/app-config";
import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import Magnet from "@/components/Magnet";
import CountUp from "@/components/CountUp";
import SpotlightCard from "@/components/SpotlightCard";
import ScrollVelocity from "@/components/ScrollVelocity";
import StarBorder from "@/components/StarBorder";

const features = [
  {
    icon: Store,
    title: "Multi-tenant stores",
    description: "Each brand owner gets an isolated store. Every query is scoped by storeId.",
    color: "text-rose-500 bg-rose-500/10",
    spotlight: "rgba(244, 63, 94, 0.12)" as const,
  },
  {
    icon: ShoppingBag,
    title: "Full commerce flow",
    description: "Storefront, cart, guest checkout, order management, coupons, and customers.",
    color: "text-violet-500 bg-violet-500/10",
    spotlight: "rgba(139, 92, 246, 0.12)" as const,
  },
  {
    icon: BarChart3,
    title: "Brand analytics",
    description: "Revenue, orders, top products, and customer insights from your dashboard.",
    color: "text-blue-500 bg-blue-500/10",
    spotlight: "rgba(59, 130, 246, 0.12)" as const,
  },
  {
    icon: Layers,
    title: "Catalog management",
    description: "Categories, collections, products with images, sizes, colors, and SKU tracking.",
    color: "text-amber-500 bg-amber-500/10",
    spotlight: "rgba(245, 158, 11, 0.12)" as const,
  },
  {
    icon: Shield,
    title: "Role-based access",
    description: "Store owners (CLIENT), platform admins (ADMIN/SUPER_ADMIN), and guest shoppers.",
    color: "text-emerald-500 bg-emerald-500/10",
    spotlight: "rgba(16, 185, 129, 0.12)" as const,
  },
  {
    icon: Sparkles,
    title: "Store customization",
    description: "Logo, banner, theme colors, and publish toggle — applied live on your storefront.",
    color: "text-indigo-500 bg-indigo-500/10",
    spotlight: "rgba(99, 102, 241, 0.12)" as const,
  },
];

const stats = [
  { to: 1, suffix: "", label: "Dashboard for everything", prefix: "All-in-" },
  { to: 12, suffix: "+", label: "Demo products seeded", prefix: "" },
  { to: 4, suffix: "", label: "Steps to first sale", prefix: "" },
  { to: 100, suffix: "%", label: "Store-scoped data", prefix: "" },
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
    q: "What's the fastest way to try it?",
    a: "Log in with demo@modenixos.com / demo123456, or open /store/luxe-threads directly to browse the seeded storefront.",
  },
  {
    q: "Do I need two repos running?",
    a: "Yes. modenixos-server (port 5000) and modenixos-client (port 3000). Run npm run seed:demo on the server for instant demo data.",
  },
  {
    q: "Can shoppers checkout without signing up?",
    a: "Yes. Guest checkout uses name + email. Cash on Delivery (COD) is enabled for the MVP.",
  },
  {
    q: "How is multi-tenancy enforced?",
    a: "Every business record has a storeId. Owner dashboard APIs use attachStoreId middleware so tenants never see each other's data.",
  },
];

export default function Homepage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 homepage-grid opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background/90 to-background" />
          <div className="absolute inset-x-0 top-0 h-[70vh] opacity-40 dark:opacity-55">
            <Aurora
              colorStops={["#f43f5e", "#8b5cf6", "#6366f1"]}
              amplitude={1.15}
              blend={0.55}
              speed={0.8}
            />
          </div>
        </div>

        <div className="container relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 pt-24 text-center md:pt-32">
          <AnimatedContent distance={40} duration={0.7} threshold={0.2}>
            <Badge
              variant="outline"
              className="homepage-glass mb-8 gap-2 px-4 py-1.5 text-sm shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 text-rose-500" />
              <ShinyText
                text="Fashion Brand SaaS · Multi-tenant"
                className="text-xs font-medium sm:text-sm"
                color="var(--muted-foreground)"
                shineColor="var(--foreground)"
                speed={2.5}
              />
            </Badge>
          </AnimatedContent>

          <SplitText
            tag="h1"
            text="The operating system for fashion brands"
            className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl homepage-gradient-text"
            splitType="words"
            delay={60}
            duration={0.9}
            from={{ opacity: 0, y: 48, rotateX: 12 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
            threshold={0.15}
            rootMargin="-80px"
          />

          <div className="mx-auto mt-8 max-w-2xl">
            <BlurText
              text={`${APP_NAME} lets entrepreneurs launch a fashion store, manage products and orders, and sell through a public storefront — all from one dashboard.`}
              className="justify-center text-lg leading-relaxed text-muted-foreground sm:text-xl"
              animateBy="words"
              delay={35}
              stepDuration={0.4}
            />
          </div>

          <AnimatedContent distance={50} duration={0.8} delay={0.15} threshold={0.2}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnet magnetStrength={3} padding={80}>
                <StarBorder
                  as="div"
                  color="#f43f5e"
                  speed="5s"
                  className="rounded-xl"
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-12 w-full rounded-xl border-0 bg-transparent px-8 shadow-none hover:bg-transparent sm:w-auto"
                  >
                    <Link href="/register" className="gap-2">
                      Start free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </StarBorder>
              </Magnet>

              <Magnet magnetStrength={2.5} padding={60}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="homepage-glass h-12 rounded-xl px-8 gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <Link href="/store/luxe-threads" target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    Try demo store
                  </Link>
                </Button>
              </Magnet>

              <Magnet magnetStrength={2} padding={50}>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-12 rounded-xl px-6 transition-colors duration-300"
                >
                  <a href="#try-project">Setup guide</a>
                </Button>
              </Magnet>
            </div>
          </AnimatedContent>

          <FadeContent blur duration={900} delay={300} threshold={0.2}>
            <p className="mt-8 text-sm text-muted-foreground">
              Demo login:{" "}
              <code className="rounded-md bg-muted/80 px-2 py-0.5 text-xs font-mono">
                demo@modenixos.com
              </code>
              {" / "}
              <code className="rounded-md bg-muted/80 px-2 py-0.5 text-xs font-mono">
                demo123456
              </code>
            </p>
          </FadeContent>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1">
            <div className="mx-auto h-2 w-1 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Velocity marquee */}
      <div className="border-y border-border/40 bg-muted/20 py-2">
        <ScrollVelocity
          texts={[
            "Multi-tenant",
            "Fashion SaaS",
            "Live Storefront",
            "Guest Checkout",
            "Analytics",
            "Coupons & Orders",
          ]}
          velocity={40}
          className="homepage-gradient-text opacity-80"
          parallaxClassName="py-3"
          scrollerClassName="text-2xl font-bold tracking-tight md:text-4xl"
          numCopies={8}
        />
      </div>

      {/* Stats */}
      <section className="relative py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <AnimatedContent distance={60} duration={0.8}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <FadeContent key={stat.label} delay={i * 120} duration={800} blur>
                  <div className="homepage-glass group rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-3xl font-bold tracking-tight md:text-4xl">
                      {stat.prefix}
                      <CountUp to={stat.to} duration={2.2} separator="," />
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

      <HowItWorksSection />

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <AnimatedContent distance={50} duration={0.8}>
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Platform capabilities
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to{" "}
                <span className="homepage-gradient-text">run a brand</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Built for portfolio demos and production-style multi-tenant architecture.
              </p>
            </div>
          </AnimatedContent>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <AnimatedContent key={f.title} distance={40} duration={0.7} delay={i * 0.08}>
                <SpotlightCard
                  spotlightColor={f.spotlight}
                  className="!border-border/60 !bg-card/80 !p-6 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:!bg-card/40"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
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

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4">
          <AnimatedContent distance={50} duration={0.8}>
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Simple pricing</h2>
              <p className="mt-3 text-muted-foreground">Start free. Upgrade when you scale.</p>
            </div>
          </AnimatedContent>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <AnimatedContent key={plan.name} distance={50} duration={0.75} delay={i * 0.1}>
                <SpotlightCard
                  spotlightColor={
                    plan.highlight ? "rgba(139, 92, 246, 0.18)" : "rgba(255, 255, 255, 0.08)"
                  }
                  className={`!p-6 text-center transition-all duration-500 hover:-translate-y-1 ${
                    plan.highlight
                      ? "!border-violet-500/40 !bg-violet-500/5 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20"
                      : "!border-border/60 !bg-card/80 dark:!bg-card/40"
                  }`}
                >
                  {plan.highlight && (
                    <Badge className="mb-3 bg-gradient-to-r from-rose-500 to-violet-500">
                      Popular
                    </Badge>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                  <p className="mt-5 text-4xl font-bold tracking-tight">{plan.price}</p>
                  <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <Magnet magnetStrength={2} padding={40} className="mt-8">
                    <Button
                      asChild
                      className="w-full transition-transform duration-300"
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      <Link href="/register">
                        {plan.name === "Enterprise" ? "Contact us" : "Get started"}
                      </Link>
                    </Button>
                  </Magnet>
                </SpotlightCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4">
          <AnimatedContent distance={40} duration={0.8}>
            <h2 className="text-center text-3xl font-bold sm:text-4xl">FAQ</h2>
          </AnimatedContent>
          <div className="mt-12 space-y-4">
            {faqs.map((item, i) => (
              <FadeContent key={item.q} delay={i * 100} duration={700} blur>
                <div className="homepage-glass rounded-2xl p-6 transition-all duration-300 hover:shadow-md">
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border/60 py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-indigo-500/10" />
        <div className="pointer-events-none absolute inset-0 homepage-grid opacity-30" />
        <AnimatedContent distance={60} duration={0.9}>
          <div className="container relative mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to launch your{" "}
              <span className="homepage-gradient-text">fashion brand</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create an account or jump into the demo store — no credit card required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnet magnetStrength={3} padding={70}>
                <Button asChild size="lg" className="h-12 gap-2 rounded-xl px-8 shadow-lg">
                  <Link href="/register">
                    Create free account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnet>
              <Magnet magnetStrength={2} padding={50}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="homepage-glass h-12 rounded-xl px-8"
                >
                  <Link href="/login">Log in</Link>
                </Button>
              </Magnet>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
