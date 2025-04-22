import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Crown, Target, Trophy } from "lucide-react"

interface LeaderboardStatsProps {
  userProfile: any
}

export function LeaderboardStats({ userProfile }: LeaderboardStatsProps) {
  const stats = [
    {
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      label: "Your Rank",
      value: "#42",
    },
    {
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      label: "Total Points",
      value: userProfile?.points || 0,
    },
    {
      icon: <Award className="h-5 w-5 text-blue-500" />,
      label: "Achievements",
      value: userProfile?.achievements_count || 0,
    },
    {
      icon: <Target className="h-5 w-5 text-green-500" />,
      label: "Next Level",
      value: `${userProfile?.points % 100}/100`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-background p-2 shadow-sm">{stat.icon}</div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
            {stat.label === "Next Level" && <Progress value={userProfile?.points % 100} className="mt-4" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

