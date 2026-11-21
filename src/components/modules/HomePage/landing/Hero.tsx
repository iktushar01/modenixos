"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { APP_NAME, DEMO_STORE_PATH } from "@/lib/app-config";
import { industries } from "../landing-data";
import HeroDashboard from "./HeroDashboard";
import { StartFreeLink } from "../StartFreeLink";

const heroBtnClass =
  "h-11 rounded-xl px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:h-12 sm:px-8";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  const floatUp = reduceMotion
    ? {}
    : {
        initial: { y: 0 },
        animate: { y: [0, -8, 0] },
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <section className="mkt-hero relative overflow-hidden border-b border-border/60 pb-32 pt-20 md:pb-40 md:pt-28">
      <div className="homepage-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="mkt-section relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="text-center lg:text-left">
          <motion.div {...fade} transition={{ duration: 0.5 }}>
            <span className="mkt-badge inline-flex mb-6">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              The operating system for modern commerce
            </span>
          </motion.div>

          <motion.h1
            {...fade}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[4rem] lg:leading-[1.04]"
          >
            The operating system for{" "}
            <span className="homepage-gradient-text">modern commerce</span>
          </motion.h1>

          <motion.p
            {...fade}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0 lg:text-xl"
          >
            One platform to power your entire commerce operation.
          </motion.p>

          <motion.p
            {...fade}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg"
          >
            {APP_NAME} unifies your storefront, products, inventory, customers, orders, analytics,
            and marketing — so you can build, sell, and scale from one dashboard.
          </motion.p>

          <motion.div
            {...fade}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start"
          >
            <Button asChild size="lg" className={`${heroBtnClass} gap-2 shadow-lg shadow-primary/15`}>
              <StartFreeLink>
                Start free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </StartFreeLink>
            </Button>
            <Button asChild size="lg" variant="outline" className={`${heroBtnClass} gap-2 homepage-glass`}>
              <Link href={DEMO_STORE_PATH} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Explore live demo
              </Link>
            </Button>
          </motion.div>

          <motion.p
            {...fade}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-sm text-muted-foreground tracking-tight"
          >
            No credit card required · Free plan available · Cancel anytime
          </motion.p>

          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="mt-10 flex flex-wrap justify-center gap-2.5 lg:justify-start"
            role="tablist"
            aria-label="Preview industry"
          >
            {industries.map((ind) => (
              <button
                key={ind.id}
                type="button"
                role="tab"
                aria-selected={true}
                className="rounded-full border border-border/60 bg-background/80 text-xs font-medium px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {ind.label}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="relative hidden lg:block" aria-label="Dashboard preview">
          <HeroDashboard industry={industries[0]!} />
        </div>

        <motion.div
          {...floatUp}
          className="absolute -top-6 -right-10 hidden rounded-2xl border border-border/60 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-md lg:block w-64"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Live activity</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              <span className="text-muted-foreground">New order received</span>
              <span className="ml-auto text-primary font-medium">Silk Blazer · $189</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" aria-hidden />
              <span className="text-muted-foreground">Revenue increased</span>
              <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-medium">+18% this week</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden />
              <span className="text-muted-foreground">Store is live</span>
              <span className="ml-auto text-muted-foreground font-medium">Luxe Threads</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" aria-hidden />
              <span className="text-muted-foreground">New customer registered</span>
              <span className="ml-auto text-muted-foreground font-medium">just now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
