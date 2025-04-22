"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Loader2, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Add YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: {
        new (
          element: HTMLElement | string,
          options: {
            videoId: string;
            playerVars?: {
              autoplay?: number;
              controls?: number;
              rel?: number;
              showinfo?: number;
              mute?: number;
              modestbranding?: number;
              playsinline?: number;
            };
            events?: {
              onReady?: () => void;
              onStateChange?: (event: { data: number }) => void;
              onError?: (event: { data: number }) => void;
            };
          }
        ): YouTubePlayer;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  pauseVideo: () => void;
  playVideo: () => void;
}

interface YouTubeVideoPlayerProps {
  videoId: string
  autoPlay?: boolean
  onVideoEnd?: () => void
  className?: string
  mute?: boolean
  maintainAspectRatio?: boolean
  minHeight?: string
}

export function YouTubeVideoPlayer({
  videoId: initialVideoId,
  autoPlay = true,
  onVideoEnd,
  className = '',
  mute = false,
  maintainAspectRatio = true,
  minHeight = '240px'
}: YouTubeVideoPlayerProps) {
  const [videoId, setVideoId] = useState(initialVideoId)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Load YouTube API if not already loaded
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      
      tag.onload = () => {
        console.log("YouTube API loaded successfully")
      }
      
      tag.onerror = () => {
        console.error("Failed to load YouTube API")
        setHasError(true)
        setErrorMessage("Failed to load YouTube player API. Please check your internet connection.")
        setIsLoading(false)
      }
      
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript)
      } else {
        document.head.appendChild(tag)
      }
    }
  }, [])

  // Initialize player when API is ready
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let initializationAttempts = 0
    const MAX_ATTEMPTS = 5

    if (!videoId) {
      setHasError(true)
      setErrorMessage("No video ID provided")
      setIsLoading(false)
      return
    }

    // Create player after YouTube API is loaded
    const initializePlayer = () => {
      if (initializationAttempts >= MAX_ATTEMPTS) {
        setHasError(true)
        setErrorMessage("Failed to initialize YouTube player after multiple attempts")
        setIsLoading(false)
        return
      }

      initializationAttempts++

      if (window.YT && window.YT.Player && containerRef.current) {
        try {
          // Clean up previous player if it exists
          if (playerRef.current) {
            try {
              playerRef.current.destroy()
            } catch (error) {
              console.error("Error destroying previous player:", error)
            }
          }

          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: videoId,
            playerVars: {
              autoplay: autoPlay ? 1 : 0,
              controls: 1,
              rel: 0,
              showinfo: 0,
              mute: mute ? 1 : 0,
              modestbranding: 1,
              playsinline: 1
            },
            events: {
              onReady: () => {
                setIsLoading(false)
                setIsPlayerReady(true)
                console.log("YouTube player ready")
              },
              onStateChange: (event) => {
                // Video ended (state = 0)
                if (event.data === 0 && onVideoEnd) {
                  onVideoEnd()
                }
              },
              onError: (event) => {
                console.error("YouTube player error:", event)
                setHasError(true)
                setErrorMessage(getErrorMessage(event.data))
                setIsLoading(false)
              }
            }
          })
        } catch (error) {
          console.error("Error initializing YouTube player:", error)
          setHasError(true)
          setErrorMessage("Failed to initialize YouTube player. Please try again later.")
          setIsLoading(false)
        }
      } else {
        // If YT is not ready yet, try again in 500ms
        timeoutId = setTimeout(initializePlayer, 500)
      }
    }

    // Wait for the API to be initialized
    if (window.YT && window.YT.Player) {
      initializePlayer()
    } else {
      // Define callback for when API becomes available
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    }

    return () => {
      clearTimeout(timeoutId)
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.error("Error destroying YouTube player:", error)
        }
      }
    }
  }, [videoId, autoPlay, onVideoEnd, mute])

  // Handle video ID changes
  useEffect(() => {
    if (isPlayerReady && playerRef.current && videoId) {
      try {
        setIsLoading(true)
        playerRef.current.loadVideoById(videoId)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading new video:", error)
        setHasError(true)
        setErrorMessage("Failed to load the requested video. Please try a different video.")
        setIsLoading(false)
      }
    }
  }, [videoId, isPlayerReady])

  // Get a more descriptive error message based on the error code
  const getErrorMessage = (errorCode: number): string => {
    switch(errorCode) {
      case 2:
        return "Invalid video ID or URL. Please check the video ID."
      case 5:
        return "The requested content cannot be played. This video might be restricted or private."
      case 100:
        return "The requested video was not found. It may have been removed or marked private."
      case 101:
      case 150:
        return "The video owner does not allow embedding."
      default:
        return "An error occurred. Please try again later."
    }
  }

  // Retry loading the player after an error
  const retryLoading = () => {
    setHasError(false)
    setIsLoading(true)
    setIsPlayerReady(false)
    
    // Slight delay before retry
    setTimeout(() => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
          playerRef.current = null
        } catch (error) {
          console.error("Error destroying player on retry:", error)
        }
      }
      
      // Force re-mounting of the container
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      
      // Re-trigger the initialization useEffect
      const videoTemp = videoId
      setVideoId('')
      setTimeout(() => setVideoId(videoTemp), 50)
    }, 500)
  }

  // Toggle fullscreen mode for the video player
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    
    // If we're entering fullscreen, scroll the player into view
    if (!isFullScreen && wrapperRef.current) {
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }

  // Apply responsive sizing based on container width
  const getResponsiveHeight = () => {
    if (!wrapperRef.current) return minHeight
    
    const containerWidth = wrapperRef.current.offsetWidth
    
    // For very small screens, use a minimum height
    if (containerWidth < 300) return minHeight
    
    // For standard aspect ratio (16:9)
    const aspectRatioHeight = maintainAspectRatio ? `${containerWidth * 0.5625}px` : 'auto'
    
    return aspectRatioHeight
  }

  return (
    <div 
      ref={wrapperRef}
      className={`relative youtube-player-wrapper transition-all duration-300 ${className} ${isFullScreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center p-4' : ''}`}
      style={{
        minHeight: isFullScreen ? '100vh' : minHeight,
        width: isFullScreen ? '100%' : '100%'
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 bg-muted rounded-lg h-full min-h-[240px]">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h3 className="font-semibold text-lg">Video Playback Error</h3>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <Button onClick={retryLoading} variant="outline" size="sm">Try Again</Button>
        </div>
      ) : (
        <div 
          className="relative overflow-hidden rounded-lg"
          style={{
            height: isFullScreen ? '100%' : getResponsiveHeight(),
            width: '100%',
            maxHeight: isFullScreen ? '100vh' : 'none',
            aspectRatio: maintainAspectRatio && !isFullScreen ? '16/9' : 'auto'
          }}
        >
          <div 
            ref={containerRef} 
            className="absolute inset-0 w-full h-full"
            id={`youtube-player-${videoId}`}
          />
          
          {isPlayerReady && (
            <div className="absolute top-2 right-2 z-20">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 bg-black/50 text-white"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 