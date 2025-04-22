import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LeaderboardTable } from "@/components/achievements/leaderboard-table"
import { LeaderboardStats } from "@/components/achievements/leaderboard-stats"

export const metadata: Metadata = {
  title: "Leaderboard - FitLife",
  description: "See how you rank among other users",
}

export default async function LeaderboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch top users by points
  const { data: topUsers } = await supabase.from("profiles").select("*").order("points", { ascending: false }).limit(10)

  // Fetch user's rank
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  return (
    <DashboardShell>
      <DashboardHeader heading="Leaderboard" text="See how you stack up against other fitness enthusiasts" />
      <div className="grid gap-6">
        <LeaderboardStats userProfile={userProfile} />
        <LeaderboardTable topUsers={topUsers || []} currentUserId={user?.id} />
      </div>
    </DashboardShell>
  )
}

