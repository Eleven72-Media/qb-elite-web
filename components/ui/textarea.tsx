import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Matches Input: rounded-xl, filled gray (#F6F6F7), borderless.
        "flex min-h-[88px] w-full rounded-xl border-0 bg-[#F6F6F7] px-3.5 py-2.5 text-base placeholder:text-muted-foreground focus:bg-[#EEEEEF] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
