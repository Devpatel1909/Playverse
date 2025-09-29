import * as React from "react"
import { cn } from "../../common/lib/utils"

const Popover = ({ children, open, onOpenChange, ...props }) => {
  if (!open) return null
  
  return (
    <div className="relative">
      {children}
    </div>
  )
}

const PopoverTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("cursor-pointer", className)}
    {...props}
  >
    {children}
  </div>
))
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
