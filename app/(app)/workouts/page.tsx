import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { WorkoutsList } from "@/components/workouts/workouts-list"
import { EnhancedWorkoutTips } from "@/components/workouts/enhanced-workout-tips"
import { WorkoutAiTrainer } from "@/components/ai/workout-ai-trainer"
import { ActivityTracker } from "@/components/workouts/activity-tracker"
import { ActivityTracking } from "./activity-tracking"
import { DynamicBackground } from "@/components/workouts/dynamic-background"
import { 
  Plus, 
  Play, 
  MapPin, 
  Dumbbell, 
  Flame, 
  Trophy, 
  Zap, 
  Timer, 
  ListChecks, 
  BarChart, 
  Calendar, 
  History, 
  Target,
  ChevronRight,
  Users,
  Medal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = {
  title: "Workouts - FitLife",
  description: "Manage your workout routines and exercises",
}

export default async function WorkoutsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch workouts
  const { data: workouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false })

  return (
    <DashboardShell className="bg-gradient-to-b from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-blue-950/50">
      {/* Replace static hero section with DynamicBackground */}
      <DynamicBackground className="mb-8">
        <div className="p-10 text-white">
          <div className="max-w-xl">
            <div className="overflow-hidden h-12 mb-3">
              <div className="animate-slide-up-down">
                <div className="h-12 flex items-center">
                  <Badge className="bg-green-600 text-white hover:bg-green-700">
                    Workout Zone
                  </Badge>
                </div>
                <div className="h-12 flex items-center">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                    Fitness Tracker
                  </Badge>
                </div>
                <div className="h-12 flex items-center">
                  <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                    Exercise Library
                  </Badge>
                </div>
                <div className="h-12 flex items-center">
                  <Badge className="bg-amber-600 text-white hover:bg-amber-700">
                    Performance Center
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden h-16 mb-3">
              <div className="animate-slide-up-down" style={{ animationDelay: "1s" }}>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Build Your Routine</h1>
                </div>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Track Your Progress</h1>
                </div>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Reach Your Goals</h1>
                </div>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Maximize Your Potential</h1>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden h-20 mb-6">
              <div className="animate-slide-up-down" style={{ animationDelay: "2s" }}>
                <div className="h-20 flex items-center">
                  <p className="text-lg drop-shadow-md">
                    Create personalized workouts, track your progress, and achieve your fitness goals
                  </p>
                </div>
                <div className="h-20 flex items-center">
                  <p className="text-lg drop-shadow-md">
                    Record your fitness journey and visualize improvements over time
                  </p>
                </div>
                <div className="h-20 flex items-center">
                  <p className="text-lg drop-shadow-md">
                    Access a comprehensive library of exercises and workout templates
                  </p>
                </div>
                <div className="h-20 flex items-center">
                  <p className="text-lg drop-shadow-md">
                    Get insights and recommendations to optimize your training experience
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group"
              >
                <Link href="/workouts/start">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> Start Workout
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
              >
                <Link href="/workouts/new">
                  <Plus className="mr-2 h-5 w-5" /> Create New
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DynamicBackground>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 grid-cols-2 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                <Dumbbell className="mr-2 h-5 w-5" /> Weekly Workouts
              </CardTitle>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                4
              </div>
            </div>
            <CardDescription>You've completed 4 out of 5 planned workouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={80} className="h-2 bg-blue-100 dark:bg-blue-900/50" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950 dark:to-amber-950 border-red-100 dark:border-red-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center text-red-700 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                <Flame className="mr-2 h-5 w-5" /> Calories Burned
              </CardTitle>
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                2.8k
              </div>
            </div>
            <CardDescription>2,845 calories burned this week</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={70} className="h-2 bg-red-100 dark:bg-red-900/50" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-100 dark:border-green-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center text-green-700 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                <Trophy className="mr-2 h-5 w-5" /> Achievements
              </CardTitle>
              <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                7
              </div>
            </div>
            <CardDescription>7 fitness achievements this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-2 bg-green-100 dark:bg-green-900/50" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-100 dark:border-purple-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                <Target className="mr-2 h-5 w-5" /> Weekly Goal
              </CardTitle>
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                82%
              </div>
            </div>
            <CardDescription>You're on track to meet your goal</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={82} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 p-1 bg-background/70 backdrop-blur-sm rounded-xl overflow-hidden">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <ListChecks className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <ListChecks className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Workout Templates</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Zap className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Activity Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Progress Stats</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Plans</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Medal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Flame className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Tips</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3 space-y-6">
              <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <div className="flex items-center justify-between">
                    <div>
                  <CardTitle>My Workouts</CardTitle>
                  <CardDescription>Manage your custom workout routines</CardDescription>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                      <Link href="/workouts/new">
                        <Plus className="mr-2 h-4 w-4" />New Workout
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <WorkoutsList workouts={workouts || []} />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card className="border-amber-100 dark:border-amber-900 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
                  <CardTitle>Workout Categories</CardTitle>
                  <CardDescription>Explore different workout types</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-amber-100 dark:divide-amber-900">
                    <Link href="/workouts/templates?category=strength" className="flex items-center justify-between p-4 hover:bg-amber-50/50 dark:hover:bg-amber-950/50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 mr-3">
                          <Dumbbell className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Strength Training</h4>
                          <p className="text-sm text-muted-foreground">Build muscle and power</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link href="/workouts/templates?category=cardio" className="flex items-center justify-between p-4 hover:bg-amber-50/50 dark:hover:bg-amber-950/50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 mr-3">
                          <Flame className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Cardio</h4>
                          <p className="text-sm text-muted-foreground">Improve endurance and burn calories</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link href="/workouts/templates?category=hiit" className="flex items-center justify-between p-4 hover:bg-amber-50/50 dark:hover:bg-amber-950/50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 mr-3">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">HIIT</h4>
                          <p className="text-sm text-muted-foreground">High intensity interval training</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link href="/workouts/templates?category=flexibility" className="flex items-center justify-between p-4 hover:bg-amber-50/50 dark:hover:bg-amber-950/50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 mr-3">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Flexibility</h4>
                          <p className="text-sm text-muted-foreground">Stretching and yoga</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
            </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <ActivityTracking />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border-purple-100 dark:border-purple-900 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-b border-purple-100 dark:border-purple-900">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Workout Analytics</CardTitle>
                  <CardDescription>Track your progress and performance</CardDescription>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 self-start sm:self-center">
                  <BarChart className="h-4 w-4 mr-2" /> View Reports
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg border border-purple-100 dark:border-purple-900 overflow-hidden bg-white dark:bg-black mb-6">
                <div className="bg-purple-50 dark:bg-purple-950 p-4 border-b border-purple-100 dark:border-purple-900">
                  <h3 className="font-medium">Weekly Workout Summary</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div className="p-3 rounded-md bg-purple-50 dark:bg-purple-950">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">4</p>
                      <p className="text-xs text-muted-foreground">Workouts</p>
                    </div>
                    <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-950">
                      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">245</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950">
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">2845</p>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Strength</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Cardio</span>
                        <span>32%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Flexibility</span>
                        <span>23%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Workout Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-end h-[140px] gap-2">
                      {[35, 70, 45, 80, 60, 25, 55].map((value, index) => (
                        <div 
                          key={index} 
                          className="w-8 bg-gradient-to-t from-purple-600 to-indigo-600 rounded-t-md"
                          style={{ height: `${value}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Most Trained Muscle Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Legs</span>
                          <span>32%</span>
                        </div>
                        <Progress value={32} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Chest</span>
                          <span>28%</span>
                        </div>
                        <Progress value={28} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Back</span>
                          <span>22%</span>
                        </div>
                        <Progress value={22} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Arms</span>
                          <span>18%</span>
                        </div>
                        <Progress value={18} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b border-blue-100 dark:border-blue-900">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Workout Plans</CardTitle>
                  <CardDescription>Structured workout programs for your goals</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 self-start sm:self-center">
                  <Plus className="h-4 w-4 mr-2" /> Create Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-blue-100 dark:divide-blue-900">
                {/* Plan Item 1 */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
                        <Dumbbell className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Strength Builder</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          12-week progressive overload program
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            5 days/week
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            Intermediate
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="h-8 border-blue-200 dark:border-blue-800">
                      View Plan
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">35% complete</p>
                  </div>
                </div>
                
                {/* Plan Item 2 */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                        <Flame className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Fat Burn HIIT</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          8-week high intensity interval training
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                            3 days/week
                          </Badge>
                          <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                            All levels
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="h-8 border-indigo-200 dark:border-indigo-800">
                      View Plan
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">Not started</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t border-blue-100 dark:border-blue-900 p-4">
              <Button variant="outline" className="w-full">
                Browse All Plans
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card className="border-amber-100 dark:border-amber-900 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-b border-amber-100 dark:border-amber-900">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Fitness Challenges</CardTitle>
                  <CardDescription>Join challenges and compete with others</CardDescription>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 self-start sm:self-center">
                  <Medal className="h-4 w-4 mr-2" /> Join Challenge
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-amber-100 dark:divide-amber-900">
                {/* Challenge Item 1 */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">30-Day Push-Up Challenge</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Gradually increase your push-up count over 30 days
                        </p>
                        <div className="flex gap-2">
                          <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800">
                            Active Challenge
                          </Badge>
                          <Badge variant="outline" className="bg-amber-50/50 dark:bg-amber-950/50">
                            1,240 participants
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="h-8 border-amber-200 dark:border-amber-800">
                      View Details
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">Day 12 of 30</p>
                      <p className="text-xs text-muted-foreground">40% complete</p>
                    </div>
                  </div>
                </div>
                
                {/* Challenge Item 2 */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300">
                        <Flame className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Summer Shred Challenge</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          8-week fat loss and muscle toning challenge
                        </p>
                        <div className="flex gap-2">
                          <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
                            Upcoming
                          </Badge>
                          <Badge variant="outline" className="bg-green-50/50 dark:bg-green-950/50">
                            Starts in 5 days
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button className="h-8 bg-green-600 hover:bg-green-700">
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t border-amber-100 dark:border-amber-900 p-4">
              <Button variant="outline" className="w-full">
                Explore All Challenges
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <EnhancedWorkoutTips />
          
          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b border-blue-100 dark:border-blue-900">
              <CardTitle>Smart Workout Recommendations</CardTitle>
              <CardDescription>Personalized recommendations based on your activity</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-100 dark:border-blue-900">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium">Upper Body Focus</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on your recent workouts, it's time to focus on upper body exercises.
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-blue-200 dark:border-blue-800">
                      View Recommendations
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-100 dark:border-indigo-900">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2">
                        <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="font-medium">Workout Intensity</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Consider increasing weights in your strength sessions for better results.
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-indigo-200 dark:border-indigo-800">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workout AI Trainer */}
      <WorkoutAiTrainer />
    </DashboardShell>
  )
}

