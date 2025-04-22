"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Trophy, Flame, Award } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getUserStats } from "@/lib/activity-tracking"

interface ProfileStatsProps {
  profile: any
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const [stats, setStats] = useState({
    workouts: 0,
    calories: 0,
    streak: 0,
    achievements: 0,
    goalProgress: {
      weight: 0,
      workout: 0,
      nutrition: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserStats() {
      if (!profile?.id) return
      
      setIsLoading(true)
      try {
        const userStats = await getUserStats(profile.id)
        setStats(userStats)
      } catch (error) {
        console.error('Error fetching user stats:', error)
        toast({
          title: "Error loading stats",
          description: "Could not load your fitness statistics",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserStats()
  }, [profile?.id])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Profile Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{profile?.full_name || profile?.username || "User"}</h2>
            <p className="text-sm text-muted-foreground">{profile?.fitness_level || "Fitness Enthusiast"}</p>
          </div>

          <div className="mt-4 w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Level {Math.floor((profile?.points || 0) / 100) + 1}</span>
              <span>{profile?.points % 100}/100 XP</span>
            </div>
            <Progress value={profile?.points % 100} className="h-2" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-lg bg-muted p-3">
                <Dumbbell className="mb-1 h-5 w-5 text-primary" />
                <span className="text-xl font-bold">{stats.workouts}</span>
                <span className="text-xs text-muted-foreground">Workouts</span>
              </div>

              <div className="flex flex-col items-center rounded-lg bg-muted p-3">
                <Flame className="mb-1 h-5 w-5 text-orange-500" />
                <span className="text-xl font-bold">{stats.calories.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">Calories</span>
              </div>

              <div className="flex flex-col items-center rounded-lg bg-muted p-3">
                <Trophy className="mb-1 h-5 w-5 text-yellow-500" />
                <span className="text-xl font-bold">{stats.streak}</span>
                <span className="text-xs text-muted-foreground">Streak Days</span>
              </div>

              <div className="flex flex-col items-center rounded-lg bg-muted p-3">
                <Award className="mb-1 h-5 w-5 text-blue-500" />
                <span className="text-xl font-bold">{stats.achievements}</span>
                <span className="text-xs text-muted-foreground">Achievements</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Goals Progress</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Weight Goal</span>
                    <span>{stats.goalProgress.weight}%</span>
                  </div>
                  <Progress value={stats.goalProgress.weight} className="h-1.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Workout Goal</span>
                    <span>{stats.goalProgress.workout}%</span>
                  </div>
                  <Progress value={stats.goalProgress.workout} className="h-1.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Nutrition Goal</span>
                    <span>{stats.goalProgress.nutrition}%</span>
                  </div>
                  <Progress value={stats.goalProgress.nutrition} className="h-1.5" />
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

