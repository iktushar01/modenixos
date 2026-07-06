import type { FeatureItem } from "../landing-data";
import SpotlightCard from "@/components/SpotlightCard";

const spotlight = "rgba(112, 71, 235, 0.08)" as const;

export function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  return (
    <SpotlightCard
      spotlightColor={spotlight}
      className="mkt-glass-card group !rounded-2xl !p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
    </SpotlightCard>
  );
}
