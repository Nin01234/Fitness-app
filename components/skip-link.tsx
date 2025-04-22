"use client"

import React from "react"

interface SkipLinkProps {
  targetId: string
  className?: string
}

export function SkipLink({ targetId, className }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    
    if (target) {
      // Set tabindex to make the element focusable
      target.setAttribute('tabindex', '-1')
      target.focus()
      
      // Optional: Remove tabindex when the element loses focus
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex')
      }, { once: true })
      
      // Scroll into view (may not be necessary if focus does this)
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <a 
      href={`#${targetId}`}
      onClick={handleClick}
      className={`sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:left-4 focus:top-4 focus:rounded-md focus:outline-none focus:shadow-lg ${className || ""}`}
    >
      Skip to content
    </a>
  )
} 