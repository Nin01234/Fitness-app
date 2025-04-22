import type React from "react"
/**
 * Utility function to handle image loading errors
 * @param e - The error event from the image
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement
  target.src = "/placeholder.svg"
  target.onerror = null // Prevent infinite error loop
}

/**
 * Utility function to preload images
 * @param urls - Array of image URLs to preload
 */
export const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    if (typeof window !== "undefined") {
      const img = new Image()
      img.src = url
    }
  })
}

