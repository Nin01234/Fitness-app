"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/components/notifications/notification-provider"
import { Search, Clock, ThumbsUp, Bookmark, Share2, ExternalLink, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"

export function VideoLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
  const { addNotification } = useNotifications()
  const [activeCategory, setActiveCategory] = useState("all")

  const workoutVideos = [
    {
      id: "workout-1",
      title: "20 MIN FULL BODY WORKOUT - Beginner Version // No Equipment",
      channel: "MadFit",
      views: "27M",
      duration: "20:08",
      thumbnail: "https://img.youtube.com/vi/AzV3EA-1-yM/maxresdefault.jpg",
      videoId: "AzV3EA-1-yM",
      description:
        "A 20-minute full body workout that's beginner-friendly with zero equipment needed. Perfect for those new to fitness.",
      category: "workout",
      tags: ["Beginner", "No Equipment", "Full Body"],
    },
    {
      id: "workout-2",
      title: "30-Minute HIIT Cardio Workout with Warm Up - No Equipment at Home",
      channel: "SELF",
      views: "19M",
      duration: "36:22",
      thumbnail: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
      videoId: "ml6cT4AZdqI",
      description:
        "This HIIT workout will help you burn calories and improve cardiovascular health, no equipment needed.",
      category: "workout",
      tags: ["HIIT", "Cardio", "No Equipment"],
    },
    {
      id: "workout-3",
      title: "BEST 20 MINUTE FULL BODY WORKOUT FOR MUSCLE GROWTH (DUMBBELLS ONLY)",
      channel: "Fraser Wilson",
      views: "5.2M",
      duration: "20:05",
      thumbnail: "https://img.youtube.com/vi/UItWltVZZmE/maxresdefault.jpg",
      videoId: "UItWltVZZmE",
      description:
        "Build muscle in all major muscle groups with this efficient 20-minute dumbbell workout routine.",
      category: "workout",
      tags: ["Muscle Growth", "Dumbbells", "Full Body"],
    },
    {
      id: "workout-4",
      title: "35 Min Standing Abs & Low Impact Cardio Workout - No Jumping - No Repeat - No Equipment",
      channel: "Grow with Jo",
      views: "11.3M",
      duration: "35:24",
      thumbnail: "https://img.youtube.com/vi/BGXGdUj93BM/maxresdefault.jpg",
      videoId: "BGXGdUj93BM",
      description:
        "Low-impact standing workout focusing on the abs and cardio without stress on the knees or joints.",
      category: "workout",
      tags: ["Low Impact", "Abs", "Cardio"],
    }
  ]

  const nutritionVideos = [
    {
      id: "nutrition-1",
      title: "The Best Science-Based Diet to Build Lean Muscle (ALL MEALS SHOWN!)",
      channel: "Jeremy Ethier",
      views: "8.4M",
      duration: "13:31",
      thumbnail: "https://img.youtube.com/vi/Eml2xnoLpYE/maxresdefault.jpg",
      videoId: "Eml2xnoLpYE",
      description:
        "Evidence-based nutrition advice for building lean muscle with real meal examples and macro breakdowns.",
      category: "nutrition",
      tags: ["Muscle Building", "Meal Plan", "Science-Based"],
    },
    {
      id: "nutrition-2",
      title: "How to Build a Perfect Meal with Dr. Mike",
      channel: "Gravity Transformation",
      views: "2.1M",
      duration: "11:22",
      thumbnail: "https://img.youtube.com/vi/Qvf9kgkPjs4/maxresdefault.jpg",
      videoId: "Qvf9kgkPjs4",
      description: "Dr. Mike explains how to structure a healthy, balanced meal for optimal nutrition and satiety.",
      category: "nutrition",
      tags: ["Meal Planning", "Balanced Diet", "Expert Advice"],
    },
    {
      id: "nutrition-3",
      title: "7 Nutrition Tips for Muscle Gain and Fat Loss",
      channel: "Picture Fit",
      views: "2.8M",
      duration: "7:27",
      thumbnail: "https://img.youtube.com/vi/OWERjHZbfmY/maxresdefault.jpg",
      videoId: "OWERjHZbfmY",
      description:
        "Practical nutrition strategies to simultaneously build muscle and lose fat with evidence-based recommendations.",
      category: "nutrition",
      tags: ["Muscle Gain", "Fat Loss", "Nutrition Tips"],
    },
    {
      id: "nutrition-4",
      title: "Eat This for Maximum Energy",
      channel: "Thomas DeLauer",
      views: "4.6M",
      duration: "9:56",
      thumbnail: "https://img.youtube.com/vi/zdjWnvbaUZo/maxresdefault.jpg",
      videoId: "zdjWnvbaUZo",
      description:
        "Learn which foods provide sustainable energy throughout the day and how to time your meals for optimal performance.",
      category: "nutrition",
      tags: ["Energy", "Food Timing", "Performance"],
    }
  ]

  const yogaVideos = [
    {
      id: "yoga-1",
      title: "Total Body Yoga - Deep Stretch | 20 Min Yoga With Adriene",
      channel: "Yoga With Adriene",
      views: "22.1M",
      duration: "23:10",
      thumbnail: "https://img.youtube.com/vi/040baVswZ_o/maxresdefault.jpg",
      videoId: "040baVswZ_o",
      description:
        "A gentle 20-minute deep stretch yoga practice to release tension and create space in the body.",
      category: "yoga",
      tags: ["Deep Stretch", "Relaxation", "Full Body"],
    },
    {
      id: "yoga-2",
      title: "Yoga For Complete Beginners - 20 Minute Home Yoga Workout!",
      channel: "Yoga With Adriene",
      views: "48.4M",
      duration: "20:17",
      thumbnail: "https://img.youtube.com/vi/9iMGFqMmUFs/maxresdefault.jpg",
      videoId: "9iMGFqMmUFs",
      description:
        "Perfect yoga routine for absolute beginners with gentle instruction and basic poses to build confidence.",
      category: "yoga",
      tags: ["Beginner", "Basic Poses", "At Home"],
    },
    {
      id: "yoga-3",
      title: "Power Yoga Workout | Strength & Flexibility | 25 Minute Flow",
      channel: "Breathe and Flow",
      views: "5.9M",
      duration: "25:03",
      thumbnail: "https://img.youtube.com/vi/lwOPaNMTGh8/maxresdefault.jpg",
      videoId: "lwOPaNMTGh8",
      description:
        "Challenging power yoga flow that combines strength training and flexibility to build functional fitness.",
      category: "yoga",
      tags: ["Power Yoga", "Strength", "Intermediate"],
    },
    {
      id: "yoga-4",
      title: "Full Body Flow | 40 Min. Yoga Practice | Yoga With Tim",
      channel: "Yoga With Tim",
      views: "2.4M",
      duration: "41:48",
      thumbnail: "https://img.youtube.com/vi/wIynl3at0Rs/maxresdefault.jpg",
      videoId: "wIynl3at0Rs",
      description:
        "Complete yoga sequence targeting all major muscle groups with a balanced mix of strength and flexibility.",
      category: "yoga",
      tags: ["Full Body", "Vinyasa", "Intermediate"],
    }
  ]

  const recoveryVideos = [
    {
      id: "recovery-1",
      title: "Fix Your Mobility For Squats & Hip Pain | Quick Mobility Routine",
      channel: "Squat University",
      views: "1.3M",
      duration: "11:45",
      thumbnail: "https://img.youtube.com/vi/lumimB_aa7M/maxresdefault.jpg",
      videoId: "lumimB_aa7M",
      description:
        "Targeted mobility routine to address hip pain and improve squatting mechanics with expert guidance.",
      category: "recovery",
      tags: ["Mobility", "Hip Pain", "Squats"],
    },
    {
      id: "recovery-2",
      title: "The BEST Foam Rolling Routine for YOUR ENTIRE BODY | Science Explained",
      channel: "Jeremy Ethier",
      views: "3.1M",
      duration: "12:32",
      thumbnail: "https://img.youtube.com/vi/-hSma-BRzoo/maxresdefault.jpg",
      videoId: "-hSma-BRzoo",
      description:
        "Evidence-based foam rolling techniques for every major muscle group with proper form and timing guidelines.",
      category: "recovery",
      tags: ["Foam Rolling", "Recovery", "Full Body"],
    },
    {
      id: "recovery-3",
      title: "15 Min. Full Body Stretch | Daily Routine for Flexibility, Mobility & Relaxation",
      channel: "MadFit",
      views: "7.8M",
      duration: "15:06",
      thumbnail: "https://img.youtube.com/vi/tGoXCguqnCc/maxresdefault.jpg",
      videoId: "tGoXCguqnCc",
      description:
        "Daily stretching routine to maintain flexibility and mobility, perfect for recovery days or post-workout.",
      category: "recovery",
      tags: ["Stretching", "Flexibility", "Daily Routine"],
    },
    {
      id: "recovery-4",
      title: "How To Fix Rounded Shoulders & Restore Good Posture | 4 Exercises (NO EQUIPMENT)",
      channel: "Daniel Vadnal",
      views: "5.4M",
      duration: "10:24",
      thumbnail: "https://img.youtube.com/vi/XxSgdX7lX6E/maxresdefault.jpg",
      videoId: "XxSgdX7lX6E",
      description:
        "Corrective exercises to address postural issues and rounded shoulders caused by desk work and modern lifestyle.",
      category: "recovery",
      tags: ["Posture", "Shoulder Pain", "Correction"],
    }
  ]

  const allVideos = [...workoutVideos, ...nutritionVideos, ...yogaVideos, ...recoveryVideos]

  const getFilteredVideos = () => {
    let videos = allVideos;
    
    // Filter by category if not "all"
    if (activeCategory !== "all") {
      videos = videos.filter(video => video.category === activeCategory);
    }
    
    // Apply search query if present
    if (searchQuery) {
      videos = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }
    
    return videos;
  }
  
  const filteredVideos = getFilteredVideos();

  const renderVideoCard = (video: any) => (
    <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow border rounded-lg">
      <CardHeader className="p-0">
        <div 
          className="relative aspect-video bg-muted cursor-pointer overflow-hidden rounded-t-lg" 
          onClick={() => setSelectedVideo(video)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedVideo(video);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Watch ${video.title}`}
        >
          <img 
            src={video.thumbnail || "/placeholder.svg"} 
            alt={`Thumbnail for ${video.title}`} 
            className="w-full h-full object-cover transition-transform hover:scale-105" 
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-sm">
            {video.duration}
          </div>
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center opacity-0 hover:opacity-100 transform scale-95 hover:scale-100 transition-all">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[16px] border-l-primary ml-1"></div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3
          className="font-medium line-clamp-2 cursor-pointer hover:text-primary transition-colors text-base"
          onClick={() => setSelectedVideo(video)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedVideo(video);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Watch ${video.title}`}
        >
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <span className="font-medium text-xs">{video.channel}</span>
          <span aria-hidden="true">•</span>
          <span className="text-xs">{video.views} views</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {video.tags.map((tag: string) => (
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
              title: "Video Saved",
              message: `"${video.title}" has been saved to your library.`,
              type: "success"
            })
          }}
          aria-label={`Save ${video.title} to your library`}
        >
          <Bookmark className="h-4 w-4 mr-1" aria-hidden="true" />
          Save
        </Button>
        <Button 
          size="sm" 
          onClick={() => setSelectedVideo(video)}
          variant="default"
          aria-label={`Watch ${video.title} now`}
        >
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Video Library</h2>
          <p className="text-muted-foreground">High-quality fitness, nutrition, and wellness videos from experts</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search videos..."
            className="pl-8 rounded-full border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-b pb-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All Videos</TabsTrigger>
            <TabsTrigger value="workout" className="rounded-full data-[state=active]:bg-white">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className="rounded-full data-[state=active]:bg-white">Nutrition</TabsTrigger>
            <TabsTrigger value="yoga" className="rounded-full data-[state=active]:bg-white">Yoga</TabsTrigger>
            <TabsTrigger value="recovery" className="rounded-full data-[state=active]:bg-white">Recovery</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{filteredVideos.length} videos</span>
        </div>
      </div>

      <div className="mt-6">
        {filteredVideos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map(renderVideoCard)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No videos found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any videos matching your search criteria. Try adjusting your search or browse a different category.
            </p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
              <DialogDescription>
                {selectedVideo.channel} • {selectedVideo.views} views
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <YouTubeVideoPlayer
                  videoId={selectedVideo.videoId}
                  autoPlay={true}
                  mute={false}
                  maintainAspectRatio={true}
                  minHeight="200px"
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addNotification({
                        title: "Video Liked",
                        message: `You've liked "${selectedVideo.title}".`,
                        type: "success"
                      })
                    }}
                    aria-label={`Like ${selectedVideo.title}`}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" aria-hidden="true" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addNotification({
                        title: "Video Saved",
                        message: `"${selectedVideo.title}" has been saved to your library.`,
                        type: "success"
                      })
                    }}
                    aria-label={`Save ${selectedVideo.title} to your library`}
                  >
                    <Bookmark className="h-4 w-4 mr-1" aria-hidden="true" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addNotification({
                        title: "Video Shared",
                        message: `You've shared "${selectedVideo.title}" with your friends.`,
                        type: "success"
                      })
                    }}
                    aria-label={`Share ${selectedVideo.title}`}
                  >
                    <Share2 className="h-4 w-4 mr-1" aria-hidden="true" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <h3 className="font-medium w-full mb-1">Tags</h3>
                {selectedVideo.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${selectedVideo.videoId}`, "_blank")
                  }}
                  aria-label={`Watch ${selectedVideo.title} on YouTube in a new tab`}
                >
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  Watch on YouTube
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

