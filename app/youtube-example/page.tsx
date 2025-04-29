"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function YouTubeExamplePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [videoId, setVideoId] = useState<string>("AzV3EA-1-yM") // Updated default example video

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoEnd = () => {
    console.log("Video ended")
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">YouTube Video Player Example</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Video Player Demo</CardTitle>
          <CardDescription>
            This page demonstrates the embedded YouTube video player component
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px] bg-muted rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <YouTubeVideoPlayer 
              videoId={videoId}
              onVideoEnd={handleVideoEnd}
              className="rounded-lg overflow-hidden shadow-lg"
            />
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button 
          onClick={() => setVideoId("AzV3EA-1-yM")}
          variant={videoId === "AzV3EA-1-yM" ? "default" : "outline"}
        >
          Example Video 1
        </Button>
        
        <Button 
          onClick={() => setVideoId("ml6cT4AZdqI")}
          variant={videoId === "ml6cT4AZdqI" ? "default" : "outline"}
        >
          Example Video 2
        </Button>
        
        <Button 
          onClick={() => setVideoId("UItWltVZZmE")}
          variant={videoId === "UItWltVZZmE" ? "default" : "outline"}
        >
          Example Video 3
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>How To Use The Component</CardTitle>
          <CardDescription>
            Instructions for using the YouTubeVideoPlayer component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`import { YouTubeVideoPlayer } from "@/components/youtube-video-player";

// Basic usage
<YouTubeVideoPlayer videoId="AzV3EA-1-yM" />

// With all options
<YouTubeVideoPlayer 
  videoId="AzV3EA-1-yM"
  autoPlay={true}
  onVideoEnd={() => console.log("Video ended")}
  className="rounded-lg"
  mute={false}
  maintainAspectRatio={true}
  minHeight="240px"
/>
`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 