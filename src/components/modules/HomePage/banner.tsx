"use client";

import { useState } from "react";
import { ArrowRight, LayoutDashboard, Shield, Users, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function Homepage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle Top Border Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Main Hero Section */}
      <section className="container mx-auto max-w-6xl px-4 pt-24 pb-16 text-center md:pt-32 md:pb-24">
        {/* Tech Stack Pills */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <span className="font-semibold text-foreground">Next.js 15</span>
          <span className="text-border">•</span>
          <span>Better Auth</span>
          <span className="text-border">•</span>
          <span>Shadcn UI</span>
          <span className="text-border">•</span>
          <span>Tailwind v4</span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight">
          The Operating System for Fashion Brands
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto sm:text-xl leading-relaxed">
          Launch, manage, and scale your fashion brand from one dashboard. Multi-tenant SaaS built for entrepreneurs.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row items-center">
          <Link href="/dashboard" passHref className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 rounded-xl px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-2 shadow-sm">
              <LayoutDashboard className="size-4" />
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/login" passHref className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 rounded-xl px-6 font-semibold border-border bg-background hover:bg-muted transition-all gap-2">
              Sign In
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto h-12 rounded-xl px-5 text-muted-foreground hover:text-foreground transition-all gap-2"
            onClick={() => setIsDemoOpen(true)}
          >
            <Play className="size-4 fill-current" />
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Clean Feature Grid Section */}
      <section className="container mx-auto max-w-5xl px-4 py-12 border-t border-border/60">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Shield className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-base">Multi-Tenant Stores</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Each brand owner gets an isolated store with products, orders, and analytics scoped by storeId.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Users className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-base">Full Commerce Flow</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Public storefront, cart, checkout, order management, coupons, and customer tracking built in.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/30 sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Zap className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-base">Brand Dashboard</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Products, categories, collections, analytics, and store customization from one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto max-w-5xl px-4 py-16 border-t border-border/60">
        <h2 className="text-center text-3xl font-bold">Simple Pricing</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { name: "Free", price: "$0", features: ["1 store", "Up to 50 products", "Basic analytics"] },
            { name: "Pro", price: "$29/mo", features: ["Unlimited products", "Custom theme", "Priority support"] },
            { name: "Enterprise", price: "Custom", features: ["Multiple stores", "API access", "Dedicated support"] },
          ].map((plan) => (
            <div key={plan.name} className="rounded-2xl border border-border bg-card p-6 text-center">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto max-w-3xl px-4 py-16 border-t border-border/60">
        <h2 className="text-center text-3xl font-bold">FAQ</h2>
        <div className="mt-8 space-y-6">
          {[
            { q: "How do I create a fashion brand?", a: "Sign up, verify your email, and complete the brand onboarding form." },
            { q: "Can customers checkout without an account?", a: "Yes. Storefront checkout works with guest name and email (COD for MVP)." },
            { q: "Is my store data isolated?", a: "Yes. Every query is scoped by your storeId for multi-tenant security." },
          ].map((item) => (
            <div key={item.q} className="rounded-lg border p-4">
              <h3 className="font-semibold">{item.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-lg">
          <DialogTitle className="text-lg font-bold">Starter Kit Overview</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Explore how the folder architecture splits layouts dynamically between Admin routes and User sessions.
          </DialogDescription>
          
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-black aspect-video w-full">
            {isDemoOpen && (
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/3BApolGeKAs?autoplay=1&rel=0"
                title="Starter Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}