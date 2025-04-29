"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, Clock, Play, Star, Filter, Tag, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNotifications } from "@/components/notifications/notification-provider"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  source: "youtube" | "vimeo" | "custom"
  url: string
  category: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced" | "all levels"
  rating: number
  views: number
}

export function EnhancedVideoLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [compactMode, setCompactMode] = useState(false)
  const [videoQuality, setVideoQuality] = useState<"low" | "medium" | "high">("medium")
  const [autoPlay, setAutoPlay] = useState(true)

  const videos: Video[] = [
    // Original videos
    {
      id: "1",
      title: "Getting Started with FitLife",
      description: "Learn the basics of using the FitLife app to track your fitness journey.",
      thumbnail: "https://i.ytimg.com/vi/AzV3EA-1-yM/maxresdefault.jpg",
      duration: "4:25",
      source: "youtube",
      url: "https://www.youtube.com/embed/AzV3EA-1-yM",
      category: "basics",
      tags: ["tutorial", "beginner", "app"],
      difficulty: "beginner",
      rating: 4.8,
      views: 15420,
    },
    {
      id: "2",
      title: "Effective Workout Tracking",
      description: "Master the workout tracking features to optimize your training.",
      thumbnail: "https://i.ytimg.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
      duration: "6:12",
      source: "youtube",
      url: "https://www.youtube.com/embed/ml6cT4AZdqI",
      category: "workouts",
      tags: ["tracking", "progress", "data"],
      difficulty: "intermediate",
      rating: 4.6,
      views: 8932,
    },
    {
      id: "3",
      title: "Nutrition Tracking Essentials",
      description: "Learn how to track your nutrition and understand macros for better results.",
      thumbnail: "https://i.ytimg.com/vi/UItWltVZZmE/maxresdefault.jpg",
      duration: "8:45",
      source: "youtube",
      url: "https://www.youtube.com/embed/UItWltVZZmE",
      category: "nutrition",
      tags: ["nutrition", "macros", "diet"],
      difficulty: "beginner",
      rating: 4.9,
      views: 12045,
    },
    {
      id: "4",
      title: "Setting Achievable Fitness Goals",
      description: "Learn how to set SMART goals that keep you motivated and on track.",
      thumbnail: "https://i.ytimg.com/vi/BGXGdUj93BM/maxresdefault.jpg",
      duration: "5:30",
      source: "youtube",
      url: "https://www.youtube.com/embed/BGXGdUj93BM",
      category: "goals",
      tags: ["goals", "motivation", "planning"],
      difficulty: "all levels",
      rating: 4.7,
      views: 7865,
    },
    {
      id: "5",
      title: "Progress Tracking and Analytics",
      description: "Make the most of FitLife's progress tracking features to visualize your journey.",
      thumbnail: "https://i.ytimg.com/vi/Eml2xnoLpYE/maxresdefault.jpg",
      duration: "7:15",
      source: "youtube",
      url: "https://www.youtube.com/embed/Eml2xnoLpYE",
      category: "progress",
      tags: ["analytics", "data", "visualization"],
      difficulty: "intermediate",
      rating: 4.5,
      views: 6543,
    },
    // New videos
    {
      id: "9",
      title: "Full Body HIIT Workout - 30 Minutes",
      description: "High-intensity interval training to burn calories and build strength.",
      thumbnail: "https://i.ytimg.com/vi/Qvf9kgkPjs4/maxresdefault.jpg",
      duration: "30:15",
      source: "youtube",
      url: "https://www.youtube.com/embed/Qvf9kgkPjs4",
      category: "workouts",
      tags: ["hiit", "cardio", "full body"],
      difficulty: "intermediate",
      rating: 4.9,
      views: 245678,
    },
    {
      id: "10",
      title: "Beginner's Guide to Meal Prep",
      description: "Learn how to prepare healthy meals for the entire week in just 2 hours.",
      thumbnail: "https://i.ytimg.com/vi/OWERjHZbfmY/maxresdefault.jpg",
      duration: "15:42",
      source: "youtube",
      url: "https://www.youtube.com/embed/OWERjHZbfmY",
      category: "nutrition",
      tags: ["meal prep", "cooking", "time-saving"],
      difficulty: "beginner",
      rating: 4.8,
      views: 189543,
    },
    {
      id: "11",
      title: "Understanding Macronutrients",
      description: "Detailed explanation of proteins, carbs, and fats and how they affect your body.",
      thumbnail: "https://i.ytimg.com/vi/zdjWnvbaUZo/maxresdefault.jpg",
      duration: "12:38",
      source: "youtube",
      url: "https://www.youtube.com/embed/zdjWnvbaUZo",
      category: "nutrition",
      tags: ["macros", "nutrition science", "diet"],
      difficulty: "intermediate",
      rating: 4.7,
      views: 132456,
    },
    {
      id: "12",
      title: "5 Minute Ab Workout - No Equipment",
      description: "Quick and effective ab exercises you can do anywhere.",
      thumbnail: "https://i.ytimg.com/vi/040baVswZ_o/maxresdefault.jpg",
      duration: "5:22",
      source: "youtube",
      url: "https://www.youtube.com/embed/040baVswZ_o",
      category: "workouts",
      tags: ["abs", "quick workout", "no equipment"],
      difficulty: "all levels",
      rating: 4.6,
      views: 321654,
    },
    {
      id: "13",
      title: "Yoga for Beginners - Morning Routine",
      description: "Start your day with this energizing yoga flow for beginners.",
      thumbnail: "https://i.ytimg.com/vi/9iMGFqMmUFs/maxresdefault.jpg",
      duration: "20:15",
      source: "youtube",
      url: "https://www.youtube.com/embed/9iMGFqMmUFs",
      category: "workouts",
      tags: ["yoga", "morning routine", "flexibility"],
      difficulty: "beginner",
      rating: 4.9,
      views: 187432,
    },
    {
      id: "14",
      title: "How to Track Progress Without a Scale",
      description: "Alternative methods to track your fitness progress beyond weight.",
      thumbnail: "https://i.ytimg.com/vi/lwOPaNMTGh8/maxresdefault.jpg",
      duration: "8:47",
      source: "youtube",
      url: "https://www.youtube.com/embed/lwOPaNMTGh8",
      category: "progress",
      tags: ["body composition", "measurements", "progress photos"],
      difficulty: "all levels",
      rating: 4.8,
      views: 98765,
    },
    {
      id: "15",
      title: "Healthy Smoothie Recipes for Energy",
      description: "Quick and nutritious smoothie recipes to fuel your workouts.",
      thumbnail: "https://i.ytimg.com/vi/wIynl3at0Rs/maxresdefault.jpg",
      duration: "10:32",
      source: "youtube",
      url: "https://www.youtube.com/embed/wIynl3at0Rs",
      category: "nutrition",
      tags: ["smoothies", "recipes", "energy"],
      difficulty: "beginner",
      rating: 4.7,
      views: 145678,
    },
    {
      id: "16",
      title: "Advanced Strength Training Techniques",
      description: "Take your strength training to the next level with these advanced techniques.",
      thumbnail: "https://i.ytimg.com/vi/lumimB_aa7M/maxresdefault.jpg",
      duration: "18:24",
      source: "youtube",
      url: "https://www.youtube.com/embed/lumimB_aa7M",
      category: "workouts",
      tags: ["strength", "advanced", "techniques"],
      difficulty: "advanced",
      rating: 4.9,
      views: 87654,
    },
  ]

  const categories = [
    { id: "all", name: "All Videos" },
    { id: "basics", name: "Getting Started" },
    { id: "workouts", name: "Workouts" },
    { id: "nutrition", name: "Nutrition" },
    { id: "goals", name: "Goals" },
    { id: "progress", name: "Progress" },
  ]

  const allTags = Array.from(new Set(videos.flatMap((video) => video.tags)))
  const difficulties = ["beginner", "intermediate", "advanced", "all levels"]

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || video.category === activeCategory

    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(video.difficulty)

    const matchesTags = selectedTags.length === 0 || video.tags.some((tag) => selectedTags.includes(tag))

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags
  })

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty],
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const getVideoUrl = (video: Video, quality: "low" | "medium" | "high") => {
    if (video.source !== "youtube") return video.url
    
    // YouTube URL with quality parameters
    const baseUrl = video.url.split("?")[0]
    const qualityParams = {
      low: "?rel=0&modestbranding=1&vq=small",
      medium: "?rel=0&modestbranding=1&vq=medium",
      high: "?rel=0&modestbranding=1&vq=hd720"
    }
    
    return `${baseUrl}${qualityParams[quality]}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search videos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Difficulty
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {difficulties.map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={selectedDifficulties.includes(difficulty)}
                  onCheckedChange={() => toggleDifficulty(difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
              {allTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 flex w-full flex-wrap">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4 bg-muted/30 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-lg font-medium">Showing {filteredVideos.length} videos</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCompactMode(!compactMode)}
                className="flex items-center gap-1 text-xs md:text-sm h-8"
              >
                {compactMode ? "Regular View" : "Compact View"}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs md:text-sm h-8">
                    Quality: {videoQuality}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={videoQuality === "low"}
                    onCheckedChange={() => setVideoQuality("low")}
                  >
                    Low (save data)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={videoQuality === "medium"}
                    onCheckedChange={() => setVideoQuality("medium")}
                  >
                    Medium (recommended)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={videoQuality === "high"}
                    onCheckedChange={() => setVideoQuality("high")}
                  >
                    High (HD)
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenuCheckboxItem
                checked={autoPlay}
                onCheckedChange={() => setAutoPlay(!autoPlay)}
                className="flex items-center gap-1 text-xs md:text-sm"
              >
                AutoPlay
              </DropdownMenuCheckboxItem>
            </div>
          </div>
          {filteredVideos.length > 0 ? (
            <div className={`grid gap-4 ${compactMode ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className={`overflow-hidden transition-all hover:shadow-md ${compactMode ? 'max-h-[280px]' : ''}`}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className={`aspect-video w-full ${compactMode ? 'max-h-40' : ''}`}>
                        <YouTubeVideoPlayer
                          videoId={video.id}
                          autoPlay={true}
                          mute={true}
                          maintainAspectRatio={true}
                          minHeight="200px"
                          className="w-full h-full"
                        />
                      </div>
                      <div className={`p-3 ${compactMode ? 'p-2' : ''}`}>
                        <div className="flex items-start justify-between">
                          <h3 className={`font-medium leading-tight ${compactMode ? 'text-sm line-clamp-1' : 'line-clamp-2'}`}>{video.title}</h3>
                          <Badge
                            variant={
                              video.difficulty === "advanced"
                                ? "destructive"
                                : video.difficulty === "intermediate"
                                  ? "default"
                                  : "secondary"
                            }
                            className="ml-2 shrink-0"
                          >
                            {video.difficulty}
                          </Badge>
                        </div>
                        <p className={`text-sm text-muted-foreground mt-1 ${compactMode ? 'line-clamp-1' : 'line-clamp-2'}`}>{video.description}</p>
                        
                        {!compactMode && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {video.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No videos found matching your search criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                  setSelectedDifficulties([])
                  setSelectedTags([])
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 top-0 md:-right-12 text-white hover:bg-white/20 z-10"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <YouTubeVideoPlayer
                videoId={selectedVideo.id}
                autoPlay={true}
                mute={false}
                maintainAspectRatio={true}
                minHeight="240px"
                className="w-full h-full"
              />
            </div>

            <div className="mt-4 rounded-lg bg-background p-4 border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge
                      variant={
                        selectedVideo.difficulty === "advanced"
                          ? "destructive"
                          : selectedVideo.difficulty === "intermediate"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {selectedVideo.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{selectedVideo.views.toLocaleString()} views</span>
                    <div className="flex items-center text-amber-500 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{selectedVideo.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground">{selectedVideo.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedVideo.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1 shrink-0 ml-4" asChild>
                  <a href={selectedVideo.url.replace("embed/", "watch?v=")} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> Watch on YouTube
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

