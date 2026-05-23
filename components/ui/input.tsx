import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Flutter `inputDecoration` parity: rounded, filled gray
          // (#F6F6F7), borderless, no focus ring drama — focus shows
          // by darkening the fill slightly via :focus.
          "flex h-12 w-full rounded-xl border-0 bg-[#F6F6F7] px-3.5 py-2.5 text-base placeholder:text-muted-foreground focus:bg-[#EEEEEF] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
