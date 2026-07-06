"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/app-config";
import { industries } from "../landing-data";
import HeroDashboard from "./HeroDashboard";
import { StartFreeLink } from "../StartFreeLink";
import { cn } from "@/lib/utils";

const heroBtnClass =
  "h-11 rounded-xl px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:h-12 sm:px-8";

export default function Hero() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0]!);
  const reduceMotion = useReducedMotion();

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="mkt-hero relative overflow-hidden border-b border-border/60 pb-20 pt-14 md:pb-28 md:pt-20">
      <div className="homepage-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="mkt-section relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <motion.div {...fade} transition={{ duration: 0.5 }}>
            <span className="mkt-badge mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              The operating system for modern commerce
            </span>
          </motion.div>

          <motion.h1
            {...fade}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
          >
            One platform to power your{" "}
            <span className="homepage-gradient-text">entire commerce operation</span>
          </motion.h1>

          <motion.p
            {...fade}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0 md:text-lg"
          >
            {APP_NAME} unifies your storefront, products, inventory, customers, orders, analytics,
            and marketing — so you can build, sell, and scale from one dashboard.
          </motion.p>

          <motion.div
            {...fade}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button asChild size="lg" className={`${heroBtnClass} gap-2 shadow-lg shadow-primary/15`}>
              <StartFreeLink>
                Start free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </StartFreeLink>
            </Button>
            <Button asChild size="lg" variant="outline" className={`${heroBtnClass} gap-2 homepage-glass`}>
              <Link href="/store/luxe-threads" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Live demo
              </Link>
            </Button>
          </motion.div>

          <motion.p
            {...fade}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-5 text-sm text-muted-foreground"
          >
            No credit card required · Free plan available · Cancel anytime
          </motion.p>

          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start"
            role="tablist"
            aria-label="Preview industry"
          >
            {industries.map((ind) => (
              <button
                key={ind.id}
                type="button"
                role="tab"
                aria-selected={activeIndustry.id === ind.id}
                onClick={() => setActiveIndustry(ind)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                  activeIndustry.id === ind.id
                    ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                    : "border-border/60 bg-background/50 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {ind.label}
              </button>
            ))}
          </motion.div>
        </div>

        <div role="tabpanel" aria-label={`${activeIndustry.label} dashboard preview`}>
          <HeroDashboard industry={activeIndustry} />
        </div>
      </div>
    </section>
  );
}
