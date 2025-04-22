import type { Metadata } from "next"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronRight, Clock, Download, Filter, Plus, Utensils } from "lucide-react"
import { DynamicBackground } from "@/components/workouts/dynamic-background"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Custom Meal Plans - FitLife",
  description: "Personalized meal plans for your fitness goals",
}

export default async function MealPlansPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <DashboardShell>
      <DynamicBackground className="mb-8">
        <div className="p-10 text-white">
          <div className="max-w-2xl">
            <Badge className="bg-green-600 text-white hover:bg-green-700 mb-3">Nutrition Planning</Badge>
            <h1 className="text-3xl font-bold drop-shadow-md">Custom Meal Plans</h1>
            <p className="mt-2 text-lg max-w-2xl drop-shadow-md">
              Personalized nutrition plans tailored to your fitness goals, dietary preferences, and lifestyle needs.
            </p>
          </div>
        </div>
      </DynamicBackground>

      <div className="flex items-center justify-between mb-6">
        <DashboardHeader heading="Your Meal Plans" text="Discover and create personalized meal plans" />
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommended" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-green-50 dark:bg-green-950">
          <TabsTrigger
            value="recommended"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-green-900"
          >
            Recommended
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-white dark:data-[state=active]:bg-green-900">
            My Plans
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white dark:data-[state=active]:bg-green-900">
            Templates
          </TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-white dark:data-[state=active]:bg-green-900">
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-photo-1640777-PEZh4JvArPYV4KL0ULSaKH0escF7Vp.jpeg"
                  alt="High Protein Plan"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </div>
              </div>
              <CardHeader>
                <CardTitle>High Protein Plan</CardTitle>
                <CardDescription>Perfect for muscle building and recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Utensils className="h-4 w-4 mr-2 text-green-600" />
                    <span>2,200 calories per day</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>5 meals per day</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>7-day rotation</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Start Plan
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-nc-farm-bureau-mark-2255935.jpg-vul0YI8PlX8WOj92rHeVsALvERkNiz.jpeg"
                  alt="Weight Loss Plan"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Trending
                </div>
              </div>
              <CardHeader>
                <CardTitle>Weight Loss Plan</CardTitle>
                <CardDescription>Balanced nutrition with calorie deficit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Utensils className="h-4 w-4 mr-2 text-green-600" />
                    <span>1,800 calories per day</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>6 small meals per day</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>14-day rotation</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Start Plan
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-photo-1414651-rmgKt4wntqxsa2QFaIKx5YevlWZ2zS.jpeg"
                  alt="Plant-Based Plan"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  New
                </div>
              </div>
              <CardHeader>
                <CardTitle>Plant-Based Plan</CardTitle>
                <CardDescription>Nutrient-rich vegan meal options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Utensils className="h-4 w-4 mr-2 text-green-600" />
                    <span>2,000 calories per day</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>4 meals per day</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>10-day rotation</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Start Plan
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Nutrition Plan</CardTitle>
                <CardDescription>Get a custom meal plan created just for you by our nutrition experts</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-photo-952476-KAmCbOW0pQq10eQbg3sxomosyODAg1.jpeg"
                    alt="Fresh fruits and vegetables"
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-md"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Custom Meal Planning</h3>
                    <p className="text-sm mb-4 max-w-md">
                      Our nutrition experts will create a personalized meal plan based on your fitness goals, dietary
                      preferences, and lifestyle.
                    </p>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
                      Create My Custom Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Motivational Quote */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-100 dark:border-green-900 p-6">
            <div className="text-center">
              <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                "Let food be thy medicine and medicine be thy food."
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">— Hippocrates</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">You haven't created any custom meal plans yet</h3>
            <p className="text-muted-foreground mb-6">Create your first custom meal plan to get started</p>
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
              <Plus className="mr-2 h-4 w-4" /> Create New Plan
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-juliazolotova-1320997.jpg-5nYfVuSe8fUYmh5m9JFLDXCyA5aFiT.jpeg"
                  alt="Mediterranean Diet"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Mediterranean Diet</CardTitle>
                <CardDescription>Heart-healthy meals inspired by Mediterranean cuisine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Download className="h-4 w-4 mr-2 text-green-600" />
                    <span>Downloaded 2.4k times</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>21-day plan</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-charlotte-may-5946720.jpg-Si4nCGPSvPXIMOKMCzT5kqdgkTeSDU.jpeg"
                  alt="Keto Diet"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Keto Diet</CardTitle>
                <CardDescription>Low-carb, high-fat meals for ketogenic lifestyle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Download className="h-4 w-4 mr-2 text-green-600" />
                    <span>Downloaded 3.1k times</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>14-day plan</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mjombadii-1446504.jpg-43b2yHKUmy3bVQOYXswEIrFzX6LO4U.jpeg"
                  alt="Intermittent Fasting"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Intermittent Fasting</CardTitle>
                <CardDescription>Meal timing strategies with nutritious recipes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Download className="h-4 w-4 mr-2 text-green-600" />
                    <span>Downloaded 1.8k times</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <span>7-day plan</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="outline" className="flex items-center gap-1">
              View All Templates <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No favorite meal plans yet</h3>
            <p className="text-muted-foreground mb-6">Browse plans and mark them as favorites to see them here</p>
            <Button variant="outline">Browse Meal Plans</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Additional Motivational Quotes */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-base italic mb-2">
                "You are what you eat, so don't be fast, cheap, easy, or fake."
              </p>
              <p className="text-xs text-muted-foreground">— Unknown</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-base italic mb-2">
                "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison."
              </p>
              <p className="text-xs text-muted-foreground">— Ann Wigmore</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-base italic mb-2">
                "Take care of your body. It's the only place you have to live."
              </p>
              <p className="text-xs text-muted-foreground">— Jim Rohn</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

