"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StoreSaveBarProps = {
  label: string;
  onSave: () => void;
  saving?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
};

export function StoreSaveBar({
  label,
  onSave,
  saving = false,
  disabled = false,
  hint,
  className,
}: StoreSaveBarProps) {
  return (
    <div
      className={cn(
        "dashboard-panel z-20 flex flex-col gap-3 border-t border-border/60 bg-background/92 p-3 backdrop-blur-xl",
        "fixed inset-x-0 bottom-0 sm:static sm:rounded-2xl sm:border sm:border-border/55 sm:bg-card/85",
        "sm:flex-row sm:items-center sm:justify-between sm:p-5",
        className,
      )}
    >
      {hint ? (
        <p className="text-xs text-muted-foreground sm:text-sm">{hint}</p>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Button
        type="button"
        size="default"
        onClick={onSave}
        disabled={disabled || saving}
        className="w-full sm:w-auto sm:min-w-[11rem] lg:size-lg"
      >
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {label}
      </Button>
    </div>
  );
}
