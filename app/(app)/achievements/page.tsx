import type { Metadata } from "next"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EnhancedAchievementsList } from "@/components/achievements/enhanced-achievements-list"
import { AchievementsProgress } from "@/components/achievements/achievements-progress"
import { GamificationSystem } from "@/components/achievements/gamification-system"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Target, Award, Crown } from "lucide-react"
import { AchievementHeroVideo } from "@/components/achievements/achievement-hero-video"

export const metadata: Metadata = {
  title: "Achievements - FitLife",
  description: "Track your fitness achievements and rewards",
}

export default async function AchievementsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", user?.id)

  // Fetch all achievements
  const { data: allAchievements } = await supabase
    .from("achievements")
    .select("*")
    .order("points", { ascending: false })

  // Fetch user profile for points
  const { data: profile } = await supabase.from("profiles").select("points").eq("id", user?.id).single()

  // If no achievements in database, use sample data
  const sampleAchievements = [
    {
      id: "1",
      name: "First Workout",
      description: "Complete your first workout with FitLife",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 25,
      requirements: { workouts: 1 },
      emoji: "🎯",
      category: "Beginner",
      difficulty: "easy",
    },
    {
      id: "2",
      name: "5-Day Streak",
      description: "Log in for 5 consecutive days",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 50,
      requirements: { login_streak: 5 },
      emoji: "🔥",
      category: "Consistency",
      difficulty: "easy",
    },
    {
      id: "3",
      name: "Weight Loss Milestone",
      description: "Lose your first 5 pounds",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 100,
      requirements: { weight_loss: 5 },
      emoji: "⚖️",
      category: "Progress",
      difficulty: "medium",
    },
    {
      id: "4",
      name: "Nutrition Master",
      description: "Log your meals for 7 consecutive days",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 75,
      requirements: { nutrition_streak: 7 },
      emoji: "🥗",
      category: "Nutrition",
      difficulty: "medium",
    },
    {
      id: "5",
      name: "Early Bird",
      description: "Complete 5 workouts before 8 AM",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 50,
      requirements: { early_workouts: 5 },
      emoji: "🌅",
      category: "Lifestyle",
      difficulty: "medium",
    },
    {
      id: "6",
      name: "Marathon Runner",
      description: "Run a total of 26.2 miles",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 150,
      requirements: { running_distance: 26.2 },
      emoji: "🏃",
      category: "Cardio",
      difficulty: "hard",
    },
    {
      id: "7",
      name: "Strength Gains",
      description: "Increase your strength by 20%",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 100,
      requirements: { strength_increase: 20 },
      emoji: "💪",
      category: "Strength",
      difficulty: "hard",
    },
    {
      id: "8",
      name: "Hydration Hero",
      description: "Track water intake for 10 consecutive days",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 50,
      requirements: { water_tracking: 10 },
      emoji: "💧",
      category: "Nutrition",
      difficulty: "easy",
    },
    {
      id: "9",
      name: "Social Butterfly",
      description: "Connect with 5 friends on FitLife",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 30,
      requirements: { friends: 5 },
      emoji: "🦋",
      category: "Social",
      difficulty: "easy",
    },
    {
      id: "10",
      name: "Perfect Week",
      description: "Complete all your planned workouts for a week",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 100,
      requirements: { perfect_week: 1 },
      emoji: "✅",
      category: "Consistency",
      difficulty: "medium",
    },
    {
      id: "11",
      name: "Meal Prep Pro",
      description: "Use the meal planner for 4 consecutive weeks",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 75,
      requirements: { meal_planning_weeks: 4 },
      emoji: "🍱",
      category: "Nutrition",
      difficulty: "medium",
    },
    {
      id: "12",
      name: "Sleep Champion",
      description: "Log 8+ hours of sleep for 14 consecutive days",
      badge_image: "/placeholder.svg?height=40&width=40",
      points: 100,
      requirements: { sleep_streak: 14 },
      emoji: "😴",
      category: "Lifestyle",
      difficulty: "hard",
    },
  ]

  // Sample user achievements
  const sampleUserAchievements = [
    {
      id: "ua1",
      user_id: user?.id,
      achievement_id: "1",
      date_earned: new Date().toISOString(),
      achievements: sampleAchievements.find((a) => a.id === "1"),
    },
    {
      id: "ua2",
      user_id: user?.id,
      achievement_id: "2",
      date_earned: new Date().toISOString(),
      achievements: sampleAchievements.find((a) => a.id === "2"),
    },
    {
      id: "ua4",
      user_id: user?.id,
      achievement_id: "4",
      date_earned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      achievements: sampleAchievements.find((a) => a.id === "4"),
    },
  ]

  return (
    <DashboardShell>
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-8">
        <AchievementHeroVideo />
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">Your Achievements</h1>
          <p className="mt-2 text-lg">Track your fitness milestones and earn rewards</p>
        </div>
      </div>

      <GamificationSystem 
        userPoints={profile?.points || 250}
        achievements={allAchievements || sampleAchievements}
        earnedAchievements={userAchievements || sampleUserAchievements}
        streakDays={Math.min(5, Math.floor(Math.random() * 6))} // Demo streak days
      />

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-100 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Achievements</p>
                <p className="text-2xl font-bold">
                  {userAchievements?.length || sampleUserAchievements.length} /{" "}
                  {allAchievements?.length || sampleAchievements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <p className="text-2xl font-bold">{profile?.points || 250}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-100 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold">Level {Math.floor((profile?.points || 250) / 100) + 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-100 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
                <p className="text-2xl font-bold">#12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-5">
          <EnhancedAchievementsList
            achievements={allAchievements?.length ? allAchievements : sampleAchievements}
            userAchievements={userAchievements?.length ? userAchievements : sampleUserAchievements}
          />
        </div>
        <div className="space-y-6 md:col-span-2">
          <AchievementsProgress
            userPoints={profile?.points || 0}
            earnedCount={userAchievements?.length || sampleUserAchievements.length}
            totalCount={allAchievements?.length || sampleAchievements.length}
          />

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/workoutdown.jpg-PAV6MhuPFWtFZHFQ0uQBd6cE8dLaxC.jpeg"
                  alt="Achievement motivation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold">Earn Rewards 🏆</h3>
                    <p className="text-sm">Complete challenges to unlock achievements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/full-body-workout-gym.jpg-4SbfGYwfrgmsVWN6kX7G4D0XlAhOz8.jpeg"
                  alt="Fitness achievement"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold">Team Challenges 🏋️‍♂️</h3>
                    <p className="text-sm">Join group workouts for bonus points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

