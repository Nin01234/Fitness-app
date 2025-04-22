"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { handleImageError, preloadImages } from "@/utils/image-utils"
import { ImageFallback } from "@/components/ui/image-fallback"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EnhancedImageSlider() {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  )
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current])
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const images = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-yusufkahriman-12914079.jpg-zMWPs5tzJzWhxBmchLvH7s4k1dMZGX.jpeg",
      alt: "Fitness enthusiast showing results in the gym",
      caption: "Transform your body with consistent training 💪",
      tag: "Motivation",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mastercowley-1153370.jpg-MBtou4Uzb1ZE7PFYiEDbeRHmWdCUII.jpeg",
      alt: "Woman enjoying healthy nutrition",
      caption: "Fuel your body with nutritious foods 🥗",
      tag: "Nutrition",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-radoslaw-krupa-3227938-11118642.jpg-ef38BZ3wcXs58eVfUI18Idv8iCCoVl.jpeg",
      alt: "Fresh strawberries for healthy snacking",
      caption: "Choose natural foods for optimal health 🍓",
      tag: "Healthy Eating",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-ushindinamegabe-11327776.jpg-hahFhhhgheHKHfODIVrVgwT4HY2XHm.jpeg",
      alt: "Fitness training in a modern gym",
      caption: "Push your limits and see results 🏋️‍♂️",
      tag: "Training",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-alesiakozik-8154201.jpg-tyzesqMkjsEVMZRt8a0PFmq37GgUXT.jpeg",
      alt: "Fitness planning with dumbbells and healthy food",
      caption: "Plan your workouts for maximum efficiency 📝",
      tag: "Planning",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-karolina-grabowska-5714507.jpg-t9pl1XxRBbwnOMNLveO73HPlZcXr5w.jpeg",
      alt: "Weight loss progress demonstration",
      caption: "Track your progress and celebrate victories 📊",
      tag: "Progress",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-n-voitkevich-6942044.jpg-8m5rm7N07vacUqCvkCEFnnhjLEAAqX.jpeg",
      alt: "Fruits with measuring tape for diet tracking",
      caption: "Measure your nutrition for better results 📏",
      tag: "Diet",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-panther-1547248.jpg-lV9aFyh0ThDKXL4VwuTjOUBgDbRLEw.jpeg",
      alt: "Muscular physique showing fitness results",
      caption: "Dedication leads to transformation 🔥",
      tag: "Results",
    },
  ]

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const togglePlayPause = useCallback(() => {
    const auto = autoplay.current
    if (!auto) return

    if (auto.isPlaying()) {
      auto.stop()
      setIsPlaying(false)
    } else {
      auto.play()
      setIsPlaying(true)
    }
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    // Preload images
    preloadImages(images.map((img) => img.src))

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    emblaApi.on('select', onSelect)
    // Set initial state
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, images])


  if (hasError) {
    return <ImageFallback message="Unable to load fitness images" className="h-[400px] w-full" />
  }

  return (
    <div className="relative mx-auto mb-8 w-full overflow-hidden rounded-xl shadow-lg" ref={emblaRef}>
      <div className="flex h-[400px]">
        {images.map((image, index) => (
          <div key={`enhanced-slide-${index}`} className="relative h-full min-w-0 flex-[0_0_100%]">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              onError={(e) => {
                handleImageError(e)
                if (index === selectedIndex) { // Only set error if current slide fails
                  setHasError(true)
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white p-4 rounded-lg bg-black/20 backdrop-blur-sm">
              <Badge variant="secondary" className="mb-2 bg-white/20 text-white backdrop-blur-md border-none">{image.tag}</Badge>
              <p className="text-lg font-semibold md:text-xl drop-shadow-md">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={`enhanced-dot-${index}`}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              selectedIndex === index ? "w-4 bg-white" : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause slider" : "Play slider"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  )
}

