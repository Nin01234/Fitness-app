"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Loader2, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Add YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: any
      PlayerState: {
        PLAYING: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YouTubePlayer {
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  setPlaybackQuality: (quality: string) => void;
  mute: () => void;
  unMute: () => void;
  getIframe: () => HTMLIFrameElement;
  getPlayerState: () => number;
}

interface YouTubeVideoPlayerProps {
  videoId: string
  autoPlay?: boolean
  onVideoEnd?: () => void
  className?: string
  mute?: boolean
  maintainAspectRatio?: boolean
  minHeight?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

interface YouTubeEvent {
  target: {
    setPlaybackQuality: (quality: string) => void
    unMute: () => void
    playVideo: () => void
    getIframe: () => HTMLIFrameElement | null
    destroy: () => void
  }
  data: number
}

export function YouTubeVideoPlayer({
  videoId: initialVideoId,
  autoPlay = true,
  onVideoEnd,
  className = '',
  mute = false,
  maintainAspectRatio = true,
  minHeight = '240px',
  isMinimized = false,
  onToggleMinimize
}: YouTubeVideoPlayerProps) {
  const [videoId, setVideoId] = useState(initialVideoId)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const playerRef = useRef<any>(null)
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
    let timeoutId: number | undefined
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

      if (typeof window.YT === 'undefined' || !window.YT.Player) {
        // Load YouTube API if not already loaded
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const tag = document.createElement('script')
          tag.src = 'https://www.youtube.com/iframe_api'
          document.head.appendChild(tag)
        }
        
        // Wait for API to load
        window.onYouTubeIframeAPIReady = createPlayer
        return
      }

      createPlayer()
    }

    const createPlayer = () => {
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
          playsinline: 1,
          fs: 0, // Disable YouTube's fullscreen button to use our custom one
          origin: window.location.origin,
          enablejsapi: 1
        },
        events: {
          onReady: (event: YouTubeEvent) => {
            setIsLoading(false)
            setIsPlayerReady(true)
            console.log("YouTube player ready")
            
            // Apply high quality if available
            try {
              event.target.setPlaybackQuality('hd720')
            } catch (error) {
              console.warn("Could not set playback quality", error)
            }
            
            // Force autoplay with audio on all devices
            if (autoPlay) {
              try {
                // Ensure audio is unmuted unless mute is explicitly set
                if (!mute) {
                  event.target.unMute()
                }
                event.target.playVideo()
                
                // For mobile, we need to handle autoplay specially
                if (isMobile) {
                  // On mobile, sometimes we need to play after a user interaction
                  document.addEventListener('touchstart', function playOnTouch() {
                    event.target.playVideo()
                    document.removeEventListener('touchstart', playOnTouch)
                  }, { once: true })
                }
              } catch (error) {
                console.warn("Could not autoplay", error)
              }
            }
            
            // Ensure iframe doesn't redirect to YouTube
            try {
              const iframe = event.target.getIframe()
              if (iframe) {
                iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation')
                // Add allow attribute for autoplay with sound
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
              }
            } catch (error) {
              console.warn("Could not set iframe attributes", error)
            }
          },
          onStateChange: (event: YouTubeEvent) => {
            // Video ended (state = 0)
            if (event.data === 0 && onVideoEnd) {
              onVideoEnd()
            }
          },
          onError: (event: YouTubeEvent) => {
            console.error("YouTube player error:", event)
            setHasError(true)
            setErrorMessage(getErrorMessage(event.data))
            setIsLoading(false)
          }
        }
      })
    }

    // Wait for the API to be initialized
    if (typeof window.YT === 'undefined' || !window.YT.Player) {
      // Define callback for when API becomes available
      window.onYouTubeIframeAPIReady = initializePlayer
    } else {
      initializePlayer()
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.error("Error destroying YouTube player:", error)
        }
      }
    }
  }, [videoId, autoPlay, onVideoEnd, isMobile, mute])

  // Update videoId if the prop changes
  useEffect(() => {
    if (initialVideoId !== videoId) {
      setVideoId(initialVideoId)
    }
  }, [initialVideoId, videoId])

  // Function to get a human-readable error message from error code
  const getErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
      case 2:
        return "Invalid video ID. Please check the video URL."
      case 5:
        return "The requested video cannot be played in an HTML5 player."
      case 100:
        return "This video has been removed or is private."
      case 101:
      case 150:
        return "This video cannot be played in embedded players."
      default:
        return "An error occurred while playing the video."
    }
  }

  // Function to retry loading the player
  const retryLoading = () => {
    setIsLoading(true)
    setHasError(false)
    
    if (playerRef.current) {
      try {
        playerRef.current.destroy()
        playerRef.current = null
      } catch (error) {
        console.error("Error destroying player during retry:", error)
      }

    }
    
    // Reload YouTube API if needed
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
    
    // Force component re-render with a new key by toggling videoId
    setVideoId('')
    setTimeout(() => setVideoId(initialVideoId), 50)
  }

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen().catch((err) => console.error("Error exiting fullscreen:", err))
    } else if (wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch((err) => console.error("Error entering fullscreen:", err))
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Calculate responsive height
  const getResponsiveHeight = () => {
    if (!maintainAspectRatio) return minHeight
    
    // Standard 16:9 YouTube aspect ratio
    const aspectRatio = 9 / 16 * 100
    return `calc(${aspectRatio}vw - ${aspectRatio * 0.2}px)`
  }

  // Get video container style based on states
  const getVideoContainerStyle = () => {
    if (isFullScreen) {
      return {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999,
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      } as React.CSSProperties
    }
    
    if (isMinimized) {
      return {
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        width: isMobile ? '200px' : '280px',
        height: isMobile ? '112px' : '158px',
        zIndex: 100,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      } as React.CSSProperties
    }
    
    return {
      width: '100%',
      height: maintainAspectRatio ? 'auto' : minHeight,
      aspectRatio: maintainAspectRatio ? '16/9' : 'auto',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
    } as React.CSSProperties
  }

  return (
    <div 
      ref={wrapperRef}
      className={`relative overflow-hidden transition-all duration-300 ${className} ${
        isFullScreen ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
      style={getVideoContainerStyle()}
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-10 p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-white mb-4">{errorMessage}</p>
          <Button onClick={retryLoading} variant="default">
            Try Again
          </Button>
        </div>
      )}
      
      {/* YouTube player container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />
      
      {/* Control buttons */}
      {isPlayerReady && !isLoading && !hasError && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {/* Minimize/Maximize button - only show if the callback is provided */}
          {onToggleMinimize && (
            <button 
              onClick={onToggleMinimize}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
              aria-label={isMinimized ? "Maximize video" : "Minimize video"}
            >
              {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
            </button>
          )}
          
          {/* Fullscreen toggle button */}
          <button 
            onClick={toggleFullScreen}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
            aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
  )
} 