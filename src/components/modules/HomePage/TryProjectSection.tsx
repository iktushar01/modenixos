"use client";

import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedContent from "@/components/AnimatedContent";
import SpotlightCard from "@/components/SpotlightCard";
import { APP_NAME, DEMO_STORE_PATH } from "@/lib/app-config";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const brandSpotlight = "rgba(112, 71, 235, 0.08)" as const;

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
    href: DEMO_STORE_PATH,
    cta: "Demo store",
  },
];

export default function TryProjectSection() {
  return (
    <section id="try-project" className="scroll-mt-28 border-b border-border bg-muted/20 py-20 md:py-28">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <MarketingSectionHeader
            label="Live demo"
            title={`See ${APP_NAME} in action`}
            description="Jump into the pre-seeded demo — browse the storefront as a shopper or manage the brand from the dashboard."
          />
        </AnimatedContent>

        <AnimatedContent distance={50} duration={0.8} delay={0.08}>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-md border border-border bg-card">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#7047EB]" />
                  <CardTitle>Instant demo access</CardTitle>
                </div>
                <CardDescription>
                  Pre-seeded with 12 products, sample orders, and a live storefront at Luxe Threads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 rounded-md border border-border bg-muted/40 p-4 sm:grid-cols-2">
                  <div>
                    <p className="mkt-label">Email</p>
                    <p className="mt-1 font-mono text-sm">demo@modenixos.com</p>
                  </div>
                  <div>
                    <p className="mkt-label">Password</p>
                    <p className="mt-1 font-mono text-sm">demo123456</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="flex-1 gap-2 rounded-md">
                    <Link href={DEMO_STORE_PATH} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                      Open demo storefront
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1 gap-2 rounded-md">
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
            <MarketingSectionHeader
              label="Journey"
              title="Full brand-owner journey"
              description="Four steps from signup to your first sale."
            />
          </AnimatedContent>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ownerSteps.map((item, i) => (
              <AnimatedContent key={item.step} distance={40} duration={0.7} delay={i * 0.08}>
                <SpotlightCard
                  spotlightColor={brandSpotlight}
                  className="relative mkt-card !p-0 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Card className="border-0 bg-transparent shadow-none">
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#7047EB]/10 text-sm font-semibold text-[#7047EB]">
                      {item.step}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="pr-8 text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <Button asChild variant="link" className="h-auto gap-1 p-0 text-[#7047EB]">
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
