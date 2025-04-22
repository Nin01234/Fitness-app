import { Award, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AchievementsProgressProps {
  userPoints: number
  earnedCount: number
  totalCount: number
}

export function AchievementsProgress({ userPoints, earnedCount, totalCount }: AchievementsProgressProps) {
  // Calculate level based on points
  const level = Math.floor(userPoints / 100) + 1
  const pointsToNextLevel = 100 - (userPoints % 100)
  const levelProgress = userPoints % 100

  // Calculate achievement completion percentage
  const achievementPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Level</CardTitle>
          <CardDescription>Earn points to level up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">Level {level}</p>
                <p className="text-sm text-muted-foreground">{userPoints} total points</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">{pointsToNextLevel} points needed for next level</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {earnedCount}/{totalCount}
                </p>
                <p className="text-sm text-muted-foreground">Achievements earned</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Completion</span>
              <span>{achievementPercentage}%</span>
            </div>
            <Progress value={achievementPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

