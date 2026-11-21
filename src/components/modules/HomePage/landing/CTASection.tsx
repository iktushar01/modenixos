"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { APP_NAME, DEMO_STORE_PATH } from "@/lib/app-config";
import { StartFreeLink } from "../StartFreeLink";

const heroBtnClass =
  "h-11 rounded-xl px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:h-12 sm:px-8";

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="relative overflow-hidden border-b border-border/60 py-20 md:py-28">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]" aria-hidden />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_50%_40%_at_100%_0%,color-mix(in_oklch,var(--admin-accent)_8%,transparent),transparent)]" aria-hidden />

      <AnimatedContent distance={50} duration={0.8}>
        <div className="mkt-section max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            <p className="text-[10px] font-semibold tracking-wider text-primary uppercase">Ready to launch?</p>
          </div>
          <motion.h2
            {...fade}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.625rem]"
          >
            Everything you need to build, sell, and scale.
          </motion.h2>
          <motion.p
            {...fade}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            Join businesses launching faster with {APP_NAME}. Start free — no credit card required.
          </motion.p>
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
        </div>
      </AnimatedContent>
    </section>
  );
}
