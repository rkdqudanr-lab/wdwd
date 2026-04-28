import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brand-orange text-white hover:bg-orange-600": variant === "default",
            "bg-brand-mint text-white hover:bg-teal-500": variant === "secondary",
            "border-2 border-brand-brown/20 bg-white text-brand-brown hover:border-brand-brown hover:bg-brand-brown/5": variant === "outline",
            "hover:bg-black/5 text-brand-brown": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "danger",
            "h-12 px-6 py-2": size === "default",
            "h-9 rounded-lg px-4": size === "sm",
            "h-14 rounded-2xl px-8 text-base": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
