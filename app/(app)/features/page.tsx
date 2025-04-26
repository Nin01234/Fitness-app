import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Dumbbell,
  Utensils,
  Zap,
  MessageSquare,
  Clock,
  Calendar,
  Users,
  Award,
  Smartphone,
  GraduationCap,
  Heart,
  Video,
  Cloud,
  Share2,
  FileText,
  UserPlus,
  ChevronRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "Features - FitLife",
  description: "Explore all the powerful features available in FitLife",
}

export default function FeaturesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Features"
        text="Discover all the powerful tools and capabilities available to help you achieve your fitness goals."
      />
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="workouts">Workout</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <Dumbbell className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Workout Library</CardTitle>
                <CardDescription>Access hundreds of workout routines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Workout+Library"
                    alt="Workout Library"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Browse and filter workouts by type, muscle group, equipment, and difficulty.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/workouts" className="flex items-center justify-center gap-1">
                      Explore Workouts
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Utensils className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Nutrition Tracking</CardTitle>
                <CardDescription>Log and analyze your daily nutrition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Nutrition+Tracking"
                    alt="Nutrition Tracking"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Track calories, macros, and micronutrients with our comprehensive food database.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/nutrition" className="flex items-center justify-center gap-1">
                      Go to Nutrition
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <BarChart className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Visualize your fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Progress+Tracking"
                    alt="Progress Tracking"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Track your measurements, weight, exercise performance, and body composition over time.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/progress" className="flex items-center justify-center gap-1">
                      View Progress
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Workout Scheduler</CardTitle>
                <CardDescription>Plan your fitness routine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Workout+Scheduler"
                    alt="Workout Scheduler"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Schedule workouts in advance and get reminders to keep you consistent.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/reminders" className="flex items-center justify-center gap-1">
                      Set Reminders
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Video className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Exercise Videos</CardTitle>
                <CardDescription>Learn proper form and technique</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Exercise+Videos"
                    alt="Exercise Videos"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Watch instructional videos showing correct exercise form and technique.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/workouts/exercises" className="flex items-center justify-center gap-1">
                      Watch Videos
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Zap className="h-6 w-6 text-primary mb-2" />
                <CardTitle>AI Fitness Coach</CardTitle>
                <CardDescription>Get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=AI+Fitness+Coach"
                    alt="AI Fitness Coach"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Receive AI-generated workout and nutrition recommendations tailored to your goals.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/fitness-assistant" className="flex items-center justify-center gap-1">
                      Talk to Coach
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="workouts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <Dumbbell className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Workout Library</CardTitle>
                <CardDescription>Access hundreds of workout routines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Browse and filter workouts by type, muscle group, equipment, and difficulty.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/workouts" className="flex items-center justify-center gap-1">
                      Explore Workouts
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Video className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Exercise Videos</CardTitle>
                <CardDescription>Learn proper form and technique</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Watch instructional videos showing correct exercise form and technique.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/workouts/exercises" className="flex items-center justify-center gap-1">
                      Watch Videos
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Workout Scheduler</CardTitle>
                <CardDescription>Plan your fitness routine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Schedule workouts in advance and get reminders to keep you consistent.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/reminders" className="flex items-center justify-center gap-1">
                      Set Reminders
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <Utensils className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Nutrition Tracking</CardTitle>
                <CardDescription>Log and analyze your daily nutrition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Track calories, macros, and micronutrients with our comprehensive food database.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/nutrition" className="flex items-center justify-center gap-1">
                      Go to Nutrition
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <FileText className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Meal Plans</CardTitle>
                <CardDescription>Follow structured meal plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Access curated meal plans for various goals including weight loss, muscle gain, and general health.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/nutrition/meal-plans" className="flex items-center justify-center gap-1">
                      View Meal Plans
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Video className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Nutrition Videos</CardTitle>
                <CardDescription>Learn about nutrition fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Watch educational videos about healthy eating, meal prep, and nutrition science.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/nutrition/videos" className="flex items-center justify-center gap-1">
                      Watch Videos
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tracking" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <BarChart className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Visualize your fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Track your measurements, weight, exercise performance, and body composition over time.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/progress" className="flex items-center justify-center gap-1">
                      View Progress
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Heart className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Monitor vital health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Track important health metrics like heart rate, sleep quality, and activity levels.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/progress/health" className="flex items-center justify-center gap-1">
                      Check Metrics
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Award className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Celebrate your milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Earn badges and achievements as you reach fitness milestones and complete challenges.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/achievements" className="flex items-center justify-center gap-1">
                      View Achievements
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <Users className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>Connect with fitness enthusiasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Join our fitness community to share tips, get motivation, and make friends.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/community" className="flex items-center justify-center gap-1">
                      Join Community
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Share2 className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Challenges</CardTitle>
                <CardDescription>Participate in fitness challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Join group challenges to stay motivated and push your limits with others.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/challenges" className="flex items-center justify-center gap-1">
                      View Challenges
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <UserPlus className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Find Workout Partners</CardTitle>
                <CardDescription>Exercise together for better results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Connect with potential workout partners in your area with similar fitness goals.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/partners" className="flex items-center justify-center gap-1">
                      Find Partners
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <Zap className="h-6 w-6 text-primary mb-2" />
                <CardTitle>AI Fitness Coach</CardTitle>
                <CardDescription>Get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Receive AI-generated workout and nutrition recommendations tailored to your goals.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/fitness-assistant" className="flex items-center justify-center gap-1">
                      Talk to Coach
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Video className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Video Form Analysis</CardTitle>
                <CardDescription>AI-powered exercise form analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Upload videos of your exercises to get AI feedback on your form and technique.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/premium/form-analysis" className="flex items-center justify-center gap-1">
                      Analyze Form
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <GraduationCap className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Advanced Training Courses</CardTitle>
                <CardDescription>In-depth fitness education</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Access premium courses taught by fitness experts on specialized training methods.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/premium/courses" className="flex items-center justify-center gap-1">
                      Browse Courses
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <MessageSquare className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Priority Support</CardTitle>
                <CardDescription>Get help faster when you need it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Enjoy priority customer support with faster response times and personalized assistance.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/support" className="flex items-center justify-center gap-1">
                      Contact Support
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Smartphone className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Ad-Free Experience</CardTitle>
                <CardDescription>Enjoy FitLife without interruptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Premium members enjoy an ad-free experience throughout the entire app.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/premium" className="flex items-center justify-center gap-1">
                      Go Premium
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <Cloud className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Unlimited Cloud Storage</CardTitle>
                <CardDescription>Store all your fitness data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Unlimited storage for workout history, progress photos, and all fitness data.</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/premium" className="flex items-center justify-center gap-1">
                      Upgrade Storage
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
} 