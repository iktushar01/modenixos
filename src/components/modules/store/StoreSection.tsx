import { cn } from "@/lib/utils";

type StoreSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function StoreSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: StoreSectionProps) {
  return (
    <section className={cn("dashboard-panel space-y-6 p-4 sm:p-6", className)}>
      <div className="space-y-1">
        {eyebrow ? <p className="admin-section-label">{eyebrow}</p> : null}
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
