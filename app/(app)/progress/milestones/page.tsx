import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Calendar, Award, Dumbbell, Target, TrendingUp, BarChart2, Flag } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Milestones - FitLife",
  description: "Track your fitness achievements and milestones",
}

export default async function MilestonesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Sample data - in a real app, this would come from the database
  const recentMilestones = [
    {
      id: 1,
      title: "First Workout Completed",
      description: "Completed your first workout session",
      date: "April 2, 2023",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      category: "workout",
    },
    {
      id: 2,
      title: "10-Day Streak",
      description: "Logged into the app for 10 consecutive days",
      date: "April 12, 2023",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      category: "consistency",
    },
    {
      id: 3,
      title: "100lb Bench Press",
      description: "Reached 100lb bench press personal record",
      date: "April 18, 2023",
      icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
      category: "strength",
    },
    {
      id: 4,
      title: "Weight Goal Reached",
      description: "Reached your target weight of 160lbs",
      date: "May 5, 2023",
      icon: <Target className="h-5 w-5 text-purple-500" />,
      category: "weight",
    },
    {
      id: 5, 
      title: "5K Run Completed",
      description: "Completed your first 5K run in 28 minutes",
      date: "May 12, 2023",
      icon: <Flag className="h-5 w-5 text-red-500" />,
      category: "cardio",
    },
  ]

  const upcomingMilestones = [
    {
      id: 1,
      title: "30-Day Streak",
      description: "Log into the app for 30 consecutive days",
      progress: 65,
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      category: "consistency",
    },
    {
      id: 2,
      title: "120lb Bench Press",
      description: "Reach 120lb bench press personal record",
      progress: 80,
      icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
      category: "strength",
    },
    {
      id: 3,
      title: "10K Steps Daily",
      description: "Reach 10,000 steps daily for a week",
      progress: 40,
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      category: "activity",
    },
    {
      id: 4,
      title: "Body Fat Reduction",
      description: "Reduce body fat percentage by 5%",
      progress: 30,
      icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
      category: "body",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Milestones" text="Track your fitness journey achievements">
        <Button variant="outline" asChild>
          <Link href="/progress">Back to Progress</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest fitness milestones and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {milestone.icon}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    <div className="flex items-center pt-1">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{milestone.date}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                      {milestone.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-primary" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription>Goals you're working toward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {milestone.icon}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{milestone.title}</p>
                        <p className="text-xs text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{milestone.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Set New Goal
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All-Time Stats</CardTitle>
            <CardDescription>Your lifetime achievement statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Workouts</span>
                </div>
                <p className="mt-2 text-2xl font-bold">68</p>
                <p className="text-xs text-muted-foreground">Total sessions</p>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Streak</span>
                </div>
                <p className="mt-2 text-2xl font-bold">12 days</p>
                <p className="text-xs text-muted-foreground">Longest streak</p>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Achievements</span>
                </div>
                <p className="mt-2 text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Badges earned</p>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Workout Time</span>
                </div>
                <p className="mt-2 text-2xl font-bold">42h</p>
                <p className="text-xs text-muted-foreground">Total time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
} 