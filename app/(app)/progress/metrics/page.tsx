import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, LineChart, BarChart, Activity, Calendar, Ruler, Weight, Heart, Clock } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Progress Metrics - FitLife",
  description: "Track and visualize your fitness metrics over time",
}

export default async function ProgressMetricsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Sample data - in a real app, this would come from the database
  const weightData = [
    { date: "Jan 1", value: 185 },
    { date: "Jan 8", value: 184 },
    { date: "Jan 15", value: 183 },
    { date: "Jan 22", value: 181 },
    { date: "Jan 29", value: 180 },
    { date: "Feb 5", value: 179 },
    { date: "Feb 12", value: 178 },
  ]

  const bodyFatData = [
    { date: "Jan 1", value: 22 },
    { date: "Jan 15", value: 21.5 },
    { date: "Feb 1", value: 21 },
    { date: "Feb 15", value: 20.2 },
  ]

  const strengthData = [
    { exercise: "Bench Press", startValue: 135, currentValue: 155 },
    { exercise: "Squat", startValue: 185, currentValue: 225 },
    { exercise: "Deadlift", startValue: 205, currentValue: 245 },
    { exercise: "Shoulder Press", startValue: 85, currentValue: 105 },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Progress Metrics" text="Track and visualize your fitness metrics over time">
        <Button asChild>
          <Link href="/progress/new">
            <Plus className="mr-2 h-4 w-4" />
            Log New Metrics
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
              <CardDescription>Last recorded</CardDescription>
            </div>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weightData[weightData.length - 1].value} lbs</div>
            <p className="text-xs text-muted-foreground">
              {weightData[0].value > weightData[weightData.length - 1].value ? (
                <span className="text-green-500">↓ {weightData[0].value - weightData[weightData.length - 1].value} lbs</span>
              ) : (
                <span className="text-red-500">↑ {weightData[weightData.length - 1].value - weightData[0].value} lbs</span>
              )} since {weightData[0].date}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Body Fat %</CardTitle>
              <CardDescription>Last recorded</CardDescription>
            </div>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bodyFatData[bodyFatData.length - 1].value}%</div>
            <p className="text-xs text-muted-foreground">
              {bodyFatData[0].value > bodyFatData[bodyFatData.length - 1].value ? (
                <span className="text-green-500">↓ {(bodyFatData[0].value - bodyFatData[bodyFatData.length - 1].value).toFixed(1)}%</span>
              ) : (
                <span className="text-red-500">↑ {(bodyFatData[bodyFatData.length - 1].value - bodyFatData[0].value).toFixed(1)}%</span>
              )} since {bodyFatData[0].date}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Resting Heart Rate</CardTitle>
              <CardDescription>Last recorded</CardDescription>
            </div>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68 bpm</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↓ 4 bpm</span> since Jan 1
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weight" className="mt-6">
        <TabsList>
          <TabsTrigger value="weight" className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            Weight
          </TabsTrigger>
          <TabsTrigger value="body" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Body Metrics
          </TabsTrigger>
          <TabsTrigger value="strength" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Strength
          </TabsTrigger>
          <TabsTrigger value="cardio" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Cardio
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
              <CardDescription>Your weight progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* This would be a chart component in a real implementation */}
                <div className="w-full h-full flex items-end justify-between border-b border-l relative">
                  {weightData.map((point, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="bg-primary w-6 rounded-t" 
                        style={{ 
                          height: `${((point.value - 170) / 30) * 250}px`,
                        }}
                      ></div>
                      <span className="text-xs mt-1 rotate-45 origin-left">{point.date}</span>
                    </div>
                  ))}
                  <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
                    <span>190 lbs</span>
                    <span>185 lbs</span>
                    <span>180 lbs</span>
                    <span>175 lbs</span>
                    <span>170 lbs</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/progress/new?metric=weight">Log New Weight</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="body" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Body Composition</CardTitle>
              <CardDescription>Track changes in your body composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Body Fat %</span>
                      <span className="font-medium">{bodyFatData[bodyFatData.length - 1].value}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{width: `${100 - bodyFatData[bodyFatData.length - 1].value}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Muscle Mass</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full" 
                        style={{width: "42%"}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Water %</span>
                      <span className="font-medium">58%</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 rounded-full" 
                        style={{width: "58%"}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>BMI</span>
                      <span className="font-medium">24.2</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{width: "70%"}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Body Measurements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex justify-between border rounded p-2">
                      <span className="text-sm text-muted-foreground">Chest</span>
                      <span className="text-sm font-medium">42"</span>
                    </div>
                    <div className="flex justify-between border rounded p-2">
                      <span className="text-sm text-muted-foreground">Waist</span>
                      <span className="text-sm font-medium">32"</span>
                    </div>
                    <div className="flex justify-between border rounded p-2">
                      <span className="text-sm text-muted-foreground">Hips</span>
                      <span className="text-sm font-medium">38"</span>
                    </div>
                    <div className="flex justify-between border rounded p-2">
                      <span className="text-sm text-muted-foreground">Arms</span>
                      <span className="text-sm font-medium">15"</span>
                    </div>
                    <div className="flex justify-between border rounded p-2">
                      <span className="text-sm text-muted-foreground">Thighs</span>
                      <span className="text-sm font-medium">24"</span>
                    </div>
                    <div className="flex justify-between border rounded p-2">
                      <span className="text-sm text-muted-foreground">Calves</span>
                      <span className="text-sm font-medium">16"</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/progress/new?metric=body">Log New Measurements</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="strength" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Strength Progress</CardTitle>
              <CardDescription>Track your lifting progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strengthData.map((exercise, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{exercise.exercise}</span>
                      <span className="font-medium">{exercise.currentValue} lbs</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{width: `${(exercise.currentValue / 300) * 100}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started: {exercise.startValue} lbs</span>
                      <span className="text-green-500">+{exercise.currentValue - exercise.startValue} lbs</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/progress/new?metric=strength">Log New Strength PR</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cardio" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cardio Performance</CardTitle>
              <CardDescription>Track your cardiovascular fitness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Resting Heart Rate</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {[72, 70, 71, 69, 70, 68, 68].map((bpm, i) => (
                      <div key={i} className="space-y-1">
                        <div 
                          className="bg-red-500 w-full rounded-t" 
                          style={{ height: `${((bpm - 60) / 30) * 60}px` }}
                        ></div>
                        <span className="text-xs block text-center">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Last 7 days</span>
                    <span>Average: 69.7 bpm</span>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium">Running Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded p-3 space-y-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">5K Time</span>
                      </div>
                      <div className="text-xl font-bold">25:42</div>
                      <p className="text-xs text-green-500">-1:20 from previous best</p>
                    </div>
                    
                    <div className="border rounded p-3 space-y-1">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Max Pace</span>
                      </div>
                      <div className="text-xl font-bold">7:45/mi</div>
                      <p className="text-xs text-green-500">-0:30 from previous best</p>
                    </div>
                    
                    <div className="border rounded p-3 space-y-1">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Avg HR Zone</span>
                      </div>
                      <div className="text-xl font-bold">Zone 3</div>
                      <p className="text-xs text-muted-foreground">148 bpm average</p>
                    </div>
                    
                    <div className="border rounded p-3 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Weekly Distance</span>
                      </div>
                      <div className="text-xl font-bold">15.8 mi</div>
                      <p className="text-xs text-green-500">+2.3 mi from last week</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/progress/new?metric=cardio">Log New Cardio Metrics</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
} 