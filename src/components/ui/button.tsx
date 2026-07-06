"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: [
          "bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary),white_14%)_0%,var(--primary)_100%)] text-primary-foreground",
          "shadow-[0_1px_2px_oklch(0.25_0.04_285/0.12),0_4px_16px_color-mix(in_oklch,var(--primary)_32%,transparent)]",
          "hover:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary),white_18%)_0%,color-mix(in_oklch,var(--primary),white_4%)_100%)] hover:shadow-[0_2px_6px_oklch(0.25_0.04_285/0.14),0_10px_28px_color-mix(in_oklch,var(--primary)_40%,transparent)] hover:-translate-y-px",
        ].join(" "),
        outline: [
          "border-border/70 bg-background/85 text-foreground shadow-sm",
          "hover:border-primary/45 hover:bg-primary/[0.07] hover:text-primary hover:shadow-md",
          "dark:border-border/55 dark:bg-card/60 dark:hover:bg-primary/10",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground shadow-sm",
          "hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_7%)] hover:shadow-md hover:-translate-y-px",
        ].join(" "),
        ghost: [
          "text-foreground/85",
          "hover:bg-primary/10 hover:text-primary",
          "aria-expanded:bg-primary/10 aria-expanded:text-primary",
          "dark:hover:bg-primary/15",
        ].join(" "),
        destructive: [
          "border border-destructive/30 bg-destructive/10 text-destructive shadow-sm",
          "hover:border-destructive/60 hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_4px_14px_color-mix(in_oklch,var(--destructive)_35%,transparent)]",
          "focus-visible:border-destructive/50 focus-visible:ring-destructive/25",
        ].join(" "),
        link: "font-medium text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3.5 text-[0.8125rem] in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 rounded-xl px-5 text-[0.9375rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9 rounded-xl",
        "icon-xs":
          "size-7 rounded-lg in-data-[slot=button-group]:rounded-xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-lg in-data-[slot=button-group]:rounded-xl [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
