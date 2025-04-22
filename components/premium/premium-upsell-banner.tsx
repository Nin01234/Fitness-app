"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface PremiumUpsellBannerProps {
  title?: string
  description?: string
  benefits?: string[]
  compactMode?: boolean
  className?: string
}

export function PremiumUpsellBanner({
  title = "Unlock Premium Features",
  description = "Upgrade to premium for exclusive features and enhanced capabilities",
  benefits = [
    "Personalized analytics and insights",
    "Advanced tracking and reporting",
    "Exclusive premium content and features",
  ],
  compactMode = false,
  className = "",
}: PremiumUpsellBannerProps) {
  if (compactMode) {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-primary/5 p-3 rounded-lg border border-primary/20 flex items-center justify-between ${className}`}>
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-primary" /> 
          <span className="text-sm font-medium">{title}</span>
        </div>
        <Button asChild size="sm" className="ml-4">
          <Link href="/premium">
            Upgrade
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium mb-1 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary" /> 
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <span className="bg-primary/20 p-0.5 rounded-full mr-1.5 text-[10px]">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-4">
          <Button asChild size="sm">
            <Link href="/premium">
              Upgrade Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 