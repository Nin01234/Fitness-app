"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Background image array with fitness-related images
const backgroundImages = [
  {
    url: "/backgrounds/fitness-bg-1.jpg",
    alt: "Person lifting weights in a gym",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "/backgrounds/fitness-bg-2.jpg",
    alt: "Woman doing yoga on a beach at sunset", 
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "/backgrounds/fitness-bg-3.jpg",
    alt: "Group fitness class in a modern gym",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "/backgrounds/fitness-bg-4.jpg",
    alt: "Runner on a mountain trail",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "/backgrounds/fitness-bg-5.jpg",
    alt: "Person stretching before a workout",
    position: "center",
    credit: "Unsplash"
  }
]

// For development, use placeholder images if the real ones aren't available
const placeholderImages = [
  {
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Person lifting weights in a gym",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Woman doing yoga on a beach at sunset",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Group fitness class in a modern gym",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "https://images.unsplash.com/photo-1486218119243-13883505764c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Runner on a mountain trail",
    position: "center",
    credit: "Unsplash"
  },
  {
    url: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Person stretching before a workout",
    position: "center",
    credit: "Unsplash"
  }
]

interface DynamicBackgroundProps {
  interval?: number; // Time in ms between background changes
  children?: React.ReactNode;
  overlay?: boolean;
  className?: string;
}

export function DynamicBackground({ 
  interval = 10000, 
  children,
  overlay = true,
  className = ""
}: DynamicBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const [isChanging, setIsChanging] = useState(false)
  const [imageLoadError, setImageLoadError] = useState(false)
  
  // Use placeholder images if there's a loading error
  const images = imageLoadError ? placeholderImages : backgroundImages
  
  // Change background image at specified interval
  useEffect(() => {
    const timer = setInterval(() => {
      setIsChanging(true)
      
      // Calculate next image index
      const next = (currentImageIndex + 1) % images.length
      setNextImageIndex(next)
      
      // Short delay to allow animation to complete before changing index
      setTimeout(() => {
        setCurrentImageIndex(next)
        setNextImageIndex((next + 1) % images.length)
        setIsChanging(false)
      }, 1000) // Animation duration
      
    }, interval)
    
    return () => clearInterval(timer)
  }, [currentImageIndex, interval, images.length])
  
  // Handle image loading error
  const handleImageError = () => {
    if (!imageLoadError) {
      console.warn('Error loading background images, using placeholders')
      setImageLoadError(true)
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Current background image */}
      <AnimatePresence>
        {!isChanging && (
          <motion.div
            key={`bg-${currentImageIndex}`}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt}
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
            {overlay && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Next background image (preloaded and animated) */}
      <AnimatePresence>
        {isChanging && (
          <motion.div
            key={`bg-${nextImageIndex}`}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={images[nextImageIndex].url}
              alt={images[nextImageIndex].alt}
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
            {overlay && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Image credit */}
      <div className="absolute bottom-2 right-2 z-10 text-xs text-white/50 bg-black/30 px-2 py-1 rounded">
        Photo: {images[currentImageIndex].credit}
      </div>
      
      {/* Background indicator dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={`dot-${index}`}
            className={`w-2 h-2 rounded-full ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 