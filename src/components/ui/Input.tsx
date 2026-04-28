import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-brand-brown/20 bg-white px-4 py-2 text-sm text-brand-brown ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-brown/40 focus-visible:outline-none focus-visible:border-brand-orange disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
