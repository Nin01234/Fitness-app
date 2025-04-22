"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-nappy-936075.jpg-2LfRr4REFl54sXTjiYV6X2DI777UAP.jpeg",
      alt: "Fitness tracking app dashboard",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-nutrisense-inc-683752192-17947739.jpg-xNnulz2kS6MknizhBz2xVIvy9QGcrF.jpeg",
      alt: "Nutrition tracking on mobile",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/08bf52164614065.63f9a1d2112a5-ZvbKKVDdVzSvytpnvdT3lTHwiCS4PS.png",
      alt: "Nutrition tracking dashboard",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-leonardho-1552106.jpg-ESvQHoDk3lb6w0I77ZHFcXDbEJabCj.jpeg",
      alt: "Workout tracking",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative overflow-hidden rounded-xl shadow-2xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full">
            <Card className="overflow-hidden border-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.alt}
                width={500}
                height={600}
                className="aspect-[3/4] h-auto w-full object-cover"
                priority={index === 0}
              />
            </Card>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-primary" : "bg-primary/30"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

