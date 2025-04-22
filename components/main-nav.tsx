"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  LineChart, 
  Award, 
  HelpCircle,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "View your fitness overview" },
    { href: "/workouts", label: "Workouts", icon: Dumbbell, tooltip: "Track and manage your workouts" },
    { href: "/nutrition", label: "Nutrition", icon: Utensils, tooltip: "Log meals and track nutrition" },
    { href: "/progress", label: "Progress", icon: LineChart, tooltip: "Monitor your fitness progress" },
    { href: "/achievements", label: "Achievements", icon: Award, tooltip: "View your earned achievements" },
    { href: "/support", label: "Support", icon: HelpCircle, tooltip: "Get help and support" },
  ]

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Logo />
      <nav className="hidden gap-6 md:flex">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link 
                    href={item.href} 
                    className={cn(
                      "relative group flex items-center gap-1.5 text-sm font-medium transition-all",
                      isActive 
                        ? "text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <IconComponent 
                      className={cn(
                        "h-4 w-4 transition-all", 
                        isActive 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-foreground"
                      )} 
                    />
                    {item.label}
                    {isActive && (
                      <Sparkles className="h-3 w-3 text-primary absolute -right-4 top-1/2 -translate-y-1/2" />
                    )}
                    <div 
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-0.5 w-0 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300",
                        isActive ? "w-full" : "group-hover:w-full"
                      )}
                    ></div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>
    </div>
  )
}

