import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  eyebrow?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("dashboard-page-header", className)} data-slot="page-header">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="mt-1 hidden h-11 w-1 shrink-0 rounded-full bg-gradient-to-b from-primary via-primary/70 to-primary/20 sm:block"
            aria-hidden
          />
          <div className="min-w-0 space-y-1.5">
            {eyebrow && <p className="admin-section-label">{eyebrow}</p>}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
