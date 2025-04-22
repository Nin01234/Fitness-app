import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentWorkouts } from "@/components/dashboard/recent-workouts"
import { NutritionSummary } from "@/components/dashboard/nutrition-summary"
import { EnhancedImageSlider } from "@/components/dashboard/enhanced-image-slider"
import { WorkoutTips } from "@/components/workouts/workout-tips"
import { ProgressMotivation } from "@/components/progress/progress-motivation"
import { WorkoutCountdown } from "@/components/workouts/workout-countdown"
import { ProgressTracker } from "@/components/dashboard/progress-tracker"
import { NutritionAnalyticsDashboard } from "@/components/nutrition/nutrition-analytics-dashboard"
import { TrackHydration } from "@/components/nutrition/track-hydration"
import { TrackPlantFoods } from "@/components/nutrition/track-plant-foods"
import { TrackProteinSources } from "@/components/nutrition/track-protein-sources"
import { BluetoothConnection } from "@/components/bluetooth-connection"
import { WelcomeGreeting } from "@/components/dashboard/welcome-greeting"
import { NotificationDemo } from "@/components/ui/notifications"
import { redirect } from "next/navigation"
// import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"

export const metadata: Metadata = {
  title: "Dashboard - FitLife",
  description: "Manage your fitness and nutrition journey",
}

export default async function DashboardPage() {
  // Create the supabase client
  const supabase = createClient()
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    // This case might be redundant if the layout already handles it, but good for safety
    redirect("/login") 
  }

  // Fetch profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch recent workouts
  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(3)

  // Fetch goals
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })
    .limit(3)

  // Fetch reminders
  const { data: reminders } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .limit(3)

  // Fetch achievements count with error handling
  let achievementsCount = 0
  try {
    // Use a query that will fail gracefully if the table doesn't exist
    const { count, error } = await supabase
      .from("user_achievements") 
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      
    if (!error && count !== null) {
      achievementsCount = count
    }
  } catch (error) {
    // Silently fallback to default value of 0
    console.error("Error fetching achievements count:", error)
  }

  // Placeholder for streak and goal progress - requires specific logic
  const streakDays = 5 // Placeholder
  const monthlyGoalProgress = 75 // Placeholder

  // Define motivational quotes for the slider
  const motivationalQuotes = [
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "The only bad workout is the one that didn't happen.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Take care of your body. It's the only place you have to live.",
    "The difference between try and triumph is a little umph.",
    "Don't wish for it, work for it.",
    "The hardest lift of all is lifting your butt off the couch.",
    "You don't have to be extreme, just consistent.",
    "Rome wasn't built in a day, and neither was your body.",
    "You are stronger than you think.",
  ]

  return (
    <DashboardShell>
      <EnhancedImageSlider />
      <div className="my-4">
        <WelcomeGreeting userName={profile?.first_name || profile?.full_name || user.email?.split('@')[0]} />
      </div>
      <DashboardHeader heading="Dashboard" text="Track your fitness and nutrition journey" />
      <div className="flex justify-between items-center mb-4">
        {/* <CalendarDateRangePicker /> */}
        <div>
          <NotificationDemo />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats profile={profile} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentWorkouts workouts={recentWorkouts || []} />
        <NutritionSummary userId={user.id} />
        <div className="space-y-6">
          <ProgressMotivation 
            streakDays={streakDays} // Use placeholder
            monthlyGoalProgress={monthlyGoalProgress} // Use placeholder
            achievements={achievementsCount} // Use fetched count with fallback
          />
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <TrackHydration />
              <TrackPlantFoods />
              <TrackProteinSources />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <NutritionAnalyticsDashboard />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ProgressTracker />
        <WorkoutCountdown />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <WorkoutTips />
        <BluetoothConnection />
      </div>

      {/* Dynamic Text Slider */}
      <div className="mt-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-white text-lg font-semibold mb-2">Daily Motivation</h3>
          <div className="h-16 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {motivationalQuotes.map((quote, index) => (
                <div key={index} className="inline-block mx-4 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium">
                  {quote}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

