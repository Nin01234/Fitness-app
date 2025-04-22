"use client"

import { useState, useEffect, useRef } from "react"

export function AchievementHeroVideo() {
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // If video fails to load, add a background color instead
    setHasError(true)
    e.currentTarget.style.display = 'none'
  }

  // Force video to play on component mount
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Add event listeners to handle playback issues
      const playPromise = video.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video playback failed:", error)
          setHasError(true)
        })
      }

      // Try to play the video again if it stops
      const handleEnded = () => {
        video.play().catch(error => {
          console.error("Video replay failed:", error)
          setHasError(true)
        })
      }

      video.addEventListener('ended', handleEnded)
      
      return () => {
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${hasError ? 'bg-gradient-to-br from-amber-600 to-orange-700' : ''}`}>
      {!hasError && (
        <video
          ref={videoRef}
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video_2025-03-21_23-47-18-RfhQpPHn7j4zAllGNV3mNkp4p5alWp.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/workoutdown.jpg-PAV6MhuPFWtFZHFQ0uQBd6cE8dLaxC.jpeg"
          className="w-full h-full object-cover opacity-30"
          onError={handleVideoError}
        />
      )}
    </div>
  )
} 