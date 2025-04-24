"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, ThumbsUp, Search, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"

interface VideoItem {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  likes: string
  category: string
  tags: string[]
  url: string
}

export function NutritionVideos() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  const nutritionVideos: VideoItem[] = [
    {
      id: "1",
      title: "The Best Science-Based Diet for Fat Loss",
      description: "Dr. Mike explains the science behind effective fat loss diets and provides practical advice.",
      thumbnail: "https://i.ytimg.com/vi/7FM9VAH_EXw/maxresdefault.jpg",
      duration: "10:29",
      views: "2.8M",
      likes: "112K",
      category: "education",
      tags: ["weight-loss", "science", "intermediate"],
      url: "https://www.youtube.com/watch?v=7FM9VAH_EXw",
    },
    {
      id: "2",
      title: "15 Healthy Food Swaps",
      description: "Simple food swaps to make your diet healthier without sacrificing taste.",
      thumbnail: "https://i.ytimg.com/vi/fsPxj2h8Aas/maxresdefault.jpg",
      duration: "10:33",
      views: "1.2M",
      likes: "45K",
      category: "tips",
      tags: ["food-swaps", "beginner", "healthy-eating"],
      url: "https://www.youtube.com/watch?v=fsPxj2h8Aas",
    },
    {
      id: "3",
      title: "What I Eat In A Day | Healthy Meal Ideas",
      description: "A full day of healthy, balanced meals with easy recipes you can make at home.",
      thumbnail: "https://i.ytimg.com/vi/aMYZJxrxMaQ/maxresdefault.jpg",
      duration: "13:05",
      views: "3.5M",
      likes: "187K",
      category: "recipes",
      tags: ["meal-ideas", "beginner", "recipes"],
      url: "https://www.youtube.com/watch?v=aMYZJxrxMaQ",
    },
    {
      id: "4",
      title: "The Perfect Meal Prep for Muscle Building & Fat Loss",
      description: "Learn how to meal prep for the entire week to support your fitness goals.",
      thumbnail: "https://i.ytimg.com/vi/WTq87JB3YFM/maxresdefault.jpg",
      duration: "13:53",
      views: "8.1M",
      likes: "298K",
      category: "meal-prep",
      tags: ["muscle-building", "meal-prep", "advanced"],
      url: "https://www.youtube.com/watch?v=WTq87JB3YFM",
    },
    {
      id: "5",
      title: "How to Calculate Your Macros for Fat Loss",
      description: "A step-by-step guide to calculating your macronutrient needs for effective fat loss.",
      thumbnail: "https://i.ytimg.com/vi/GQJ0Z0DRumg/maxresdefault.jpg",
      duration: "10:45",
      views: "1.7M",
      likes: "89K",
      category: "education",
      tags: ["macros", "fat-loss", "intermediate"],
      url: "https://www.youtube.com/watch?v=GQJ0Z0DRumg",
    },
    {
      id: "6",
      title: "5 High Protein Breakfasts for Building Muscle",
      description: "Start your day with these protein-packed breakfast recipes to support muscle growth.",
      thumbnail: "https://i.ytimg.com/vi/qBK0Pc7h3Zg/maxresdefault.jpg",
      duration: "8:17",
      views: "4.2M",
      likes: "167K",
      category: "recipes",
      tags: ["breakfast", "protein", "muscle-building"],
      url: "https://www.youtube.com/watch?v=qBK0Pc7h3Zg",
    },
    {
      id: "7",
      title: "Nutrition Myths Debunked by Science",
      description: "Evidence-based analysis of common nutrition myths that might be holding you back.",
      thumbnail: "https://i.ytimg.com/vi/FX58PyQwrcI/maxresdefault.jpg",
      duration: "22:18",
      views: "1.8M",
      likes: "87K",
      category: "education",
      tags: ["myths", "science", "advanced"],
      url: "https://www.youtube.com/watch?v=FX58PyQwrcI",
    },
    {
      id: "8",
      title: "Budget Grocery Shopping Guide: Eat Healthy for Less",
      description: "Learn how to shop for nutritious foods without breaking the bank.",
      thumbnail: "https://i.ytimg.com/vi/WgtHWXYDzK0/maxresdefault.jpg",
      duration: "14:09",
      views: "2.3M",
      likes: "115K",
      category: "tips",
      tags: ["budget", "shopping", "beginner"],
      url: "https://www.youtube.com/watch?v=WgtHWXYDzK0",
    },
    {
      id: "9",
      title: "What to Eat Before and After a Workout",
      description: "Optimize your workout performance and recovery with proper pre and post-workout nutrition.",
      thumbnail: "https://i.ytimg.com/vi/7s7_Dvj-fZY/maxresdefault.jpg",
      duration: "18:32",
      views: "3.1M",
      likes: "142K",
      category: "fitness",
      tags: ["workout-nutrition", "recovery", "intermediate"],
      url: "https://www.youtube.com/watch?v=7s7_Dvj-fZY",
    },
    {
      id: "10",
      title: "Healthy Meal Prep for the Week",
      description: "Prepare a week's worth of healthy, balanced meals in just a couple of hours.",
      thumbnail: "https://i.ytimg.com/vi/j7JbxkOmIcU/maxresdefault.jpg",
      duration: "16:45",
      views: "5.7M",
      likes: "278K",
      category: "meal-prep",
      tags: ["meal-prep", "time-saving", "beginner"],
      url: "https://www.youtube.com/watch?v=j7JbxkOmIcU",
    },
    {
      id: "11",
      title: "Complete Guide to Plant-Based Protein",
      description: "Everything you need to know about getting enough protein on a plant-based diet.",
      thumbnail: "https://i.ytimg.com/vi/K36mImo2-j8/maxresdefault.jpg",
      duration: "25:12",
      views: "1.9M",
      likes: "94K",
      category: "education",
      tags: ["plant-based", "protein", "vegan"],
      url: "https://www.youtube.com/watch?v=K36mImo2-j8",
    },
    {
      id: "12",
      title: "The Importance of Hydration for Performance",
      description: "Learn how proper hydration affects your workout performance and overall health.",
      thumbnail: "https://i.ytimg.com/vi/9iMGFqMmUFs/maxresdefault.jpg",
      duration: "11:47",
      views: "1.3M",
      likes: "67K",
      category: "education",
      tags: ["hydration", "performance", "beginner"],
      url: "https://www.youtube.com/watch?v=9iMGFqMmUFs",
    },
  ]

  const allTags = Array.from(new Set(nutritionVideos.flatMap((video) => video.tags)))

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredVideos = nutritionVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => video.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const getVideoIdFromUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
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

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>

          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag.replace("-", " ")}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="meal-prep">Meal Prep</TabsTrigger>
          <TabsTrigger value="fitness">Fitness Nutrition</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
        </TabsList>

        {["all", "recipes", "education", "meal-prep", "fitness", "tips"].map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos
                .filter((video) => category === "all" || video.category === category)
                .map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="relative aspect-video cursor-pointer" onClick={() => setSelectedVideo(video)}>
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition-transform hover:scale-110">
                          <Play className="h-6 w-6 fill-current" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 text-xs text-white rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base line-clamp-1">{video.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="px-4 py-2 pt-0 flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {video.duration}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                        {video.likes}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5">
                            {tag.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              {filteredVideos.filter((video) => category === "all" || video.category === category).length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No videos found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-md">
              {selectedVideo && (
                <YouTubeVideoPlayer
                  videoId={getVideoIdFromUrl(selectedVideo.url)}
                  autoPlay={true}
                  maintainAspectRatio={true}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{selectedVideo?.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedVideo?.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

