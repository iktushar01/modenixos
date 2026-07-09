"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch layout shifts
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-xl border bg-background hover:bg-muted/60 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {/* Sun Icon */}
      <Sun 
        className="h-[1.2rem] w-[1.2rem] text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        dark:-rotate-90 dark:scale-0 dark:opacity-0" 
      />
      
      {/* Moon Icon */}
      <Moon 
        className="absolute h-[1.2rem] w-[1.2rem] text-indigo-400 scale-0 rotate-90 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        dark:rotate-0 dark:scale-100 dark:opacity-100" 
      />
    </Button>
  )
}