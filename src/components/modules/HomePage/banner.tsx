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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HowItWorksSection from "./HowItWorksSection";
import TryProjectSection from "./TryProjectSection";
import { APP_NAME } from "@/lib/app-config";

const features = [
  {
    icon: Store,
    title: "Multi-tenant stores",
    description: "Each brand owner gets an isolated store. Every query is scoped by storeId.",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    icon: ShoppingBag,
    title: "Full commerce flow",
    description: "Storefront, cart, guest checkout, order management, coupons, and customers.",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: BarChart3,
    title: "Brand analytics",
    description: "Revenue, orders, top products, and customer insights from your dashboard.",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Layers,
    title: "Catalog management",
    description: "Categories, collections, products with images, sizes, colors, and SKU tracking.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Role-based access",
    description: "Store owners (CLIENT), platform admins (ADMIN/SUPER_ADMIN), and guest shoppers.",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Sparkles,
    title: "Store customization",
    description: "Logo, banner, theme colors, and publish toggle — applied live on your storefront.",
    color: "text-indigo-500 bg-indigo-500/10",
  },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="container relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center md:pt-28">
          <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
            <Sparkles className="h-3 w-3" />
            Fashion Brand SaaS · Multi-tenant
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            The operating system for{" "}
            <span className="bg-gradient-to-r from-rose-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              fashion brands
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {APP_NAME} lets entrepreneurs launch a fashion store, manage products and orders,
            and sell through a public storefront — all from one dashboard.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-8 gap-2">
              <Link href="/register">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-8 gap-2">
              <Link href="/store/luxe-threads" target="_blank">
                <ExternalLink className="h-4 w-4" />
                Try demo store
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 rounded-xl px-6">
              <a href="#try-project">Setup guide</a>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Demo login:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">demo@modenixos.com</code>
            {" / "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">demo123456</code>
          </p>
        </div>
      </section>

      <HowItWorksSection />

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-border/60 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to run a brand</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Built for portfolio demos and production-style multi-tenant architecture.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TryProjectSection />

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-t border-border/60 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
          <p className="mt-2 text-center text-muted-foreground">Start free. Upgrade when you scale.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", desc: "Perfect for trying ModenixOS", features: ["1 store", "Up to 50 products", "Basic analytics", "Public storefront"] },
              { name: "Pro", price: "$29/mo", desc: "For growing brands", features: ["Unlimited products", "Custom theme", "Coupons", "Priority support"], highlight: true },
              { name: "Enterprise", price: "Custom", desc: "For agencies & platforms", features: ["Multiple stores", "API access", "Custom domains", "Dedicated support"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 text-center ${plan.highlight ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border bg-card"}`}
              >
                {plan.highlight && <Badge className="mb-3">Popular</Badge>}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <p className="mt-4 text-4xl font-bold">{plan.price}</p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={plan.highlight ? "default" : "outline"}>
                  <Link href="/register">{plan.name === "Enterprise" ? "Contact us" : "Get started"}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-border/60 py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-bold">FAQ</h2>
          <div className="mt-10 space-y-4">
            {[
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
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60 bg-primary/5 py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to launch your fashion brand?</h2>
          <p className="mt-3 text-muted-foreground">
            Create an account or jump into the demo store — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/register">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
