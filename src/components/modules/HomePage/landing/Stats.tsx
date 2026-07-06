"use client";

import AnimatedContent from "@/components/AnimatedContent";
import FadeContent from "@/components/FadeContent";
import CountUp from "@/components/CountUp";
import { stats } from "../landing-data";

export default function Stats() {
  return (
    <section className="border-b border-border/60 py-16 md:py-20" aria-label="Platform statistics">
      <div className="mkt-section">
        <AnimatedContent distance={50} duration={0.8}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <FadeContent key={stat.label} delay={i * 100} duration={700}>
                <div className="mkt-glass-card mkt-stat-card rounded-2xl p-6 text-center">
                  <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                    {stat.prefix}
                    <CountUp to={stat.to} duration={2} separator="," />
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
  );
}
