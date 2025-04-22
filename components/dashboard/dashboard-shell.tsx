import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className={cn("bg-background min-h-screen relative", className)}>
      <div className="container space-y-8 p-4 sm:p-6 lg:p-8 pt-6 animate-in relative z-10">
        {children}
      </div>
    </div>
  )
}

