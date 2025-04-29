"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePremiumStatus } from "@/components/hooks/use-premium-status"
import { PremiumUpsellBanner } from "@/components/premium/premium-upsell-banner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { 
  Trophy, 
  Sparkles, 
  Video, 
  PlayCircle, 
  BarChart,
  Download,
  FileText,
  ArrowRight,
  CheckCircle,
  Info,
  BookOpen,
  Dumbbell,
  Clock,
  User,
  Heart,
  AlertCircle,
  Star
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const trainingGuides = [
  {
    id: "guide-001",
    title: "Perfect Your Squat Form",
    category: "Form Guide",
    level: "All Levels",
    image: "/gym-workout.jpg",
    videoSrc: "https://www.youtube.com/embed/Dy28eq2PjcM",
    duration: "12 minutes",
    instructor: {
      name: "Mike Johnson",
      image: "/placeholder-user.jpg",
      credentials: "Certified Strength Coach"
    },
    description: "Learn proper squat mechanics to maximize results and prevent injury. This comprehensive guide covers stance, depth, and common mistakes."
  },
  {
    id: "guide-002",
    title: "Maximizing Muscle Growth",
    category: "Science-Based Training",
    level: "Intermediate",
    image: "/treadmill.jpg",
    videoSrc: "https://www.youtube.com/embed/AzV3EA-1-yM",
    duration: "20 minutes",
    instructor: {
      name: "Sarah Williams",
      image: "/placeholder-user.jpg",
      credentials: "PhD in Exercise Physiology"
    },
    description: "Understand the science of hypertrophy and learn evidence-based techniques to optimize your training for maximum muscle development."
  },
  {
    id: "guide-003",
    title: "Recovery Optimization",
    category: "Recovery Strategies",
    level: "All Levels",
    image: "/hydration.jpg",
    videoSrc: "https://www.youtube.com/embed/lumimB_aa7M",
    duration: "15 minutes",
    instructor: {
      name: "David Chen",
      image: "/placeholder-user.jpg",
      credentials: "Sports Medicine Specialist"
    },
    description: "Discover advanced recovery techniques including sleep optimization, nutrition timing, and mobility work to enhance performance and results."
  },
  {
    id: "guide-004",
    title: "HIIT Training Fundamentals",
    category: "Cardio",
    level: "Beginner-Intermediate",
    image: "/fitness-motivation-1.jpg",
    videoSrc: "https://www.youtube.com/embed/ml6cT4AZdqI",
    duration: "18 minutes",
    instructor: {
      name: "Emma Rodriguez",
      image: "/placeholder-user.jpg",
      credentials: "HIIT Specialist"
    },
    description: "Master the fundamentals of High-Intensity Interval Training to maximize fat loss while preserving muscle mass."
  },
  {
    id: "guide-005",
    title: "Periodization for Strength",
    category: "Programming",
    level: "Advanced",
    image: "/weightlifting.jpg",
    videoSrc: "https://www.youtube.com/embed/ixkQaZXVQjs",
    duration: "25 minutes",
    instructor: {
      name: "James Taylor",
      image: "/placeholder-user.jpg",
      credentials: "Elite Powerlifting Coach"
    },
    description: "Learn how to structure your training using periodization principles to continuously progress in strength development."
  },
  {
    id: "guide-006",
    title: "Nutrition Timing Strategies",
    category: "Nutrition",
    level: "All Levels",
    image: "/food-planning.jpg",
    videoSrc: "https://www.youtube.com/embed/Eml2xnoLpYE",
    duration: "16 minutes",
    instructor: {
      name: "Lisa Nguyen",
      image: "/placeholder-user.jpg",
      credentials: "Sports Nutritionist"
    },
    description: "Optimize your meal timing around workouts to enhance performance, recovery, and body composition changes."
  }
];

const featuredGuide = {
  title: "Building Strength Fundamentals",
  image: "/images/workout-background.jpg",
  videoSrc: "https://www.youtube.com/embed/3nDgbRZ-ymA",
  duration: "4 modules • 65 minutes total",
  instructor: {
    name: "Alex Thompson",
    image: "/placeholder-user.jpg",
    credentials: "Master Strength Coach"
  },
  description: "A comprehensive guide to developing foundational strength through proper technique, programming, and recovery strategies. Master the fundamental lifts and build a strong base for all athletic pursuits.",
  modules: [
    {
      title: "Module 1: Strength Training Principles",
      duration: "18 minutes",
      videoSrc: "https://www.youtube.com/embed/3nDgbRZ-ymA",
      description: "Understanding progressive overload, specificity, and recovery",
      completed: true
    },
    {
      title: "Module 2: Movement Patterns",
      duration: "22 minutes",
      videoSrc: "https://www.youtube.com/embed/U3HlEF_E9fo",
      description: "Mastering the squat, hinge, push, pull, and carry patterns",
      completed: true
    },
    {
      title: "Module 3: Program Design",
      duration: "15 minutes",
      videoSrc: "https://www.youtube.com/embed/RjexvOAsVtI",
      description: "How to structure an effective strength program",
      completed: false
    },
    {
      title: "Module 4: Recovery Strategies",
      duration: "10 minutes",
      videoSrc: "https://www.youtube.com/embed/1AjYUSQ-mRI",
      description: "Optimizing recovery between training sessions",
      completed: false
    }
  ]
};

const trainingTips = [
  {
    id: "tip-001",
    title: "Progressive Overload",
    description: "Gradually increase the weight, frequency, or number of repetitions in your strength training routine.",
    category: "Strength Training"
  },
  {
    id: "tip-002",
    title: "Mind-Muscle Connection",
    description: "Focus on the specific muscle you're working during each exercise to maximize activation and results.",
    category: "Technique"
  },
  {
    id: "tip-003",
    title: "Recovery Importance",
    description: "Allow 48-72 hours before training the same muscle group again for optimal recovery and growth.",
    category: "Recovery"
  },
  {
    id: "tip-004",
    title: "Compound First",
    description: "Perform compound exercises at the beginning of your workout when you're fresh for maximal strength gains.",
    category: "Programming"
  },
  {
    id: "tip-005",
    title: "Proper Warm-up",
    description: "Include dynamic stretches and activation exercises to prepare your body for optimal performance.",
    category: "Preparation"
  },
  {
    id: "tip-006",
    title: "Tracking Progress",
    description: "Keep a detailed workout log to track weights, reps, and sets to ensure progressive overload.",
    category: "Accountability"
  }
];

export default function PremiumTrainingGuidePage() {
  const { isPremium, isLoading } = usePremiumStatus()
  const [simulatedPremium, setSimulatedPremium] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [activeGuide, setActiveGuide] = useState<any>(null)
  const [continueWatching, setContinueWatching] = useState<boolean>(false)
  const router = useRouter()
  
  // Check for simulated premium mode
  useEffect(() => {
    const simulated = localStorage.getItem('simulatedPremium') === 'true'
    setSimulatedPremium(simulated)
  }, [])
  
  // If not premium and not in simulation mode, redirect to premium page
  useEffect(() => {
    if (!isLoading && !isPremium && !simulatedPremium) {
      router.push('/premium')
    }
  }, [isPremium, isLoading, simulatedPremium, router])

  // Function to handle video selection
  const handleVideoSelect = (videoSrc: string, guide: any) => {
    setSelectedVideo(videoSrc)
    setActiveGuide(guide)
    
    // Save to local storage for continue watching feature
    const recentlyWatched = JSON.parse(localStorage.getItem('recentlyWatched') || '[]')
    const updatedWatched = [
      { id: guide.id, title: guide.title, lastWatched: new Date().toISOString() },
      ...recentlyWatched.filter((item: any) => item.id !== guide.id)
    ].slice(0, 5) // Keep only the 5 most recent
    
    localStorage.setItem('recentlyWatched', JSON.stringify(updatedWatched))
    setContinueWatching(true)
  }

  // Function to handle download resources
  const handleDownloadResource = (guideId: string) => {
    // In a real app, this would download actual resources
    // For now, just show a message that the download is starting
    alert(`Downloading resources for guide ${guideId}. Your download will begin shortly.`)
  }
  
  if (isLoading) {
    return (
      <div className="container relative flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!isPremium && !simulatedPremium) {
    return (
      <div className="container relative py-10">
        <Card>
          <CardHeader>
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              This feature is only available to premium subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PremiumUpsellBanner 
              title="Unlock Training Guides"
              description="Upgrade to premium to access expert training guides and tutorials"
            />
            <div className="mt-4 text-center">
              <Button onClick={() => router.push('/premium')}>
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container relative py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <span>Premium Training Guides</span> <PremiumBadge className="ml-2" />
          </h1>
          <p className="text-muted-foreground">
            Expert video tutorials to perfect your form and optimize your training
          </p>
        </div>
      </div>
      
      {/* Featured training guide with video player */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 relative">
              {selectedVideo ? (
                <div className="aspect-video w-full rounded-md overflow-hidden">
                  <iframe 
                    src={`${selectedVideo}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                    title="Training video"
                  ></iframe>
                </div>
              ) : (
                <div 
                  className="aspect-video relative w-full rounded-md overflow-hidden cursor-pointer bg-black"
                  onClick={() => handleVideoSelect(featuredGuide.videoSrc, featuredGuide)}
                >
                  <iframe 
                    src={`${featuredGuide.videoSrc}?controls=0&autoplay=0&mute=1&loop=1&playlist=${featuredGuide.videoSrc.split('/').pop()}`}
                    className="absolute inset-0 w-full h-full opacity-70"
                    title="Featured preview"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                      <PlayCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold">{featuredGuide.title}</h3>
                    <p>{featuredGuide.duration}</p>
                  </div>
                </div>
              )}
              
              {activeGuide && (
                <div className="p-6">
                  <h3 className="text-xl font-bold">{activeGuide.title}</h3>
                  <div className="flex items-center gap-4 mt-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activeGuide.instructor?.image} alt={activeGuide.instructor?.name} />
                        <AvatarFallback>{activeGuide.instructor?.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{activeGuide.instructor?.name}</span>
                    </div>
                    <Badge variant="outline">{activeGuide.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{activeGuide.duration}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{activeGuide.description}</p>
                  
                  <div className="flex gap-3 mt-6">
                    <Button onClick={() => handleDownloadResource(activeGuide.id)}>
                      <Download className="h-4 w-4 mr-2" /> Download Resources
                    </Button>
                    <Button variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" /> View Notes
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="p-6 bg-muted/30 h-full overflow-auto">
                <h3 className="font-bold mb-4">Module Progress</h3>
                <div className="space-y-4">
                  {featuredGuide.modules.map((module, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-lg border ${
                        module.completed ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30' : 
                        'border-muted bg-background'
                      } cursor-pointer hover:bg-muted/50 transition-colors`}
                      onClick={() => handleVideoSelect(module.videoSrc, { ...featuredGuide, ...module })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{module.title}</h4>
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {module.duration}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Progress value={50} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">2/4 modules completed (50%)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* All training guides with videos */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">All Training Guides</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Guides</TabsTrigger>
            <TabsTrigger value="form">Form Guides</TabsTrigger>
            <TabsTrigger value="science">Science-Based</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
            <TabsTrigger value="programming">Programming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {trainingGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="relative cursor-pointer" onClick={() => handleVideoSelect(guide.videoSrc, guide)}>
                    <div className="aspect-video relative">
                      <iframe 
                        src={`${guide.videoSrc}?controls=0&mute=1&showinfo=0`}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        title={guide.title}
                        loading="lazy"
                        allowFullScreen
                      ></iframe>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                          <PlayCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {guide.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg line-clamp-1">{guide.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{guide.category}</Badge>
                      <span className="text-xs text-muted-foreground">{guide.level}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={guide.instructor.image} alt={guide.instructor.name} />
                        <AvatarFallback>{guide.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{guide.instructor.name}</span>
                    </div>
                    <p className="text-sm line-clamp-2">{guide.description}</p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleVideoSelect(guide.videoSrc, guide)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" /> Watch Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="form">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {trainingGuides
                .filter(guide => guide.category === "Form Guide")
                .map((guide) => (
                  <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-all">
                    <div className="relative cursor-pointer" onClick={() => handleVideoSelect(guide.videoSrc, guide)}>
                      <div className="aspect-video relative">
                        <iframe 
                          src={`${guide.videoSrc}?controls=0&mute=1&showinfo=0`}
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          title={guide.title}
                          loading="lazy"
                          allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                            <PlayCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {guide.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{guide.title}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{guide.category}</Badge>
                        <span className="text-xs text-muted-foreground">{guide.level}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm line-clamp-2">{guide.description}</p>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleVideoSelect(guide.videoSrc, guide)}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" /> Watch Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Similar TabsContent structures for other categories */}
          <TabsContent value="science">
            {/* Similar content as above, filtered for Science-Based Training */}
          </TabsContent>
          
          <TabsContent value="recovery">
            {/* Similar content as above, filtered for Recovery */}
          </TabsContent>
          
          <TabsContent value="programming">
            {/* Similar content as above, filtered for Programming */}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Quick Training Tips */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Quick Training Tips</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {trainingTips.map((tip) => (
            <Card key={tip.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Badge className="w-fit mb-1">{tip.category}</Badge>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {simulatedPremium && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300 text-center flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
            You're viewing premium training guides in simulation mode. <Button variant="link" className="h-auto p-0" onClick={() => router.push('/premium')}>Upgrade to Premium</Button> for real access.
          </p>
        </div>
      )}
    </div>
  )
} 