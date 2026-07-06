export function DashboardHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="relative flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {children}
    </header>
  );
}
