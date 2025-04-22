"use client"

import { Sparkles } from "lucide-react"

interface PremiumBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "subtle" | "outline"
}

export function PremiumBadge({
  className = "",
  size = "md",
  variant = "default"
}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 rounded-full",
    md: "text-xs px-2 py-1 rounded-full",
    lg: "text-sm px-2.5 py-1 rounded-full"
  }

  const iconSizes = {
    sm: "h-2.5 w-2.5 mr-0.5",
    md: "h-3 w-3 mr-1",
    lg: "h-3.5 w-3.5 mr-1.5"
  }

  const variantClasses = {
    default: "bg-primary/15 text-primary",
    subtle: "bg-primary/5 text-primary/80",
    outline: "border border-primary/30 text-primary"
  }

  return (
    <span className={`${sizeClasses[size]} ${variantClasses[variant]} flex items-center ${className}`}>
      <Sparkles className={iconSizes[size]} /> 
      Premium
    </span>
  )
} 