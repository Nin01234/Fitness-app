import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { NutritionStats } from "@/components/nutrition/nutrition-stats"
import { MealsList } from "@/components/nutrition/meals-list"
import { NutritionTips } from "@/components/nutrition/nutrition-tips"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen, Droplets, Leaf, Beef, Calendar, BarChart, ChevronRight, ClipboardList, History, Utensils, GitFork } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { NutritionAnalyticsDashboard } from "@/components/nutrition/nutrition-analytics-dashboard"
import { TrackHydration } from "@/components/nutrition/track-hydration"
import { TrackPlantFoods } from "@/components/nutrition/track-plant-foods"
import { TrackProteinSources } from "@/components/nutrition/track-protein-sources"
import { CreateMealPlan } from "@/components/nutrition/create-meal-plan"
import { NotificationsUI } from "@/components/notifications/notifications-ui"
import { NutritionPredictor } from "@/components/nutrition/nutrition-predictor"

export const metadata: Metadata = {
  title: "Nutrition - FitLife",
  description: "Track your nutrition and meal planning",
}

export default async function NutritionPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch meals for today
  const today = new Date().toISOString().split("T")[0]
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user?.id)
    .gte("date", `${today}T00:00:00`)
    .lte("date", `${today}T23:59:59`)
    .order("date", { ascending: true })

  return (
    <DashboardShell className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-blue-950/50">
      {/* Hero Section with Text Slider */}
      <div className="relative mb-8 overflow-hidden rounded-xl group">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-photo-952476-KAmCbOW0pQq10eQbg3sxomosyODAg1.jpeg"
            alt="Fresh fruits and vegetables"
            fill
            className="object-cover brightness-[0.7] transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-10 text-white">
          <div className="max-w-2xl">
            <div className="overflow-hidden h-12 mb-3">
              <div className="animate-slide-up-down">
                <div className="h-12 flex items-center">
                  <span className="px-3 py-1 text-sm bg-green-600 rounded-full inline-block">Nutrition Center</span>
                </div>
                <div className="h-12 flex items-center">
                  <span className="px-3 py-1 text-sm bg-blue-600 rounded-full inline-block">Meal Planning</span>
                </div>
                <div className="h-12 flex items-center">
                  <span className="px-3 py-1 text-sm bg-amber-600 rounded-full inline-block">Recipe Suggestions</span>
                </div>
                <div className="h-12 flex items-center">
                  <span className="px-3 py-1 text-sm bg-purple-600 rounded-full inline-block">Nutrient Tracking</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden h-16 mb-3">
              <div className="animate-slide-up-down" style={{ animationDelay: "1s" }}>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Balanced Nutrition for Optimal Health</h1>
                </div>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Fuel Your Body with Proper Nutrition</h1>
                </div>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Discover Healthy Eating Habits</h1>
                </div>
                <div className="h-16 flex items-center">
                  <h1 className="text-4xl font-bold drop-shadow-md">Personalized Nutrition Insights</h1>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden h-20 mb-6">
              <div className="animate-slide-up-down" style={{ animationDelay: "2s" }}>
                <div className="h-20 flex items-center">
                  <p className="text-lg leading-relaxed drop-shadow-md">
                    Discover how to properly balance your water, vegetables, and protein intake to fuel your body and live a healthier life.
                  </p>
                </div>
                <div className="h-20 flex items-center">
                  <p className="text-lg leading-relaxed drop-shadow-md">
                    Create personalized meal plans based on your fitness goals, dietary preferences, and nutritional needs.
                  </p>
                </div>
                <div className="h-20 flex items-center">
                  <p className="text-lg leading-relaxed drop-shadow-md">
                    Track your daily intake of essential nutrients and make informed decisions about your diet and wellness.
                  </p>
                </div>
                <div className="h-20 flex items-center">
                  <p className="text-lg leading-relaxed drop-shadow-md">
                    Get real-time feedback on your nutritional habits and expert recommendations for improvement.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
              >
                <Link href="/nutrition/log-meal">
                  <Plus className="mr-2 h-5 w-5" /> Log Meal
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
              >
                <Link href="/nutrition/meal-plans">
                  <Calendar className="mr-2 h-5 w-5" /> Meal Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="mb-10">
        <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-6 bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden p-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <ClipboardList className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="meals" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Utensils className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Meals</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <History className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">History</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Plans</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <GitFork className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline-block">Recipes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 pt-2">
          <NutritionStats userId={user?.id} />
          <NutritionPredictor />
          <NutritionAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6 pt-2">
          {/* Nutrition Elements Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="overflow-hidden rounded-xl border-blue-100 dark:border-blue-900 shadow-md hover:shadow-lg transition-all duration-300 group hover:border-blue-300 dark:hover:border-blue-700">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <CardHeader className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/50 pb-0">
                <CardTitle>Water Intake</CardTitle>
                <CardDescription>Stay hydrated for optimal health</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Goal: 2.5L</span>
                    <span className="text-sm font-medium">Current: 1.2L</span>
                  </div>
                  <Progress 
                    value={48} 
                    className="h-2.5 bg-blue-100 dark:bg-blue-950" 
                  />
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full p-1 mr-2 mt-0.5">
                        •
                      </span>
                      <span>Drink 8-10 glasses (2-2.5L) of water daily</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full p-1 mr-2 mt-0.5">
                        •
                      </span>
                      <span>Increase intake during exercise or hot weather</span>
                    </li>
                  </ul>
                  <TrackHydration />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-all duration-300 group hover:border-green-300 dark:hover:border-green-700">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <CardHeader className="bg-gradient-to-b from-green-50 to-transparent dark:from-green-950/50 pb-0">
                <CardTitle>Vegetable Intake</CardTitle>
                <CardDescription>Fuel your body with essential nutrients</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Goal: 5 servings</span>
                    <span className="text-sm font-medium">Current: 3 servings</span>
                  </div>
                  <Progress
                    value={60}
                    className="h-2.5 bg-green-100 dark:bg-green-950"
                  />
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full p-1 mr-2 mt-0.5">
                        •
                      </span>
                      <span>Aim for 5+ servings of vegetables daily</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full p-1 mr-2 mt-0.5">
                        •
                      </span>
                      <span>Include a variety of colors for different nutrients</span>
                    </li>
                  </ul>
                  <TrackPlantFoods />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-red-100 dark:border-red-900 shadow-md hover:shadow-lg transition-all duration-300 group hover:border-red-300 dark:hover:border-red-700">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300">
                <Beef className="h-8 w-8 text-white" />
              </div>
              <CardHeader className="bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/50 pb-0">
                <CardTitle>Protein Intake</CardTitle>
                <CardDescription>Build and repair muscle tissue</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Goal: 120g</span>
                    <span className="text-sm font-medium">Current: 85g</span>
                  </div>
                  <Progress 
                    value={70} 
                    className="h-2.5 bg-red-100 dark:bg-red-950" 
                  />
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full p-1 mr-2 mt-0.5">
                        •
                      </span>
                      <span>Consume 1.6-2.2g of protein per kg of body weight</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full p-1 mr-2 mt-0.5">
                        •
                      </span>
                      <span>Include both animal and plant-based sources</span>
                    </li>
                  </ul>
                  <TrackProteinSources />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-6 pt-2">
          <MealsList meals={meals || []} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6 pt-2">
          <NutritionAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6 pt-2">
          <CreateMealPlan />
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6 pt-2">
          <NutritionTips />
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 p-6 rounded-xl mb-6 border border-indigo-100 dark:border-indigo-900 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Nutrition Wisdom
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              "Let food be thy medicine and medicine be thy food."
            </p>
            <p className="text-xs text-right mt-2 font-medium text-gray-500 dark:text-gray-500">- Hippocrates</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison."
            </p>
            <p className="text-xs text-right mt-2 font-medium text-gray-500 dark:text-gray-500">- Ann Wigmore</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              "Take care of your body. It's the only place you have to live."
            </p>
            <p className="text-xs text-right mt-2 font-medium text-gray-500 dark:text-gray-500">- Jim Rohn</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <Link href="/nutrition/log-meal" className="flex items-center justify-between group">
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">Log Meal</h3>
                  <p className="text-sm text-muted-foreground">Record your nutritional intake</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <Link href="/nutrition/meal-plans" className="flex items-center justify-between group">
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">Meal Plans</h3>
                  <p className="text-sm text-muted-foreground">Plan your weekly meals</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <Link href="/nutrition/recipes" className="flex items-center justify-between group">
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">Recipes</h3>
                  <p className="text-sm text-muted-foreground">Find healthy recipe ideas</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <Link href="/nutrition/analytics" className="flex items-center justify-between group">
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300">
                  <BarChart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track your nutritional trends</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

