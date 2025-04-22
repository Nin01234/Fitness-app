import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, PieChart, AreaChart, Activity, Calendar, Ruler, Weight, Heart, Share2, Download, Filter } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Progress Analytics - FitLife",
  description: "Advanced analysis of your fitness progress and trends",
}

export default async function AnalyticsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // For presentation purposes - these would be calculated from actual data
  const weeklyData = {
    workoutMinutes: [45, 60, 0, 75, 30, 0, 90],
    calories: [320, 450, 0, 520, 220, 0, 580],
    daysActive: 5,
    totalMinutes: 300,
    avgHeartRate: 142,
    performance: 87,
  }

  const monthlyTrends = {
    weight: [185, 183, 182, 181, 180, 179, 178, 177, 176, 175.5, 175, 174],
    bodyFat: [22, 21.5, 21.2, 20.8, 20.5, 20.2, 20, 19.8, 19.5, 19.3, 19.1, 19],
    muscle: [38, 38.2, 38.5, 39, 39.3, 39.5, 39.8, 40, 40.3, 40.5, 40.8, 41],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  }

  const workoutBreakdown = {
    categories: [
      { name: "Strength", percentage: 45, color: "bg-blue-500" },
      { name: "Cardio", percentage: 30, color: "bg-red-500" },
      { name: "Flexibility", percentage: 15, color: "bg-green-500" },
      { name: "Sports", percentage: 10, color: "bg-yellow-500" },
    ],
    muscleGroups: [
      { name: "Chest", percentage: 22, color: "bg-orange-500" },
      { name: "Back", percentage: 21, color: "bg-purple-500" },
      { name: "Legs", percentage: 25, color: "bg-cyan-500" },
      { name: "Arms", percentage: 18, color: "bg-indigo-500" },
      { name: "Core", percentage: 14, color: "bg-pink-500" },
    ],
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Progress Analytics" text="In-depth analysis of your fitness journey">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" asChild>
            <Link href="/progress">Back to Progress</Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Data updated: <span className="font-medium">Today, 9:41 AM</span>
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Active Days</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.daysActive}/7</div>
              <div className="mt-4 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(weeklyData.daysActive / 7) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">+2 days compared to last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workout Minutes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.totalMinutes}</div>
              <p className="text-xs text-muted-foreground">+45 minutes from last week</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>Goal: 360</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(weeklyData.totalMinutes / 360) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.avgHeartRate} bpm</div>
              <p className="text-xs text-muted-foreground">During workouts</p>
              <div className="mt-4 grid grid-cols-5 gap-1 text-xs">
                <div className="rounded bg-red-100 p-1 text-center font-medium">
                  Rest<br />60-80
                </div>
                <div className="rounded bg-blue-100 p-1 text-center font-medium">
                  Light<br />81-100
                </div>
                <div className="rounded bg-green-100 p-1 text-center font-medium">
                  Moderate<br />101-140
                </div>
                <div className="rounded bg-yellow-100 p-1 text-center font-medium border-2 border-primary">
                  Hard<br />141-160
                </div>
                <div className="rounded bg-red-100 p-1 text-center font-medium">
                  Max<br />161+
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Index</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.performance}%</div>
              <p className="text-xs text-green-500">+5% from last month</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Consistency</span>
                  <span className="font-medium">Good</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-green-500" style={{ width: "85%" }}></div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Intensity</span>
                  <span className="font-medium">Excellent</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: "92%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Body Composition Trends</CardTitle>
              <CardDescription>Track your physical changes over time</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end">
                  {monthlyTrends.weight.map((weight, index) => (
                    <div key={index} className="relative mx-1 flex h-full flex-1 flex-col justify-end">
                      <div
                        className="w-full rounded-t bg-blue-500 transition-all"
                        style={{ height: `${((weight - 170) / 20) * 100}%` }}
                      ></div>
                      <div className="absolute -bottom-6 w-full text-center">
                        <span className="text-xs text-muted-foreground">
                          {monthlyTrends.months[index]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Weight (lbs)</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Body Fat %</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Muscle Mass %</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workout Category Breakdown</CardTitle>
              <CardDescription>Your training focus by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutBreakdown.categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <span className="text-sm font-medium">{category.percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Muscle Group Focus</CardTitle>
              <CardDescription>Distribution of muscle training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto h-[200px] w-[200px]">
                <div className="h-full w-full rounded-full bg-muted"></div>
                {/* Simulate a pie chart with absolute positioning */}
                <div className="absolute left-0 top-0 h-full w-full">
                  {workoutBreakdown.muscleGroups.map((group, index) => {
                    const rotation = index > 0 ? 
                      workoutBreakdown.muscleGroups
                        .slice(0, index)
                        .reduce((acc, curr) => acc + curr.percentage, 0) : 0;
                    
                    return (
                      <div 
                        key={index} 
                        className={`absolute left-1/2 top-1/2 h-[100px] w-[100px] -translate-x-[50%] -translate-y-[50%] ${group.color} rounded-full`}
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation + group.percentage / 2) * 0.0628)}% ${50 - 50 * Math.sin((rotation + group.percentage / 2) * 0.0628)}%, ${50 + 50 * Math.cos(rotation * 0.0628)}% ${50 - 50 * Math.sin(rotation * 0.0628)}%)`,
                          transform: `rotate(${rotation * 3.6}deg)`,
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {workoutBreakdown.muscleGroups.map((group, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`mr-2 h-3 w-3 rounded-full ${group.color}`}></div>
                    <span className="text-xs">{group.name} ({group.percentage}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your workout frequency and intensity by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="mb-1 text-sm font-medium">{day}</div>
                  <div className="mx-auto flex h-24 w-full flex-col items-center justify-end space-y-1">
                    {weeklyData.workoutMinutes[index] > 0 ? (
                      <>
                        <div 
                          className="w-full rounded-t bg-primary" 
                          style={{ height: `${(weeklyData.workoutMinutes[index] / 90) * 100}%` }}
                        ></div>
                        <span className="text-xs">{weeklyData.workoutMinutes[index]}m</span>
                        <span className="text-xs text-muted-foreground">{weeklyData.calories[index]} cal</span>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded border border-dashed">
                        <span className="text-xs text-muted-foreground">Rest</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Detailed Reports
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}

// Helper component for clock icon
function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
} 