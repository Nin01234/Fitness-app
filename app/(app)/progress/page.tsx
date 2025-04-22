import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ProgressChart } from "@/components/progress/progress-chart"
import { ProgressEntries } from "@/components/progress/progress-entries"
import { ProgressStats } from "@/components/progress/progress-stats"
import { ProgressPhotos } from "@/components/progress/progress-photos"
import { MeasurementTracker } from "@/components/progress/measurement-tracker"
import { Plus, TrendingUp, Camera, Award, Calendar, ChevronRight, LineChart, BarChart, Clipboard, Target } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Progress - FitLife",
  description: "Track your fitness progress over time",
}

export default async function ProgressPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let progressEntries = []
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user?.id)
      .order("date", { ascending: false })
      .limit(10)

    if (!error) {
      progressEntries = data
    }
  } catch (error) {
    console.error("Error fetching progress data:", error)
  }

  return (
    <DashboardShell className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mart-production-8033081.jpg-DmcgeiJlmH97MiajYAtGCryKSsVsb4.jpeg"
            alt="Person tracking fitness progress"
            fill
            className="object-cover brightness-[0.6]"
            priority
          />
        </div>
        <div className="relative z-10 p-12 text-white">
          <h1 className="text-4xl font-bold mb-3 drop-shadow-md">Track Your Progress</h1>
          <p className="text-xl max-w-xl drop-shadow-md">Monitor your fitness journey and celebrate your achievements along the way</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white shadow-lg"
            >
              <Link href="/progress/new">
                <Plus className="mr-2 h-5 w-5" /> New Entry
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="backdrop-blur-md bg-white/30 text-white border-white/40 hover:bg-white/40 hover:text-white shadow-lg"
            >
              <Link href="/progress/analytics">
                <LineChart className="mr-2 h-5 w-5" /> View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="transform transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
                  <TrendingUp className="mr-2 h-5 w-5" /> Body Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track weight, body fat percentage, and other key measurements
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/progress/metrics" className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                  View details <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="transform transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-100 dark:border-purple-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
                  <Camera className="mr-2 h-5 w-5" /> Visual Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload and compare progress photos to see your transformation
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/progress/photos" className="text-sm text-purple-600 dark:text-purple-400 flex items-center">
                  View photos <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="transform transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-100 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
                  <Award className="mr-2 h-5 w-5" /> Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Set and achieve fitness milestones to stay motivated</p>
              </CardContent>
              <CardFooter>
                <Link href="/progress/milestones" className="text-sm text-amber-600 dark:text-amber-400 flex items-center">
                  View milestones <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="transform transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-100 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                  <Calendar className="mr-2 h-5 w-5" /> Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track your workout and nutrition consistency over time</p>
              </CardContent>
              <CardFooter>
                <Link href="/progress/consistency" className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  View streaks <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <div className="space-y-6 md:col-span-5">
              <Card className="overflow-hidden shadow-md border-blue-100 dark:border-blue-800">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-blue-600" /> Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ProgressChart userId={user?.id} />
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden shadow-md border-purple-100 dark:border-purple-800">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 pb-2">
                    <CardTitle className="flex items-center">
                      <Camera className="mr-2 h-5 w-5 text-purple-600" /> Recent Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ProgressPhotos userId={user?.id} />
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden shadow-md border-green-100 dark:border-green-800">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 pb-2">
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-green-600" /> Measurements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MeasurementTracker userId={user?.id} />
                  </CardContent>
                </Card>
              </div>
              
              <Card className="overflow-hidden shadow-md border-slate-100 dark:border-slate-800">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-2">
                  <CardTitle className="flex items-center">
                    <Clipboard className="mr-2 h-5 w-5 text-slate-600" /> Recent Entries
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ProgressEntries entries={progressEntries} />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="sticky top-24 overflow-hidden shadow-md border-blue-100 dark:border-blue-800">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 pb-2">
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-blue-600" /> Progress Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ProgressStats userId={user?.id} entries={progressEntries} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="text-center p-16 border rounded-xl">
            <h3 className="text-xl font-medium mb-2">Detailed Metrics View</h3>
            <p className="text-muted-foreground mb-4">This section will display detailed metrics tracking.</p>
            <Button asChild>
              <Link href="/progress/metrics">Go to Metrics</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="text-center p-16 border rounded-xl">
            <h3 className="text-xl font-medium mb-2">Progress Photos Gallery</h3>
            <p className="text-muted-foreground mb-4">This section will display your progress photo gallery.</p>
            <Button asChild>
              <Link href="/progress/photos">View Photo Gallery</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="text-center p-16 border rounded-xl">
            <h3 className="text-xl font-medium mb-2">Complete Progress History</h3>
            <p className="text-muted-foreground mb-4">This section will display your complete progress history.</p>
            <Button asChild>
              <Link href="/progress/history">View Full History</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

