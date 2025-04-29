"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // When the route changes, scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "instant" // Use "instant" instead of "smooth" to avoid animation
    })
  }, [pathname])

  return null
} 