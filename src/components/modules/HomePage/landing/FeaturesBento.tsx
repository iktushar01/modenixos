"use client";

import { motion } from "motion/react";
import { MiniChart } from "./HeroDashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { featuresBento, type FeatureBentoItem } from "../landing-data";

const variantClasses: Record<FeatureBentoItem["variant"], string> = {
  violet: "bg-violet-100/90 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  emerald: "bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  amber: "bg-amber-100/90 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  rose: "bg-rose-100/90 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  indigo: "bg-indigo-100/90 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  cyan: "bg-cyan-100/90 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

const spanClasses: Record<FeatureBentoItem["size"], string> = {
  default: "col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  large: "col-span-2 row-span-2",
};

function BentoPreview({ item }: { item: FeatureBentoItem }) {
  const variant = variantClasses[item.variant];

  switch (item.preview) {
    case "chart":
      return (
        <div className="pt-2">
          <div className="text-[10px] text-muted-foreground mb-2">{item.previewLabel}</div>
          <MiniChart heights={[40, 52, 44, 68, 58, 82, 70, 90]} accent={variant} />
        </div>
      );
    case "stat":
      return (
        <div className="pt-2">
          <div className="text-[10px] text-muted-foreground mb-1">{item.previewLabel}</div>
          <div className="text-sm font-semibold text-foreground">{item.previewValue}</div>
        </div>
      );
    case "list":
      return (
        <div className="pt-2 space-y-1.5">
          <div className="text-[10px] text-muted-foreground mb-1">{item.previewLabel}</div>
          <div className="flex flex-wrap gap-1.5">
            {["A", "B", "C"].map((label) => (
              <div
                key={label}
                className={cn(
                  "rounded-sm px-2 py-1 text-[10px] font-medium border border-border/60",
                  variant.replace("/90", "/20").replace("text-", "text-")
                )}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      );
    case "product":
      return (
        <div className="pt-2">
          <div className="aspect-[4/5] rounded-lg border border-border/50 bg-muted/40 mb-2" />
          <div className="text-[10px] text-muted-foreground">{item.previewLabel}</div>
          <div className="text-xs font-medium text-foreground">{item.previewValue}</div>
        </div>
      );
    case "badge":
      return (
        <div className="pt-2 flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground">{item.previewLabel}</div>
          <Badge variant="outline" className="text-[10px] px-2 py-1">
            {item.previewValue}
          </Badge>
        </div>
      );
    default:
      return null;
  }
}

export function FeatureBentoCard({ item }: { item: FeatureBentoItem }) {
  const Icon = item.icon;
  const variant = variantClasses[item.variant];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_12px_40px_oklch(0.50_0.22_285/0.08)]",
        spanClasses[item.size]
      )}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
      <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-110 {variant}">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <Card className="border-none bg-transparent p-0 shadow-none [&_*]:transition-none">
        <CardHeader className="pb-1">
          <CardTitle className="text-base sm:text-lg leading-tight">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <CardDescription className="text-sm leading-relaxed">{item.description}</CardDescription>
        </CardContent>
      </Card>
      <BentoPreview item={item} />
    </motion.div>
  );
}

export default function FeaturesBentoSection() {
  return (
    <section id="features" className="relative scroll-mt-28 border-b border-border/60 py-20 md:py-28 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" aria-hidden />

      <div className="mkt-section relative z-10 max-w-7xl">
        <div className="text-center mx-auto max-w-3xl mb-16">
          <p className="mkt-label mb-4">Platform capabilities</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.625rem]">
            Everything your business needs to sell online
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-muted-foreground md:text-base">
            From catalog to checkout to analytics — one cohesive system, not a patchwork of tools.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5 sm:gap-6 md:gap-8" style={{ gridTemplateRows: "repeat(5, minmax(0, auto))" }}>
          {featuresBento.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="min-h-[220px]"
            >
              <FeatureBentoCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}