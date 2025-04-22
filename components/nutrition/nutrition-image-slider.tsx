"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { handleImageError, preloadImages } from "@/utils/image-utils"
import { ImageFallback } from "@/components/ui/image-fallback"

export function NutritionImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasError, setHasError] = useState(false)

  const images = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2812%29.jfif-hgtYsdi4Q6wJNFPmst71fXCMHhTIRS.jpeg",
      alt: "Breakfast options including avocado toast, croissant, and pancakes",
      caption: "Start your day with a balanced breakfast",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R%20%281%29.jfif-AM45Fp1OVz3bcSrgf4H7AKDQAu4Jgw.jpeg",
      alt: "Breakfast with eggs, bacon and fruit",
      caption: "Protein-packed breakfast options for energy",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2810%29.jfif-HYcjN0SWTtG2Z23ogymLfJCfc3HhXS.jpeg",
      alt: "Roasted vegetables in a pot",
      caption: "Colorful vegetables for essential nutrients",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2811%29.jfif-wrKuz5h47WgxCyFGNGxrpJKgxiOrYn.jpeg",
      alt: "Chicken protein bowl with sauce",
      caption: "High-protein meals for muscle recovery",
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    // Preload images
    preloadImages(images.map((img) => img.src))

    // Auto-advance slides
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (hasError) {
    return <ImageFallback message="Unable to load nutrition images" className="h-[300px] w-full" />
  }

  return (
    <div className="relative mx-auto mb-8 h-[300px] w-full overflow-hidden rounded-xl bg-black">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={`nutrition-slide-${index}`} className="relative h-full w-full flex-shrink-0">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              onError={(e) => {
                handleImageError(e)
                if (images.length === 0 || (index === 0 && currentIndex === 0)) {
                  setHasError(true)
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-lg font-medium md:text-xl">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

