"use client";

import { ArrowRight, LayoutDashboard, Package, Rocket, Store } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { MarketingSectionHeader } from "./MarketingSectionHeader";
import { howItWorksSteps } from "./landing-data";
import { cn } from "@/lib/utils";

const icons = [Rocket, Package, Store, LayoutDashboard];

export default function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative scroll-mt-28 overflow-hidden border-b border-border/60 py-20 md:py-32">
      {/* Decorative ambient glows */}
      <div className="absolute top-[-8%] left-[-12%] h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[140px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-[-8%] right-[-12%] h-[600px] w-[600px] rounded-full bg-amber-500/8 blur-[140px] pointer-events-none" aria-hidden />

      <div className="mkt-section relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="mkt-label mb-4">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.625rem]">
            From setup to first sale in four steps
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-muted-foreground md:text-base">
            No agencies, no code, no scattered tools. One platform built for operators who move fast.
          </p>
        </div>

        {/* Connected timeline — top connector with numbered circles */}
        <div className="relative flex items-center justify-between mb-16 lg:mb-20">
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] z-0"
            aria-hidden
          >
            <div className="h-full w-full bg-gradient-to-r from-primary/25 via-primary/60 to-primary/25" />
          </div>
          {/* Traveling playhead */}
          {!reduceMotion && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-[2px] w-[16%] bg-primary z-20 rounded-full"
              animate={{ x: [-40, 110] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
                delay: 1,
              }}
              style={{ transformOrigin: "left" }}
              aria-hidden
            />
          )}
          {howItWorksSteps.map((_, index) => (
            <motion.div
              key={index}
              whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25"
            >
              0{index + 1}
            </motion.div>
          ))}
        </div>

        {/* Step cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step, index) => {
            const Icon = icons[index] ?? Rocket;
            const isLast = index === howItWorksSteps.length - 1;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={cn(
                  "mkt-glass-card group relative flex h-full flex-col justify-between rounded-2xl p-6 sm:p-8",
                  index % 2 === 0 ? "bg-background/40" : "bg-card/70"
                )}
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-muted-foreground/90 transition-colors">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-1 text-xs font-medium text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                  <span>{isLast ? "Launch live" : "Next step"}</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}