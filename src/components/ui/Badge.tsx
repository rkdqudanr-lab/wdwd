import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2",
        {
          "border-transparent bg-brand-orange text-white": variant === "default",
          "border-transparent bg-brand-mint text-white": variant === "secondary",
          "text-brand-brown border-brand-brown/20 bg-white": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
