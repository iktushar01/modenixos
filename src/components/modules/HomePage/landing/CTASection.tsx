"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/app-config";

const heroBtnClass =
  "h-11 rounded-xl px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:h-12 sm:px-8";

export default function CTASection() {
  return (
    <section className="mkt-cta border-b border-border/60 py-20 md:py-28">
      <AnimatedContent distance={50} duration={0.8}>
        <div className="mkt-section max-w-3xl text-center">
          <p className="mkt-label mb-4">Ready to grow?</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Everything you need to build, sell, and scale
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of businesses launching faster with {APP_NAME}. Start free — no credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className={`${heroBtnClass} gap-2 shadow-lg shadow-primary/15`}>
              <Link href="/register">
                Start building today
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={`${heroBtnClass} gap-2 homepage-glass`}>
              <Link href="/store/luxe-threads" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Explore live demo
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
