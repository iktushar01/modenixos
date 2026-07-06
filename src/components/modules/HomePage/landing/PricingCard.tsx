import Link from "next/link";
import { Check } from "lucide-react";
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

  return (
    <div
      className={cn(
        "mkt-glass-card relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5",
        plan.highlight && "mkt-pricing-highlight ring-2 ring-primary/25"
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow-md">
          Recommended
        </span>
      )}
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>
      {yearly && plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Save 20% with annual billing</p>
      )}
      <ul className="mt-6 flex-1 space-y-2.5 text-left text-sm text-muted-foreground">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        asChild
        className="mt-8 w-full rounded-xl"
        variant={plan.highlight ? "default" : "outline"}
      >
        {plan.href === "/register" ? (
          <StartFreeLink>{plan.cta}</StartFreeLink>
        ) : (
          <Link href={plan.href}>{plan.cta}</Link>
        )}
      </Button>
    </div>
  );
}
