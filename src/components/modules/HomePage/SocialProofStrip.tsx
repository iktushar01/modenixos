import { Palette, Package, ShoppingBag, TrendingUp } from "lucide-react";

const highlights = [
  { icon: ShoppingBag, label: "Beautiful storefronts" },
  { icon: Package, label: "Inventory & catalog" },
  { icon: TrendingUp, label: "Revenue analytics" },
  { icon: Palette, label: "Brand customization" },
];

export default function SocialProofStrip() {
  return (
    <section className="border-b border-border bg-muted/30 py-10">
      <div className="mkt-section">
        <p className="mkt-label mb-6 text-center">
          Everything fashion brands need to sell online
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {highlights.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
