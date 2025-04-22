"use client"

import React, { useState, useEffect, useRef } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
  decimal?: string
}

export function CountUp({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  decimal = '.'
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState<number>(0)
  const startTime = useRef<number>(0)
  const startValue = useRef<number>(0)
  const endValue = useRef<number>(value)
  const requestRef = useRef<number>(0)
  const previousValue = useRef<number>(0)

  // Format number with commas and decimals
  const formatNumber = (num: number): string => {
    const fixedNum = num.toFixed(decimals)
    const [wholePart, decimalPart] = fixedNum.split('.')
    
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    
    return `${prefix}${formattedWholePart}${
      decimals > 0 ? decimal + decimalPart : ''
    }${suffix}`
  }

  // Animation function
  const animate = (timestamp: number) => {
    if (!startTime.current) {
      startTime.current = timestamp
    }
    
    const progress = timestamp - startTime.current
    const timeProgress = Math.min(progress / (duration * 1000), 1)
    
    // Easing function (easeOutExpo)
    const easedProgress = timeProgress === 1 
      ? 1 
      : 1 - Math.pow(2, -10 * timeProgress)
    
    const currentValue = startValue.current + easedProgress * (endValue.current - startValue.current)
    setDisplayValue(currentValue)

    if (timeProgress < 1) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }

  // Start animation when value or duration changes
  useEffect(() => {
    // Only animate if value changes
    if (value !== previousValue.current) {
      // Cancel any existing animation
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      
      // Set starting values for the new animation
      startValue.current = displayValue
      endValue.current = value
      startTime.current = 0
      
      // Start the animation
      requestRef.current = requestAnimationFrame(animate)
      
      // Update the previous value
      previousValue.current = value
    }
    
    // Cleanup animation on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [value, duration, displayValue])

  // If the component is just mounted and value is zero,
  // directly set the display value to avoid animation
  useEffect(() => {
    if (displayValue === 0 && value === 0) {
      setDisplayValue(0)
    }
  }, [displayValue, value])

  // Handle format updates even when not animating
  useEffect(() => {
    if (decimals !== undefined || prefix !== undefined || suffix !== undefined || separator !== undefined || decimal !== undefined) {
      // Force re-render with updated formatting
      setDisplayValue(prev => prev + 0.00000001)
    }
  }, [decimals, prefix, suffix, separator, decimal])

  return (
    <>{decimals === 0 ? Math.round(displayValue) : formatNumber(displayValue)}</>
  )
} 