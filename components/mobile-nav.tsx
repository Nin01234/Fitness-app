"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ActivitySquare, Award, BarChart, HelpCircle, Menu, Utensils, X, User, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

export function MobileNav({ links }: { links: { title: string; href: string; icon?: React.ReactNode }[] }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    // Handle touch events properly on iOS
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="touch-target mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 sm:max-w-xs">
        <div className="px-2">
          <Logo />
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-2">
          <div className="flex flex-col space-y-1">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-md py-3 px-2 text-base font-medium touch-target",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.icon && <span className="mr-2 h-5 w-5">{link.icon}</span>}
                {link.title}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-border px-6 py-2 text-center text-xs">
          <p>© {new Date().getFullYear()} FitLife Pro</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

