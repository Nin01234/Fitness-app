"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/components/notifications/notification-provider"
import { Search, Calendar, Users, Clock, ThumbsUp, Share2, Bookmark, ExternalLink, BookOpen, Brain, Heart, Apple, Activity } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"

export function HealthTalks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTalk, setSelectedTalk] = useState<any | null>(null)
  const { addNotification } = useNotifications()
  const [activeCategory, setActiveCategory] = useState("all")

  const mentalHealthTalks = [
    {
      id: "mental-1",
      title: "The Science of Stress & How Our Minds Can Relieve It",
      speaker: "Dr. Kelly McGonigal",
      role: "Health Psychologist, Stanford University",
      date: "Sept 12, 2023",
      duration: "18:26",
      views: "4.8M",
      thumbnail: "https://img.youtube.com/vi/RcGyVTAoXEU/maxresdefault.jpg",
      videoId: "RcGyVTAoXEU",
      description: "How to make stress your friend by changing your mindset about stress and using it to improve performance and connection.",
      category: "mental",
      tags: ["Stress Management", "Psychology", "Mindset"],
    },
    {
      id: "mental-2",
      title: "Sleep is your superpower",
      speaker: "Matt Walker",
      role: "Sleep Scientist, UC Berkeley",
      date: "May 3, 2019",
      duration: "19:16",
      views: "13.9M",
      thumbnail: "https://img.youtube.com/vi/5MuIMqhT8DM/maxresdefault.jpg",
      videoId: "5MuIMqhT8DM",
      description: "Sleep scientist Matt Walker shares the wonder of slumber and explains how sleep can enhance everything from creativity to emotional resilience.",
      category: "mental",
      tags: ["Sleep", "Recovery", "Brain Health"],
    },
  ]

  const nutritionTalks = [
    {
      id: "nutrition-1",
      title: "The surprisingly dramatic role of nutrition in mental health",
      speaker: "Dr. Julia Rucklidge",
      role: "Clinical Psychologist, University of Canterbury",
      date: "Oct 12, 2021",
      duration: "17:58",
      views: "1.3M",
      thumbnail: "https://img.youtube.com/vi/3dqXHHCc5lA/maxresdefault.jpg",
      videoId: "3dqXHHCc5lA",
      description: "The emerging science of nutritional psychiatry and how micronutrients can significantly improve mental health outcomes.",
      category: "nutrition",
      tags: ["Mental Health", "Micronutrients", "Research"],
    },
    {
      id: "nutrition-2",
      title: "Why dieting doesn't usually work",
      speaker: "Sandra Aamodt",
      role: "Neuroscientist",
      date: "Jan 8, 2014",
      duration: "12:41",
      views: "5.5M",
      thumbnail: "https://img.youtube.com/vi/jn0Ygp7pMbA/maxresdefault.jpg",
      videoId: "jn0Ygp7pMbA",
      description: "A neuroscientist explains why traditional diets tend to fail and proposes a mindful approach to eating and health.",
      category: "nutrition",
      tags: ["Mindful Eating", "Dieting", "Neuroscience"],
    },
  ]

  const exerciseTalks = [
    {
      id: "exercise-1",
      title: "Why some people find exercise harder than others",
      speaker: "Emily Balcetis",
      role: "Social Psychologist, NYU",
      date: "Dec 15, 2014",
      duration: "14:06",
      views: "3.7M",
      thumbnail: "https://img.youtube.com/vi/yFVvN9falKI/maxresdefault.jpg",
      videoId: "yFVvN9falKI",
      description: "How perception affects exercise motivation and practical strategies to change how you see fitness challenges.",
      category: "exercise",
      tags: ["Motivation", "Psychology", "Perception"],
    },
    {
      id: "exercise-2",
      title: "The brain-changing benefits of exercise",
      speaker: "Wendy Suzuki",
      role: "Neuroscientist, NYU",
      date: "Mar 21, 2018",
      duration: "13:02",
      views: "9.1M",
      thumbnail: "https://img.youtube.com/vi/BHY0FxzoKZE/maxresdefault.jpg",
      videoId: "BHY0FxzoKZE",
      description: "How physical activity transforms your brain and impacts mood, memory, attention, and protects against neurodegenerative diseases.",
      category: "exercise",
      tags: ["Brain Health", "Cognitive Function", "Neuroscience"],
    },
  ]

  const lifestyleTalks = [
    {
      id: "lifestyle-1",
      title: "The science of healthy aging",
      speaker: "Dr. Peter Attia",
      role: "Longevity Physician",
      date: "Apr 3, 2022",
      duration: "19:42",
      views: "2.4M",
      thumbnail: "https://img.youtube.com/vi/w9o7YglAJbw/maxresdefault.jpg",
      videoId: "w9o7YglAJbw",
      description: "Evidence-based approaches to extending both lifespan and healthspan through exercise, nutrition, sleep, and stress management.",
      category: "lifestyle",
      tags: ["Longevity", "Aging", "Preventive Medicine"],
    },
    {
      id: "lifestyle-2",
      title: "How to make stress your friend",
      speaker: "Kelly McGonigal",
      role: "Health Psychologist, Stanford University",
      date: "Sep 4, 2013",
      duration: "14:28",
      views: "26.8M",
      thumbnail: "https://img.youtube.com/vi/RcGyVTAoXEU/maxresdefault.jpg",
      videoId: "RcGyVTAoXEU",
      description: "How changing your mindset about stress can make you healthier and help you perform better under pressure.",
      category: "lifestyle",
      tags: ["Stress Management", "Mindset", "Resilience"],
    },
  ]

  const allTalks = [...mentalHealthTalks, ...nutritionTalks, ...exerciseTalks, ...lifestyleTalks]

  const getFilteredTalks = () => {
    let talks = allTalks
    
    // Filter by category if not "all"
    if (activeCategory !== "all") {
      talks = talks.filter(talk => talk.category === activeCategory)
    }
    
    // Apply search query if present
    if (searchQuery) {
      talks = talks.filter(
        (talk) =>
          talk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talk.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talk.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    
    return talks
  }
  
  const filteredTalks = getFilteredTalks()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mental":
        return <Brain className="h-4 w-4 mr-2" />
      case "nutrition":
        return <Apple className="h-4 w-4 mr-2" />
      case "exercise":
        return <Activity className="h-4 w-4 mr-2" />
      case "lifestyle":
        return <Heart className="h-4 w-4 mr-2" />
      default:
        return <BookOpen className="h-4 w-4 mr-2" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "mental":
        return "Mental Health"
      case "nutrition":
        return "Nutrition"
      case "exercise":
        return "Exercise Science"
      case "lifestyle":
        return "Lifestyle Medicine"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  const renderTalkCard = (talk: any) => (
    <Card key={talk.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        <div 
          className="relative aspect-video bg-muted cursor-pointer overflow-hidden rounded-t-lg" 
          onClick={() => setSelectedTalk(talk)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setSelectedTalk(talk)
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Watch ${talk.title}`}
        >
          <img 
            src={talk.thumbnail || "/placeholder.svg"} 
            alt={`Thumbnail for ${talk.title}`} 
            className="w-full h-full object-cover transition-transform hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          <div className="absolute bottom-3 left-3 flex items-center text-white">
            <Badge className="bg-primary text-white border-none text-xs py-0 px-2">
              {getCategoryIcon(talk.category)}
              {getCategoryLabel(talk.category)}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {talk.duration}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <h3
          className="font-medium cursor-pointer hover:text-primary transition-colors text-base line-clamp-2"
          onClick={() => setSelectedTalk(talk)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setSelectedTalk(talk)
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Watch ${talk.title}`}
        >
          {talk.title}
        </h3>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${talk.speaker.replace(' ', '+')}&background=random`} />
            <AvatarFallback>{talk.speaker.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{talk.speaker}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{talk.role}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{talk.duration}</span>
          <span className="mx-2">•</span>
          <Calendar className="h-3 w-3 mr-1" />
          <span>{talk.date}</span>
          <span className="mx-2">•</span>
          <Users className="h-3 w-3 mr-1" />
          <span>{talk.views} views</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            addNotification({
              title: "Talk Saved",
              message: `"${talk.title}" has been saved to your library.`,
              type: "success"
            })
          }}
          aria-label={`Save ${talk.title} to your library`}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Health Talks</h2>
          <p className="text-muted-foreground">Expert discussions and presentations on health, fitness, and wellness topics</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search health talks..."
            className="pl-8 rounded-full border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-full">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">
            All Talks
          </TabsTrigger>
          <TabsTrigger value="mental" className="rounded-full data-[state=active]:bg-white">
            <Brain className="h-4 w-4 mr-2" />
            Mental Health
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="rounded-full data-[state=active]:bg-white">
            <Apple className="h-4 w-4 mr-2" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="exercise" className="rounded-full data-[state=active]:bg-white">
            <Activity className="h-4 w-4 mr-2" />
            Exercise
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="rounded-full data-[state=active]:bg-white">
            <Heart className="h-4 w-4 mr-2" />
            Lifestyle
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {filteredTalks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTalks.map(renderTalkCard)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No talks found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any talks matching your search criteria. Try adjusting your search or browse a different category.
            </p>
          </div>
        )}
      </div>

      {selectedTalk && (
        <Dialog open={!!selectedTalk} onOpenChange={(open) => !open && setSelectedTalk(null)}>
          <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl">{selectedTalk.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {selectedTalk.speaker}, {selectedTalk.role}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <YouTubeVideoPlayer
                  videoId={selectedTalk.videoId}
                  autoPlay={true}
                  maintainAspectRatio={true}
                  mute={false}
                />
              </div>
              <p className="text-sm text-muted-foreground">{selectedTalk.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTalk.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

