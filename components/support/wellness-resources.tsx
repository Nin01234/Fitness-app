"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/components/notifications/notification-provider"
import { 
  Search, 
  Heart, 
  Brain, 
  Leaf, 
  Moon, 
  Clock, 
  BookOpen, 
  Play, 
  Bookmark, 
  ThumbsUp, 
  Share2, 
  ExternalLink, 
  Filter,
  Volume2
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export function WellnessResources() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResource, setSelectedResource] = useState<any | null>(null)
  const { addNotification } = useNotifications()
  const [activeCategory, setActiveCategory] = useState("all")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Note: Audio files are placeholders and will not actually play in this demo.
  // In a production environment, actual audio files would be provided.
  
  // Use a ref to track the interval ID for progress updates
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const meditationResources = [
    {
      id: "meditation-1",
      title: "Guided Morning Meditation for Clarity",
      instructor: "Sarah Wilson",
      role: "Meditation Coach",
      duration: "10:15",
      listens: "12.4K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/guided-meditation-morning.mp3",
      description: "Start your day with mental clarity and positive intentions through this guided meditation practice.",
      category: "meditation",
      tags: ["Morning Routine", "Clarity", "Beginner"],
    },
    {
      id: "meditation-2",
      title: "Body Scan Meditation for Deep Relaxation",
      instructor: "Dr. Michael Chen",
      role: "Mindfulness Researcher",
      duration: "15:32",
      listens: "8.7K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/body-scan-meditation.mp3",
      description: "A progressive body scan meditation to release tension and enter a state of deep relaxation and awareness.",
      category: "meditation",
      tags: ["Relaxation", "Body Scan", "Evening"],
    },
    {
      id: "meditation-3",
      title: "Loving-Kindness Meditation Practice",
      instructor: "Emma Thompson",
      role: "Mindfulness Teacher",
      duration: "12:45",
      listens: "5.9K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/loving-kindness.mp3",
      description: "Develop compassion for yourself and others with this heart-centered loving-kindness meditation.",
      category: "meditation",
      tags: ["Compassion", "Heart-Centered", "All Levels"],
    },
  ]

  const breathingResources = [
    {
      id: "breathing-1",
      title: "Box Breathing for Stress Relief",
      instructor: "James Miller",
      role: "Respiratory Therapist",
      duration: "8:20",
      listens: "15.2K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/box-breathing.mp3",
      description: "Learn the box breathing technique used by Navy SEALs to calm your nervous system and reduce stress.",
      category: "breathing",
      tags: ["Stress Relief", "Focus", "Quick Practice"],
    },
    {
      id: "breathing-2",
      title: "4-7-8 Breathing for Better Sleep",
      instructor: "Dr. Anita Patel",
      role: "Sleep Specialist",
      duration: "9:15",
      listens: "10.8K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/4-7-8-breathing.mp3",
      description: "A guided practice of the 4-7-8 breathing technique to help you fall asleep faster and sleep more deeply.",
      category: "breathing",
      tags: ["Sleep", "Evening", "Relaxation"],
    },
    {
      id: "breathing-3",
      title: "Energizing Breath Work",
      instructor: "David Rodriguez",
      role: "Yoga Instructor",
      duration: "7:45",
      listens: "6.3K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/energizing-breath.mp3",
      description: "Revitalize your body and mind with energizing breathing exercises perfect for morning or mid-day slumps.",
      category: "breathing",
      tags: ["Energy", "Morning", "Revitalize"],
    },
  ]

  const sleepResources = [
    {
      id: "sleep-1",
      title: "Deep Sleep Meditation with Ocean Waves",
      instructor: "Lisa Johnson",
      role: "Sleep Coach",
      duration: "30:15",
      listens: "22.5K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/ocean-sleep-meditation.mp3",
      description: "Fall asleep quickly with this guided meditation accompanied by calming ocean wave sounds.",
      category: "sleep",
      tags: ["Deep Sleep", "Ocean Sounds", "Evening"],
    },
    {
      id: "sleep-2",
      title: "Bedtime Body Relaxation Journey",
      instructor: "Mark Davis",
      role: "Hypnotherapist",
      duration: "25:10",
      listens: "14.7K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/bedtime-relaxation.mp3",
      description: "A progressive relaxation journey designed to prepare your body and mind for restorative sleep.",
      category: "sleep",
      tags: ["Bedtime", "Relaxation", "Progressive"],
    },
    {
      id: "sleep-3",
      title: "Night Time Anxiety Relief",
      instructor: "Dr. Samantha Lee",
      role: "Clinical Psychologist",
      duration: "18:30",
      listens: "11.2K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/night-anxiety-relief.mp3",
      description: "Calm racing thoughts and nighttime anxiety with this guided meditation specifically designed for worry reduction.",
      category: "sleep",
      tags: ["Anxiety", "Insomnia", "Calming"],
    },
  ]

  const mindfulnessResources = [
    {
      id: "mindfulness-1",
      title: "5-Minute Mindfulness for Busy Days",
      instructor: "Robert Chen",
      role: "Mindfulness Coach",
      duration: "5:15",
      listens: "19.8K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/5-min-mindfulness.mp3",
      description: "A quick mindfulness practice you can do anywhere to center yourself during busy or stressful days.",
      category: "mindfulness",
      tags: ["Quick", "Stress Relief", "Beginner"],
    },
    {
      id: "mindfulness-2",
      title: "Mindful Walking Practice",
      instructor: "Tara Bennett",
      role: "Mindfulness Teacher",
      duration: "12:40",
      listens: "7.9K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/mindful-walking.mp3",
      description: "Transform your daily walk into a mindful practice with this guided audio instruction.",
      category: "mindfulness",
      tags: ["Walking", "Outdoor", "Movement"],
    },
    {
      id: "mindfulness-3",
      title: "Mindful Eating Guidance",
      instructor: "Natalie Wong",
      role: "Nutritionist & Mindfulness Expert",
      duration: "14:25",
      listens: "6.8K",
      thumbnail: "/placeholder.svg",
      audioSrc: "/audio/mindful-eating.mp3",
      description: "Learn to eat mindfully to improve digestion, satisfaction, and your relationship with food.",
      category: "mindfulness",
      tags: ["Eating", "Nutrition", "Awareness"],
    },
  ]

  const allResources = [...meditationResources, ...breathingResources, ...sleepResources, ...mindfulnessResources]

  const getFilteredResources = () => {
    let resources = allResources
    
    // Filter by category if not "all"
    if (activeCategory !== "all") {
      resources = resources.filter(resource => resource.category === activeCategory)
    }
    
    // Apply search query if present
    if (searchQuery) {
      resources = resources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    
    return resources
  }
  
  const filteredResources = getFilteredResources()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "meditation":
        return <Brain className="h-4 w-4 mr-2" />
      case "breathing":
        return <Leaf className="h-4 w-4 mr-2" />
      case "sleep":
        return <Moon className="h-4 w-4 mr-2" />
      case "mindfulness":
        return <Heart className="h-4 w-4 mr-2" />
      default:
        return <BookOpen className="h-4 w-4 mr-2" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "meditation":
        return "Meditation"
      case "breathing":
        return "Breathing"
      case "sleep":
        return "Sleep"
      case "mindfulness":
        return "Mindfulness"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    
    // Simulate progress updates when playing
    if (!isPlaying) {
      // Start a new interval for progress updates
      const newInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 300)
      
      // Store the interval ID in our ref
      intervalRef.current = newInterval
    } else {
      // Clear the interval when paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const renderResourceCard = (resource: any) => (
    <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        <div 
          className="relative h-48 bg-muted cursor-pointer overflow-hidden rounded-t-lg" 
          onClick={() => setSelectedResource(resource)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setSelectedResource(resource)
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Listen to ${resource.title}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${resource.thumbnail || "/placeholder.svg"})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex justify-between">
              <Badge className="bg-primary text-white border-none text-xs py-0 px-2">
                {getCategoryIcon(resource.category)}
                {getCategoryLabel(resource.category)}
              </Badge>
              <Badge variant="outline" className="bg-black/50 text-white border-none">
                <Clock className="h-3 w-3 mr-1" />
                {resource.duration}
              </Badge>
            </div>
            <div className="mt-auto">
              <h3 className="text-white font-medium text-lg mb-1">{resource.title}</h3>
              <div className="flex items-center text-white/90 text-sm">
                <span>{resource.instructor}</span>
                <span className="mx-2">•</span>
                <span>{resource.listens} listens</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full h-12 w-12 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedResource(resource)
                setIsPlaying(true)
              }}
            >
              <Play className="h-6 w-6 text-primary" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            addNotification({
              title: "Resource Saved",
              message: `"${resource.title}" has been saved to your library.`,
              type: "success"
            })
          }}
          aria-label={`Save ${resource.title} to your library`}
        >
          <Bookmark className="h-4 w-4 mr-1" aria-hidden="true" />
          Save
        </Button>
        <Button 
          size="sm" 
          onClick={() => {
            setSelectedResource(resource)
            setIsPlaying(true)
          }}
          variant="default"
          aria-label={`Listen to ${resource.title} now`}
        >
          <Volume2 className="h-4 w-4 mr-1" />
          Listen
        </Button>
      </CardFooter>
    </Card>
  )

  // Cleanup effect to handle unmounting (e.g., when changing tabs)
  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8 rounded-full border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-b pb-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All Resources</TabsTrigger>
            <TabsTrigger value="meditation" className="rounded-full data-[state=active]:bg-white">Meditation</TabsTrigger>
            <TabsTrigger value="breathing" className="rounded-full data-[state=active]:bg-white">Breathing</TabsTrigger>
            <TabsTrigger value="sleep" className="rounded-full data-[state=active]:bg-white">Sleep</TabsTrigger>
            <TabsTrigger value="mindfulness" className="rounded-full data-[state=active]:bg-white">Mindfulness</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{filteredResources.length} resources</span>
        </div>
      </div>

      <div className="mt-6">
        {filteredResources.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResources.map(renderResourceCard)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any resources matching your search criteria. Try adjusting your search or browse a different category.
            </p>
          </div>
        )}
      </div>

      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={(open) => {
          if (!open) {
            // Clear the interval when the dialog is closed
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setSelectedResource(null)
            setIsPlaying(false)
            setProgress(0)
          }
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedResource.title}</DialogTitle>
              <DialogDescription>
                {selectedResource.instructor}, {selectedResource.role}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="rounded-lg overflow-hidden h-48 bg-gradient-to-r from-primary/20 to-primary/10 flex flex-col items-center justify-center">
                <Button 
                  className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? 
                    <span className="h-5 w-5 rounded bg-white block"></span> :
                    <Play className="h-8 w-8 text-white ml-1" />
                  }
                </Button>
                
                <div className="w-full px-6 mt-6">
                  <Progress value={progress} className="h-2 w-full" />
                  
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{formatTime(selectedResource.duration, progress)}</span>
                    <span>{selectedResource.duration}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedResource.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <h3 className="font-medium w-full mb-1">Tags</h3>
                {selectedResource.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    addNotification({
                      title: "Resource Saved",
                      message: `"${selectedResource.title}" has been saved to your library.`,
                      type: "success"
                    })
                  }}
                  aria-label={`Save ${selectedResource.title} to your library`}
                >
                  <Bookmark className="h-4 w-4 mr-2" aria-hidden="true" />
                  Save to Library
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    addNotification({
                      title: "Resource Shared",
                      message: `You've shared "${selectedResource.title}" with your friends.`,
                      type: "success"
                    })
                  }}
                  aria-label={`Share ${selectedResource.title}`}
                >
                  <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Helper function to format time based on progress
function formatTime(duration: string, progress: number) {
  const [minutes, seconds] = duration.split(':').map(Number)
  const totalSeconds = minutes * 60 + seconds
  const currentSeconds = Math.floor(totalSeconds * (progress / 100))
  
  const currentMinutes = Math.floor(currentSeconds / 60)
  const remainingSeconds = currentSeconds % 60
  
  return `${currentMinutes}:${remainingSeconds.toString().padStart(2, '0')}`
} 