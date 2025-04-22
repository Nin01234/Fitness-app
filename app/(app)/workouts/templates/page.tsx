import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search, Plus, Dumbbell, Heart, Clock, BarChart3, Tag } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Workout Templates - FitLife",
  description: "Browse and save workout templates for your fitness journey",
}

export default async function WorkoutTemplatesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const workoutTemplates = [
    {
      id: 1,
      title: "Full Body Strength",
      description: "Complete full body strength workout for all fitness levels",
      duration: "45 mins",
      level: "Intermediate",
      category: "Strength",
      exercises: 12,
      saved: 245,
    },
    {
      id: 2,
      title: "HIIT Cardio Blast",
      description: "High intensity interval training to maximize calorie burn",
      duration: "30 mins",
      level: "Advanced",
      category: "Cardio",
      exercises: 8,
      saved: 187,
    },
    {
      id: 3,
      title: "Beginner Bodyweight",
      description: "Simple bodyweight exercises perfect for beginners",
      duration: "25 mins",
      level: "Beginner",
      category: "Bodyweight",
      exercises: 7,
      saved: 310,
    },
    {
      id: 4,
      title: "Core Crusher",
      description: "Focused abdominal and core workout",
      duration: "20 mins",
      level: "Intermediate",
      category: "Core",
      exercises: 9,
      saved: 220,
    },
    {
      id: 5,
      title: "Upper Body Power",
      description: "Chest, shoulders, and arms focused routine",
      duration: "40 mins",
      level: "Intermediate",
      category: "Strength",
      exercises: 10,
      saved: 168,
    },
    {
      id: 6,
      title: "Lower Body Burnout",
      description: "Legs and glutes focused training session",
      duration: "35 mins",
      level: "Intermediate",
      category: "Strength",
      exercises: 8,
      saved: 195,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Workout Templates"
        text="Browse and save ready-made workout templates to your library"
      >
        <Button asChild>
          <Link href="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Custom
          </Link>
        </Button>
      </DashboardHeader>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search templates..."
              className="w-full rounded-md border border-input pl-8 pr-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full overflow-x-auto whitespace-nowrap border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger value="all" className="rounded-none px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent">
              All Templates
            </TabsTrigger>
            <TabsTrigger value="strength" className="rounded-none px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent">
              Strength
            </TabsTrigger>
            <TabsTrigger value="cardio" className="rounded-none px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent">
              Cardio
            </TabsTrigger>
            <TabsTrigger value="hiit" className="rounded-none px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent">
              HIIT
            </TabsTrigger>
            <TabsTrigger value="flexibility" className="rounded-none px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent">
              Flexibility
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-none px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent">
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="h-2 bg-blue-600"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{template.title}</CardTitle>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Clock className="h-3 w-3 mr-1" />
                        {template.duration}
                      </div>
                      <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {template.level}
                      </div>
                      <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Tag className="h-3 w-3 mr-1" />
                        {template.category}
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{template.exercises} exercises</span>
                      <span className="mx-2">•</span>
                      <span>{template.saved} saves</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/workouts/start?template=${template.id}`}>
                        Use Template
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {["strength", "cardio", "hiit", "flexibility", "saved"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workoutTemplates
                  .filter(t => 
                    tab === "saved" ? true : 
                    t.category.toLowerCase() === tab.toLowerCase())
                  .map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <div className="h-2 bg-blue-600"></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{template.title}</CardTitle>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Clock className="h-3 w-3 mr-1" />
                            {template.duration}
                          </div>
                          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {template.level}
                          </div>
                          <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Tag className="h-3 w-3 mr-1" />
                            {template.category}
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{template.exercises} exercises</span>
                          <span className="mx-2">•</span>
                          <span>{template.saved} saves</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/workouts/start?template=${template.id}`}>
                            Use Template
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardShell>
  )
} 