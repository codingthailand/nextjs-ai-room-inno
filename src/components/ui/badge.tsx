import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border px-2 py-1 text-xs font-semibold tracking-[0.02em] whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-primary/20 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground [a]:hover:bg-[color-mix(in_srgb,var(--secondary),black_8%)]",
        tertiary:
          "border-tertiary bg-tertiary text-tertiary-foreground [a]:hover:bg-[color-mix(in_srgb,var(--tertiary),black_10%)]",
        outline:
          "border-border-strong bg-transparent text-foreground [a]:hover:bg-warm",
        destructive:
          "border-destructive bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
        success:
          "border-transparent bg-[#dcfce7] text-[#166534]",
        warning:
          "border-transparent bg-[#fef3c7] text-[#92400e]",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-warm",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
