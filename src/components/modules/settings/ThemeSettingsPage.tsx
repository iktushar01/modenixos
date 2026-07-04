"use client";

import { useSyncExternalStore } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

const THEME_OPTIONS: Array<{
  value: ThemeMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Bright and clean workspace view.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low glare ideal for dark environments.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Synchronize display with device state.",
    icon: Laptop,
  },
];

const ThemeSettingsPage = ({
  scope,
  extraContent,
  embedded = false,
}: {
  scope: "client" | "admin";
  extraContent?: React.ReactNode;
  embedded?: boolean;
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const activeTheme = (theme as ThemeMode | undefined) ?? "system";

  return (
    <div className={cn(embedded ? "space-y-6" : "min-h-screen p-4 sm:p-6 lg:p-8", !embedded && scope === "admin" ? "admin-shell" : !embedded ? "bg-background" : "")}>
      <div className={cn(embedded ? "space-y-6" : "mx-auto space-y-6")}>
        <section className={cn("space-y-1.5", scope === "admin" && !embedded && "admin-panel", embedded && "rounded-lg border bg-card p-6")}>
          <h2 className={cn(embedded ? "text-lg font-semibold" : "text-2xl font-semibold tracking-tight")}>
            Dashboard theme
          </h2>
          <p className="text-sm text-muted-foreground">
            Light or dark mode for your admin dashboard — not your public storefront.
          </p>
        </section>

        <section className={cn("space-y-4", scope === "admin" && !embedded && "admin-panel", embedded && "rounded-lg border bg-card p-6")}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-sm font-medium text-foreground">Theme Mode</h2>
              <p className="text-xs text-muted-foreground">Select your interface preference</p>
            </div>
            <div className="text-xs text-muted-foreground self-start sm:self-center">
              Active configuration:{" "}
              <span className="font-medium text-foreground">
                {mounted ? `${activeTheme} (${resolvedTheme ?? "loading"})` : "loading"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {THEME_OPTIONS.map((option) => {
              const isActive = mounted && activeTheme === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-col text-left p-4 rounded-lg border bg-card transition-colors text-card-foreground",
                    isActive
                      ? "border-primary ring-1 ring-primary/20 bg-accent/30"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded">
                        Active
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-sm font-medium tracking-tight">
                    {option.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {extraContent}
      </div>
    </div>
  );
};

export default ThemeSettingsPage;