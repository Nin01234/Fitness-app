"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DynamicTextSliderProps {
  messages: string[]
  direction?: "horizontal" | "vertical"
  speed?: number
  className?: string
  textClassName?: string
  interval?: number
  hoverPause?: boolean
  controls?: boolean
}

export function DynamicTextSlider({
  messages = [
    "Transform your fitness journey with personalized workouts",
    "Track your progress and celebrate every achievement",
    "Connect with others on the same fitness path",
    "Nutrition tips tailored to your fitness goals",
    "Expert advice at your fingertips, anytime, anywhere"
  ],
  direction = "horizontal",
  speed = 15000,
  className = "",
  textClassName = "",
  interval = 5000,
  hoverPause = true,
  controls = true
}: DynamicTextSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [animation, setAnimation] = useState<"slide-in" | "slide-out" | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setAnimation("slide-out")
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % messages.length)
      setAnimation("slide-in")
    }, 500)
  }

  const prevSlide = () => {
    setAnimation("slide-out")
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? messages.length - 1 : prevIndex - 1))
      setAnimation("slide-in")
    }, 500)
  }

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(nextSlide, interval)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, interval])

  const handleMouseEnter = () => {
    if (hoverPause) setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (hoverPause) setIsPaused(false)
  }

  const isHorizontal = direction === "horizontal"

  return (
    <div 
      className={cn(
        "w-full relative overflow-hidden",
        isHorizontal ? "h-32" : "h-48",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500 p-4",
          isHorizontal 
            ? (animation === "slide-in" 
                ? "animate-slide-in-right" 
                : animation === "slide-out" 
                  ? "animate-slide-out-left" 
                  : "")
            : (animation === "slide-in" 
                ? "animate-slide-in-bottom" 
                : animation === "slide-out" 
                  ? "animate-slide-out-top" 
                  : ""),
          isHorizontal ? "flex-row" : "flex-col"
        )}
      >
        <h2 
          className={cn(
            "text-center text-lg md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600",
            textClassName
          )}
        >
          {messages[activeIndex]}
        </h2>
      </div>

      {controls && (
        <div className={cn(
          "absolute flex gap-2",
          isHorizontal 
            ? "bottom-2 right-2" 
            : "bottom-2 right-2"
        )}>
          <button 
            onClick={prevSlide}
            className="p-1 bg-background/80 backdrop-blur-sm rounded-full shadow hover:bg-background/90 transition-colors"
          >
            {isHorizontal ? <ChevronsLeft size={20} /> : <ChevronsUp size={20} />}
          </button>
          <button 
            onClick={nextSlide}
            className="p-1 bg-background/80 backdrop-blur-sm rounded-full shadow hover:bg-background/90 transition-colors"
          >
            {isHorizontal ? <ChevronsRight size={20} /> : <ChevronsDown size={20} />}
          </button>
        </div>
      )}

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {messages.map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-1 w-10 mx-1 rounded-xl transition-all duration-500 ease-in-out",
              index === activeIndex ? "bg-primary" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  )
} 