import { cn } from "@/lib/utils";

interface MarketingSectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function MarketingSectionHeader({
  label,
  title,
  description,
  className,
}: MarketingSectionHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      {label ? <p className="mkt-label mb-4">{label}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.5rem] md:leading-tight">{title}</h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
