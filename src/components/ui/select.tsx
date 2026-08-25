import * as React from "react"

import { cn } from "@/lib/utils"

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-[42px] w-full min-w-0 cursor-pointer appearance-none rounded-sm border-[1.5px] border-input bg-card px-3.5 pr-9 text-base text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-[#a8a29e] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
