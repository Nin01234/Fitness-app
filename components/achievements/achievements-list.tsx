import { Award, CheckCircle, LockKeyhole } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AchievementsListProps {
  achievements: any[]
  userAchievements: any[]
}

export function AchievementsList({ achievements, userAchievements }: AchievementsListProps) {
  // Create a map of earned achievements for quick lookup
  const earnedMap = new Map(userAchievements.map((ua) => [ua.achievement_id, ua]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Achievements</CardTitle>
        <CardDescription>Complete fitness milestones to earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((achievement) => {
            const isEarned = earnedMap.has(achievement.id)

            return (
              <Card
                key={achievement.id}
                className={`overflow-hidden ${
                  isEarned ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20" : ""
                }`}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{achievement.name}</CardTitle>
                    <Badge variant="outline">{achievement.points} pts</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    {isEarned ? (
                      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Earned
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <LockKeyhole className="mr-1 h-4 w-4" />
                        Locked
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

