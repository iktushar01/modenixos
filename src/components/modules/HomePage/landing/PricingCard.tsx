import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "../landing-data";
import { StartFreeLink } from "../StartFreeLink";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  plan: PricingPlan;
  yearly: boolean;
};

export function PricingCard({ plan, yearly }: PricingCardProps) {
  const price =
    plan.monthlyPrice === null
      ? "Custom"
      : plan.monthlyPrice === 0
        ? "$0"
        : yearly
          ? `$${Math.round(plan.monthlyPrice * 12 * 0.8)}`
          : `$${plan.monthlyPrice}`;

  const period =
    plan.monthlyPrice === null
      ? ""
      : plan.monthlyPrice === 0
        ? "forever"
        : yearly
          ? "/year"
          : "/month";

  const isFree = plan.monthlyPrice === 0;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300",
        plan.highlight
          ? "border-primary/30 bg-primary/[0.04] shadow-[0_20px_40px_-12px_oklch(0.50_0.22_285/0.12)] ring-1 ring-primary/20"
          : "border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/20 hover:shadow-[0_12px_40px_oklch(0.50_0.22_285/0.06)]"
      )}
    >
      {plan.highlight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
          <Crown className="h-3 w-3" aria-hidden />
          Recommended
        </div>
      )}
      <div className="mt-2 sm:mt-4 flex items-baseline gap-1">
        <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>
      {yearly && plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
        <p className="mt-1 sm:mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Save 20% with annual billing
        </p>
      )}
      <h3 className="mt-4 sm:mt-6 text-lg font-semibold tracking-tight text-foreground">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
      <ul className="mt-6 sm:mt-8 flex-1 space-y-3 text-left text-sm text-muted-foreground">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto sm:mt-8 pt-6">
        <Button
          asChild
          className="w-full rounded-xl"
          variant={plan.highlight || isFree ? "default" : "outline"}
          size="lg"
        >
          {plan.href === "/register" ? (
            <StartFreeLink>{plan.cta}</StartFreeLink>
          ) : (
            <Link href={plan.href}>{plan.cta}</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
