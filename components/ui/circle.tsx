import * as React from "react"
import { cn } from "@/lib/utils"

export interface CircleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  className?: string
  children?: React.ReactNode
}

export const Circle = React.forwardRef<HTMLDivElement, CircleProps>(
  ({ size = 40, className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          className
        )}
        style={{ 
          width: size, 
          height: size 
        }}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Circle.displayName = "Circle" 