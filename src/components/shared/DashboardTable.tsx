import { cn } from "@/lib/utils";

interface DashboardTableProps {
  children: React.ReactNode;
  className?: string;
  /** Optional label shown in the table chrome strip */
  label?: string;
  /** Optional count badge next to the label */
  count?: number;
}

export function DashboardTable({
  children,
  className,
  label,
  count,
}: DashboardTableProps) {
  return (
    <div className={cn("dashboard-table-shell", className)}>
      {(label || count !== undefined) && (
        <div className="dashboard-table-meta">
          {label && <span className="dashboard-table-meta-label">{label}</span>}
          {count !== undefined && (
            <span className="dashboard-table-meta-count">{count}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
