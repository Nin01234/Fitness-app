"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePremiumStatus } from "@/components/hooks/use-premium-status"
import { PremiumUpsellBanner } from "@/components/premium/premium-upsell-banner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Clock, 
  Dumbbell, 
  ExternalLink, 
  Play, 
  Star, 
  TrendingUp, 
  Users, 
  Sparkles,
  Trophy,
  Flame,
  BarChart,
  Heart,
  VideoIcon,
  ArrowRight,
  BellRing,
  Calendar,
  Check,
  X
} from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { Progress } from "@/components/ui/progress"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { toast } from "@/components/ui/use-toast"

// Secure image URLs that will definitely work
const SECURE_IMAGES = {
  hero: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", 
  weights: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
  fitness1: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
  fitness2: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop",
  workout: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  trainer: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop",
}

// Example premium workout data with updated image URLs
const premiumWorkouts = [
  {
    id: "pm-001",
    title: "HIIT Elite Circuit",
    description: "High-intensity interval training designed for maximum calorie burn",
    level: "Advanced",
    duration: 45,
    calories: 500,
    category: "Cardio",
    trainer: {
      name: "Alex Morgan",
      image: SECURE_IMAGES.trainer
    },
    coverImage: SECURE_IMAGES.fitness1,
    rating: 4.9,
    ratingCount: 328,
    popular: true,
    new: false,
    completionRate: 78
  },
  {
    id: "pm-002",
    title: "Power Strength Builder",
    description: "Build serious muscle with this progressive overload program",
    level: "Intermediate",
    duration: 60,
    calories: 420,
    category: "Strength",
    trainer: {
      name: "Jake Wilson",
      image: SECURE_IMAGES.trainer
    },
    coverImage: SECURE_IMAGES.gym,
    rating: 4.8,
    ratingCount: 256,
    popular: true,
    new: false,
    completionRate: 65
  },
  {
    id: "pm-003",
    title: "Flow Yoga Fusion",
    description: "Combination of traditional yoga with dynamic movement patterns",
    level: "All Levels",
    duration: 50,
    calories: 280,
    category: "Yoga",
    trainer: {
      name: "Emma Chen",
      image: SECURE_IMAGES.trainer
    },
    coverImage: SECURE_IMAGES.fitness2,
    rating: 4.7,
    ratingCount: 193,
    popular: false,
    new: true,
    completionRate: 42
  },
  {
    id: "pm-004",
    title: "Core Crusher Program",
    description: "6-week progressive core training for visible abs",
    level: "Intermediate",
    duration: 30,
    calories: 320,
    category: "Core",
    trainer: {
      name: "Mike Santos",
      image: SECURE_IMAGES.trainer
    },
    coverImage: SECURE_IMAGES.workout,
    rating: 4.9,
    ratingCount: 412,
    popular: true,
    new: false,
    completionRate: 91
  },
  {
    id: "pm-005",
    title: "Lower Body Sculpt",
    description: "Focus on glutes, hamstrings and quads with this targeted workout",
    level: "All Levels",
    duration: 40,
    calories: 380,
    category: "Strength",
    trainer: {
      name: "Sarah Johnson",
      image: SECURE_IMAGES.trainer
    },
    coverImage: SECURE_IMAGES.fitness1,
    rating: 4.6,
    ratingCount: 178,
    popular: false,
    new: true,
    completionRate: 55
  },
  {
    id: "pm-006",
    title: "Mobility Mastery",
    description: "Improve flexibility, reduce pain and enhance performance",
    level: "All Levels",
    duration: 35,
    calories: 220,
    category: "Recovery",
    trainer: {
      name: "David Kim",
      image: SECURE_IMAGES.trainer
    },
    coverImage: SECURE_IMAGES.weights,
    rating: 4.8,
    ratingCount: 156,
    popular: false,
    new: true,
    completionRate: 81
  }
];

// Sample workout plans with updated image URLs
const workoutPlans = [
  {
    id: "plan-001",
    title: "8-Week Muscle Builder",
    level: "Intermediate-Advanced",
    workoutsPerWeek: 5,
    duration: "8 weeks",
    focus: "Hypertrophy",
    coverImage: SECURE_IMAGES.gym,
    progress: 45,
    nextWorkout: "Upper Body Power Day",
    scheduledFor: "Today, 6:00 PM"
  },
  {
    id: "plan-002",
    title: "12-Week Fat Loss Challenge",
    level: "All Levels",
    workoutsPerWeek: 4,
    duration: "12 weeks",
    focus: "Fat Loss",
    coverImage: SECURE_IMAGES.fitness1,
    progress: 25,
    nextWorkout: "HIIT & Core Circuit",
    scheduledFor: "Tomorrow, 7:30 AM"
  },
  {
    id: "plan-003",
    title: "30-Day Core Challenge",
    level: "Beginner-Intermediate",
    workoutsPerWeek: 6,
    duration: "30 days",
    focus: "Core Strength",
    coverImage: SECURE_IMAGES.workout,
    progress: 80,
    nextWorkout: "Advanced Ab Circuit",
    scheduledFor: "Today, 5:00 PM"
  }
];

// Upcoming workout sessions
const upcomingWorkouts = [
  {
    id: "session-001",
    title: "Upper Body Power",
    date: "Today",
    time: "6:00 PM",
    duration: 45,
    type: "Strength",
    plan: "8-Week Muscle Builder"
  },
  {
    id: "session-002",
    title: "HIIT Cardio Blast",
    date: "Tomorrow",
    time: "7:30 AM",
    duration: 30,
    type: "Cardio",
    plan: "12-Week Fat Loss Challenge"
  },
  {
    id: "session-003",
    title: "Yoga Recovery Session",
    date: "Wednesday",
    time: "8:00 PM",
    duration: 40,
    type: "Recovery",
    plan: "Weekly Schedule"
  }
];

export default function PremiumWorkoutsPage() {
  const { isPremium, isLoading } = usePremiumStatus()
  const [simulatedPremium, setSimulatedPremium] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeNotifications, setActiveNotifications] = useState(2)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null)
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const router = useRouter()
  
  // Check for simulated premium mode
  useEffect(() => {
    const simulated = localStorage.getItem('simulatedPremium') === 'true'
    setSimulatedPremium(simulated)
  }, [])
  
  // Simulate notifications changing over time
  useEffect(() => {
    // Only run if premium or simulated premium
    if (isPremium || simulatedPremium) {
      const interval = setInterval(() => {
        // Random chance to change notification count
        if (Math.random() > 0.7) {
          setActiveNotifications(prev => {
            const newCount = Math.min(5, prev + 1);
            return newCount;
          });
        }
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isPremium, simulatedPremium]);
  
  // Function to handle starting a workout
  const handleStartWorkout = (workoutId: string) => {
    setActiveWorkout(workoutId);
    setShowWorkoutModal(true);
    
    toast({
      title: "Workout Started",
      description: `Starting workout: ${premiumWorkouts.find(w => w.id === workoutId)?.title}`,
      duration: 3000,
    });
  }
  
  // Function to handle previewing a workout
  const handlePreviewWorkout = (workoutId: string) => {
    setActiveWorkout(workoutId);
    setShowPreviewModal(true);
    
    toast({
      title: "Workout Preview",
      description: `Previewing workout: ${premiumWorkouts.find(w => w.id === workoutId)?.title}`,
      duration: 3000,
    });
  }
  
  // Function to handle continuing a plan
  const handleContinuePlan = (planId: string) => {
    const plan = workoutPlans.find(p => p.id === planId);
    
    toast({
      title: "Plan Continued",
      description: `Starting next workout in ${plan?.title}: ${plan?.nextWorkout}`,
      duration: 3000,
    });
  }
  
  // Function to handle viewing workout progress
  const handleViewProgress = (planId: string) => {
    toast({
      title: "Progress View",
      description: `Viewing detailed progress for: ${workoutPlans.find(p => p.id === planId)?.title}`,
      duration: 3000,
    });
  }
  
  // Function to handle viewing full plan
  const handleViewFullPlan = () => {
    toast({
      title: "Full Plan View",
      description: "Opening your personalized training plan with all workouts and schedule",
      duration: 3000,
    });
  }
  
  // Function to handle viewing full calendar
  const handleViewCalendar = () => {
    toast({
      title: "Calendar View",
      description: "Opening your workout calendar with all scheduled sessions",
      duration: 3000,
    });
  }
  
  // Function to toggle notification panel
  const handleToggleNotifications = () => {
    setNotificationOpen(prev => !prev);
    
    // Reset count when opened
    if (!notificationOpen) {
      setActiveNotifications(0);
      
      setTimeout(() => {
        setActiveNotifications(1);
      }, 60000); // 1 minute later add a notification back
    }
  }
  
  // Function to customize reminders
  const handleCustomizeReminders = () => {
    toast({
      title: "Reminder Settings",
      description: "Opening reminder customization panel",
      duration: 3000,
    });
  }
  
  // Function to apply AI recommendations
  const handleApplyRecommendations = () => {
    toast({
      title: "AI Recommendations Applied",
      description: "Your workout schedule has been optimized based on AI suggestions",
      duration: 3000,
    });
  }
  
  // If not premium and not in simulation mode, redirect to premium page
  useEffect(() => {
    if (!isLoading && !isPremium && !simulatedPremium) {
      router.push('/premium')
    }
  }, [isPremium, isLoading, simulatedPremium, router])
  
  const filteredWorkouts = premiumWorkouts.filter(workout => 
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.level.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
              title="Unlock Premium Workouts"
              description="Upgrade to premium to access exclusive workouts designed by top trainers"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Premium Workouts</h1>
            <PremiumBadge />
          </div>
          <p className="text-muted-foreground mt-1">
            AI-powered training programs designed by elite trainers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Input 
            placeholder="Search workouts..." 
            className="w-full md:w-[260px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={handleToggleNotifications}
            >
              <BellRing className="h-5 w-5" />
              {activeNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeNotifications}
                </span>
              )}
            </Button>
            
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-card shadow-lg z-50">
                <div className="p-4 border-b">
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-muted-foreground">Your workout updates</div>
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-3 border-b hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium text-sm">Workout Reminder</div>
                    <div className="text-xs text-muted-foreground">Upper Body Power is scheduled for today at 6:00 PM</div>
                    <div className="text-xs text-primary mt-1">10 minutes ago</div>
                  </div>
                  <div className="p-3 border-b hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium text-sm">Goal Achievement</div>
                    <div className="text-xs text-muted-foreground">You've completed 80% of your 30-Day Core Challenge!</div>
                    <div className="text-xs text-primary mt-1">2 hours ago</div>
                  </div>
                  <div className="p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium text-sm">New Workout Available</div>
                    <div className="text-xs text-muted-foreground">Try our new HIIT Elite Circuit workout today</div>
                    <div className="text-xs text-primary mt-1">Yesterday</div>
                  </div>
                </div>
                <div className="p-3 text-center border-t">
                  <Button variant="link" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Workout Recommendation */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/3 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Your AI-Generated Workout Plan</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Based on your goals, progress, and preferences, we've created a personalized training plan for you.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <Dumbbell className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">Strength Focus</div>
                <div className="text-xs text-muted-foreground">Primary Goal</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">45-60 min</div>
                <div className="text-xs text-muted-foreground">Per Session</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">4-5 days</div>
                <div className="text-xs text-muted-foreground">Per Week</div>
              </div>
            </div>
            
            <Button className="gap-2" onClick={handleViewFullPlan}>
              View Full Plan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative h-48 md:h-auto md:w-1/3">
            <Image
              src={SECURE_IMAGES.gym}
              alt="AI Workout Plan"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <div className="h-16 w-16">
                <CircularProgressbar 
                  value={85} 
                  text={`85%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: 'var(--primary)',
                    textColor: 'white',
                    trailColor: 'rgba(255,255,255,0.3)'
                  })}
                />
              </div>
              <div className="text-white text-sm">
                <div className="font-medium">Match Score</div>
                <div className="text-xs opacity-80">Based on your goals</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Workouts</TabsTrigger>
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-primary/5">
              <Flame className="h-3.5 w-3.5" /> Popular
            </Badge>
            <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-primary/5">
              <Sparkles className="h-3.5 w-3.5" /> New
            </Badge>
          </div>
        </div>
        
        <TabsContent value="all">
          {/* Featured workout */}
          <Card className="mb-8 overflow-hidden border-primary/20 shadow-lg">
            <div className="md:grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto">
                <Image
                  src={SECURE_IMAGES.hero}
                  alt="Featured Workout"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white md:hidden">
                  <Badge className="bg-primary/90 self-start mb-2 backdrop-blur-sm">FEATURED PROGRAM</Badge>
                  <h2 className="text-2xl font-bold mb-2">12-Week Total Body Transformation</h2>
                  <p className="text-white/90 mb-4">Our most comprehensive program for complete fitness overhaul</p>
                </div>
              </div>
              <div className="p-6 flex flex-col">
                <div className="hidden md:block">
                  <Badge className="mb-3 bg-primary">FEATURED PROGRAM</Badge>
                  <h2 className="text-2xl font-bold mb-2">12-Week Total Body Transformation</h2>
                  <p className="text-muted-foreground mb-4">Our most comprehensive program for complete fitness overhaul</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span className="text-sm">Mixed Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">45-60 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">2,453 active</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={SECURE_IMAGES.trainer} alt="Trainer" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Coach Jordan Davis</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-xs text-muted-foreground">(512)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex flex-col xs:flex-row gap-3">
                    <Button className="gap-2 flex-1" onClick={() => handleStartWorkout("featured-001")}>
                      <Play className="h-4 w-4" /> Start Program
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1" onClick={() => handlePreviewWorkout("featured-001")}>
                      <VideoIcon className="h-4 w-4" /> Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Workout grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map(workout => (
              <Card key={workout.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    {workout.popular && <Badge className="bg-amber-500/90 backdrop-blur-sm">Popular</Badge>}
                    {workout.new && <Badge className="bg-emerald-500/90 backdrop-blur-sm">New</Badge>}
                  </div>
                  <div className="h-48 relative">
                    <Image
                      src={workout.coverImage}
                      alt={workout.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Completion Rate</div>
                        <div>{workout.completionRate}%</div>
                      </div>
                      <Progress value={workout.completionRate} className="h-1.5" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workout.title}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{workout.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {workout.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{workout.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-primary" />
                      <span>{workout.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>{workout.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={workout.trainer.image} alt={workout.trainer.name} />
                      <AvatarFallback>{workout.trainer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{workout.trainer.name}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-1" 
                    onClick={() => handleStartWorkout(workout.id)}
                  >
                    <Play className="h-3.5 w-3.5" /> Start Workout
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="plans">
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Your Active Workout Plans</h2>
            
            {workoutPlans.map(plan => (
              <Card key={plan.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <Image
                      src={plan.coverImage}
                      alt={plan.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                      <h3 className="font-bold text-lg">{plan.title}</h3>
                      <p className="text-sm text-white/80">{plan.focus}</p>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="h-14 w-14">
                        <CircularProgressbar 
                          value={plan.progress} 
                          text={`${plan.progress}%`}
                          styles={buildStyles({
                            textSize: '24px',
                            pathColor: 'var(--primary)',
                            textColor: 'white',
                            trailColor: 'rgba(255,255,255,0.3)'
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col md:w-2/3">
                    <div className="hidden md:block mb-3">
                      <h3 className="font-bold text-xl">{plan.title}</h3>
                      <p className="text-muted-foreground">{plan.focus}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Level</div>
                        <div className="font-medium">{plan.level}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-medium">{plan.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Frequency</div>
                        <div className="font-medium">{plan.workoutsPerWeek}x per week</div>
                      </div>
                      <div className="md:text-right">
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="font-medium md:hidden">{plan.progress}%</div>
                        <div className="hidden md:block">
                          <Progress value={plan.progress} className="h-2 mt-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-b py-3 mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Next Workout</div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{plan.nextWorkout}</div>
                        <div className="text-sm">{plan.scheduledFor}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <Button className="gap-2" onClick={() => handleContinuePlan(plan.id)}>
                        <Play className="h-4 w-4" /> Continue Plan
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => handleViewProgress(plan.id)}>
                        <BarChart className="h-4 w-4" /> View Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Workout Schedule</h2>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4" /> Full Calendar
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Workouts</CardTitle>
                <CardDescription>Your scheduled training sessions for the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingWorkouts.map(workout => (
                    <div key={workout.id} className="flex items-center border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="mr-4 p-3 rounded-full bg-primary/10">
                        {workout.type === "Strength" && <Dumbbell className="h-6 w-6 text-primary" />}
                        {workout.type === "Cardio" && <Flame className="h-6 w-6 text-primary" />}
                        {workout.type === "Recovery" && <Heart className="h-6 w-6 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{workout.title}</h4>
                        <p className="text-sm text-muted-foreground">{workout.plan}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{workout.date}, {workout.time}</div>
                        <div className="text-sm text-muted-foreground">{workout.duration} min</div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <BellRing className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Schedule Options</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Reminders</CardTitle>
                  <CardDescription>Set up notifications for your workouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Push Notifications</div>
                      <div>
                        <Badge>Enabled</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Reminder Time</div>
                      <div className="text-sm">30 minutes before</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Progress Reminders</div>
                      <div>
                        <Badge variant="outline">Weekly</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleCustomizeReminders}>
                    Customize Reminders
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Training Coach</CardTitle>
                  <CardDescription>Get automated training suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      Based on your activity, our AI suggests the following:
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3">
                      <div className="font-medium">Schedule Adjustment</div>
                      <p className="text-sm text-muted-foreground">Move your heavy lifting days to Monday and Thursday for optimal recovery</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full" onClick={handleApplyRecommendations}>
                    Apply Recommendations
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>Your workout frequency and balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Strength Training</div>
                      <div className="text-sm font-medium">3 sessions</div>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Cardio</div>
                      <div className="text-sm font-medium">2 sessions</div>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Recovery</div>
                      <div className="text-sm font-medium">1 session</div>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground w-full text-center">
                    Your training balance is optimal for your goals
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Workout Start Modal - You'd integrate this with a modal component in a real app */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWorkoutModal(false)}>
          <div className="bg-card rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">Starting Workout</h3>
            <p className="text-muted-foreground mb-4">
              {activeWorkout === "featured-001" 
                ? "12-Week Total Body Transformation" 
                : premiumWorkouts.find(w => w.id === activeWorkout)?.title}
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span>Preparing equipment...</span>
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Loading exercise details...</span>
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Setting up tracking...</span>
                <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWorkoutModal(false)}>Cancel</Button>
              <Button>Continue</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreviewModal(false)}>
          <div className="bg-card rounded-lg max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <div className="relative h-64">
              <Image
                src={activeWorkout === "featured-001" ? SECURE_IMAGES.hero : premiumWorkouts.find(w => w.id === activeWorkout)?.coverImage || SECURE_IMAGES.gym}
                alt="Workout Preview"
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {activeWorkout === "featured-001" 
                      ? "12-Week Total Body Transformation" 
                      : premiumWorkouts.find(w => w.id === activeWorkout)?.title}
                  </h2>
                  <p className="text-white/90">Preview the exercises and intensity</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40"
                onClick={() => setShowPreviewModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium mb-2">Workout Overview</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">45-60 min</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Intensity</div>
                    <div className="font-medium">Moderate-High</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Equipment</div>
                    <div className="font-medium">Full Gym</div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-3">Sample Exercises</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center border rounded-lg p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Barbell Squats</div>
                    <div className="text-xs text-muted-foreground">4 sets × 8-10 reps</div>
                  </div>
                </div>
                <div className="flex items-center border rounded-lg p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Bench Press</div>
                    <div className="text-xs text-muted-foreground">4 sets × 8-10 reps</div>
                  </div>
                </div>
                <div className="flex items-center border rounded-lg p-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Bent Over Rows</div>
                    <div className="text-xs text-muted-foreground">3 sets × 10-12 reps</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowPreviewModal(false);
                  handleStartWorkout(activeWorkout || "featured-001");
                }}>
                  Start Workout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {simulatedPremium && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300 text-center flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
            You're viewing premium workout features in simulation mode. <Button variant="link" className="h-auto p-0" onClick={() => router.push('/premium')}>Upgrade to Premium</Button> for real access.
          </p>
        </div>
      )}
    </div>
  )
} 