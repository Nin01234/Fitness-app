import type React from "react"
import { ChevronRight, Sparkles } from "lucide-react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 py-6 mb-6 border-b border-primary/10 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animated-gradient opacity-30"></div>
      
      {/* Animated particles */}
      <div className="absolute top-0 right-0 h-full w-1/3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span 
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              opacity: 0.3 + Math.random() * 0.5,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>
      
      <div className="grid gap-2 relative z-10 animate-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-secondary to-accent animate-pulse"></div>
          <h1 className="text-3xl font-heading font-bold tracking-tight gradient-text relative">
            {heading}
            <Sparkles className="absolute -right-7 top-1 h-4 w-4 text-primary/70 animate-pulse" style={{ animationDelay: "0.7s" }} />
          </h1>
        </div>
        {text && (
          <div className="flex items-center gap-1.5 text-muted-foreground max-w-3xl animate-in" style={{ animationDelay: "0.3s" }}>
            <ChevronRight className="h-3 w-3 text-primary" />
            <p className="relative">
              {text}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary/40 to-secondary/40 group-hover:w-full transition-all duration-700 animate-in shimmer" style={{ animationDelay: "0.7s" }}></span>
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0 relative z-10 animate-in" style={{ animationDelay: "0.3s" }}>
        {children}
      </div>
    </div>
  )
}

