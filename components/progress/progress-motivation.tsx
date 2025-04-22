import { Star, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressMotivationProps {
  streakDays: number
  monthlyGoalProgress: number
  achievements: number
}

export function ProgressMotivation({ streakDays, monthlyGoalProgress, achievements }: ProgressMotivationProps) {
  const motivationalQuotes = [
    "Every rep brings you closer to your goals!",
    "You're stronger than you think!",
    "Small progress is still progress!",
    "Keep pushing, keep growing!",
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle>Motivation Center</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-primary/10 p-4 text-center">
          <p className="text-sm font-medium text-primary">{randomQuote}</p>
        </div>

        <div className="space-y-4">
          {/* Removed streak notification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Monthly Goal</span>
              </div>
              <span>{monthlyGoalProgress}%</span>
            </div>
            <Progress value={monthlyGoalProgress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-medium">Achievements</span>
            </div>
            <span className="text-xl font-bold">{achievements}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-medium">Pro Tips</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Set realistic, achievable goals</li>
            <li>Track your progress regularly</li>
            <li>Celebrate small victories</li>
            <li>Stay consistent with your routine</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

