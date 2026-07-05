"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorefrontTheme } from "../../StorefrontThemeContext";

export function StorefrontThemeToggle() {
  const { colorMode, toggleColorMode } = useStorefrontTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleColorMode}
      aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={colorMode === "dark" ? "Light mode" : "Dark mode"}
      className="shrink-0"
    >
      {colorMode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
