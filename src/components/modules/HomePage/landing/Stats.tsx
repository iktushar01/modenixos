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
                <div className="mkt-glass-card mkt-stat-card group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                  {/* ambient glow on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120px_circle_at_50%_0%,hsl(var(--primary)/0.14),transparent_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* top accent line, unfurls on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />

                  <p className="text-3xl font-semibold tracking-tight text-primary transition-transform duration-300 group-hover:scale-[1.04] md:text-4xl">
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