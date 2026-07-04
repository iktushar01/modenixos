"use client";

import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedContent from "@/components/AnimatedContent";
import SpotlightCard from "@/components/SpotlightCard";
import { APP_NAME } from "@/lib/app-config";

const ownerSteps = [
  {
    step: "1",
    title: "Create an account",
    description: "Sign up as a brand owner and verify your email with the OTP sent to your inbox.",
    href: "/register",
    cta: "Sign up",
  },
  {
    step: "2",
    title: "Create your brand",
    description: "Complete onboarding with your brand name, slug, country, and currency.",
    href: "/onboarding",
    cta: "Onboarding",
  },
  {
    step: "3",
    title: "Add products & publish",
    description: "Create categories and products, then publish your store from Settings.",
    href: "/dashboard/products",
    cta: "Dashboard",
  },
  {
    step: "4",
    title: "Open your storefront",
    description: "Share your store URL and place a test order with guest checkout (COD).",
    href: "/store/luxe-threads",
    cta: "Demo store",
  },
];

export default function TryProjectSection() {
  return (
    <section
      id="try-project"
      className="scroll-mt-20 border-t border-border/60 bg-muted/20 py-20 md:py-28"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Live demo
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              See {APP_NAME} in action
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Jump into the pre-seeded demo — browse the storefront as a shopper or manage the brand
              from the dashboard.
            </p>
          </div>
        </AnimatedContent>

        <AnimatedContent distance={50} duration={0.8} delay={0.08}>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <CardTitle>Instant demo access</CardTitle>
                </div>
                <CardDescription>
                  Pre-seeded with 12 products, sample orders, and a live storefront at Luxe Threads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/40 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="mt-0.5 font-mono text-sm">demo@modenixos.com</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Password</p>
                    <p className="mt-0.5 font-mono text-sm">demo123456</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="flex-1 gap-2 rounded-xl">
                    <Link href="/store/luxe-threads" target="_blank">
                      <ExternalLink className="h-4 w-4" />
                      Open demo storefront
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1 gap-2 rounded-xl">
                    <Link href="/login">
                      <UserPlus className="h-4 w-4" />
                      Log in as demo owner
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedContent>

        <div className="mt-16">
          <AnimatedContent distance={40} duration={0.8}>
            <h3 className="text-center text-xl font-semibold">Full brand-owner journey</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Four steps from signup to your first sale.
            </p>
          </AnimatedContent>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ownerSteps.map((item, i) => (
              <AnimatedContent key={item.step} distance={40} duration={0.7} delay={i * 0.08}>
                <SpotlightCard
                  spotlightColor="rgba(244, 63, 94, 0.08)"
                  className="relative !border-border/60 !bg-card !p-0 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Card className="border-0 bg-transparent shadow-none">
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.step}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="pr-8 text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <Button asChild variant="link" className="h-auto gap-1 p-0">
                        <Link href={item.href}>
                          {item.cta}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
