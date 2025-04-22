"use client"

import { useState } from "react"
import {
  Trophy,
  Award,
  Star,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  Circle,
  Share2,
  Lock,
  Unlock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Achievement {
  id: string
  name: string
  description: string
  badge_image: string
  points: number
  requirements: Record<string, any>
  category?: string
  difficulty?: "easy" | "medium" | "hard" | "expert"
  emoji?: string
}

interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  date_earned: string
  achievements: Achievement
}

interface EnhancedAchievementsListProps {
  achievements: Achievement[]
  userAchievements: UserAchievement[]
}

export function EnhancedAchievementsList({ achievements, userAchievements }: EnhancedAchievementsListProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Add emojis to achievements if they don't have them
  const achievementsWithEmojis = achievements.map((achievement) => {
    if (achievement.emoji) return achievement

    // Default emojis based on achievement names or categories
    let emoji = "🏆"

    const name = achievement.name.toLowerCase()
    const category = achievement.category?.toLowerCase() || ""

    if (name.includes("workout") || category.includes("workout")) {
      emoji = "💪"
    } else if (
      name.includes("nutrition") ||
      name.includes("food") ||
      name.includes("meal") ||
      category.includes("nutrition")
    ) {
      emoji = "🥗"
    } else if (name.includes("water") || name.includes("hydration")) {
      emoji = "💧"
    } else if (name.includes("weight") || name.includes("loss")) {
      emoji = "⚖️"
    } else if (name.includes("streak") || name.includes("consecutive")) {
      emoji = "🔥"
    } else if (name.includes("step") || name.includes("walk") || name.includes("run")) {
      emoji = "👟"
    } else if (name.includes("sleep")) {
      emoji = "😴"
    } else if (name.includes("first")) {
      emoji = "🎯"
    } else if (name.includes("expert") || name.includes("master")) {
      emoji = "🥇"
    }

    return {
      ...achievement,
      emoji,
    }
  })

  // Group achievements by category
  const groupedAchievements = achievementsWithEmojis.reduce(
    (groups, achievement) => {
      const category = achievement.category || "General"
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(achievement)
      return groups
    },
    {} as Record<string, Achievement[]>,
  )

  // Get earned achievement IDs
  const earnedAchievementIds = userAchievements.map((ua) => ua.achievement_id)

  // Calculate progress for each achievement
  const getAchievementProgress = (achievement: Achievement) => {
    // This would normally come from the user's actual progress data
    // For now, we'll generate random progress for demonstration
    if (earnedAchievementIds.includes(achievement.id)) {
      return 100
    }

    // Generate random progress between 0-99% for unearned achievements
    return Math.floor(Math.random() * 100)
  }

  const openAchievementDetails = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setIsDialogOpen(true)
  }

  const getAchievementDate = (achievementId: string) => {
    const userAchievement = userAchievements.find((ua) => ua.achievement_id === achievementId)
    return userAchievement ? new Date(userAchievement.date_earned).toLocaleDateString() : null
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-orange-500"
      case "expert":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const renderAchievementCard = (achievement: Achievement) => {
    const isEarned = earnedAchievementIds.includes(achievement.id)
    const progress = getAchievementProgress(achievement)

    return (
      <Card
        key={achievement.id}
        className={`overflow-hidden transition-all hover:shadow-md ${isEarned ? "border-primary" : ""}`}
        onClick={() => openAchievementDetails(achievement)}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${isEarned ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <span className="text-lg">{achievement.emoji}</span>
              </div>
              <div>
                <CardTitle className="text-base">{achievement.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-1">{achievement.description}</CardDescription>
              </div>
            </div>
            <Badge variant={isEarned ? "default" : "outline"} className="ml-2">
              {isEarned ? "Earned" : `${progress}%`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}% Complete</span>
              <span>{achievement.points} pts</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </CardContent>
        <CardFooter className="p-2 border-t flex justify-between items-center bg-muted/50">
          <div className="flex items-center text-xs text-muted-foreground">
            {isEarned ? (
              <>
                <Calendar className="h-3 w-3 mr-1" />
                <span>Earned on {getAchievementDate(achievement.id)}</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                <span>In progress</span>
              </>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-6">
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                {category} Achievements
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">{categoryAchievements.map(renderAchievementCard)}</div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="earned" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {achievementsWithEmojis
              .filter((achievement) => earnedAchievementIds.includes(achievement.id))
              .map(renderAchievementCard)}
          </div>
          {earnedAchievementIds.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No achievements earned yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Complete fitness challenges and activities to earn achievements and rewards.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {achievementsWithEmojis
              .filter(
                (achievement) =>
                  !earnedAchievementIds.includes(achievement.id) && getAchievementProgress(achievement) > 0,
              )
              .map(renderAchievementCard)}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="mt-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Weekly Challenges
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                        <span className="text-lg">🏃</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">10K Steps Challenge</CardTitle>
                        <CardDescription className="text-xs">Complete 10,000 steps daily for 5 days</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      3/5 days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>60% Complete</span>
                      <span>100 pts</span>
                    </div>
                    <Progress value={60} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t flex justify-between items-center bg-muted/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>2 days remaining</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                        <span className="text-lg">🥗</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">Protein Champion</CardTitle>
                        <CardDescription className="text-xs">
                          Meet your protein goal for 7 consecutive days
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      4/7 days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>57% Complete</span>
                      <span>150 pts</span>
                    </div>
                    <Progress value={57} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t flex justify-between items-center bg-muted/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>3 days remaining</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Monthly Challenges
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white">
                        <span className="text-lg">🏋️</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">Strength Master</CardTitle>
                        <CardDescription className="text-xs">Complete 20 strength workouts this month</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      12/20
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>60% Complete</span>
                      <span>300 pts</span>
                    </div>
                    <Progress value={60} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t flex justify-between items-center bg-muted/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>12 days remaining</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                        <span className="text-lg">⚖️</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">Weight Loss Challenge</CardTitle>
                        <CardDescription className="text-xs">Lose 2% body fat this month</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      1.2/2%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>60% Complete</span>
                      <span>500 pts</span>
                    </div>
                    <Progress value={60} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t flex justify-between items-center bg-muted/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>12 days remaining</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievement Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedAchievement.emoji}</span>
                  {selectedAchievement.name}
                </DialogTitle>
                <DialogDescription>{selectedAchievement.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{selectedAchievement.points} points</span>
                  </div>
                  <Badge
                    variant={selectedAchievement.difficulty ? "default" : "outline"}
                    className={selectedAchievement.difficulty ? getDifficultyColor(selectedAchievement.difficulty) : ""}
                  >
                    {selectedAchievement.difficulty
                      ? selectedAchievement.difficulty.charAt(0).toUpperCase() + selectedAchievement.difficulty.slice(1)
                      : "Standard"}
                  </Badge>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-medium">Requirements</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedAchievement.requirements).map(([key, value]) => {
                      const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                      return (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span>{formattedKey}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Progress</h4>
                  <Progress value={getAchievementProgress(selectedAchievement)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{getAchievementProgress(selectedAchievement)}% Complete</span>
                    {earnedAchievementIds.includes(selectedAchievement.id) && (
                      <span>Earned on {getAchievementDate(selectedAchievement.id)}</span>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-2">Rewards</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedAchievement.points} Points</p>
                      <p className="text-xs text-muted-foreground">Added to your total score</p>
                    </div>
                  </div>

                  {earnedAchievementIds.includes(selectedAchievement.id) ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Unlock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Badge Unlocked</p>
                        <p className="text-xs text-muted-foreground">Display on your profile</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Badge Locked</p>
                        <p className="text-xs text-muted-foreground">Complete achievement to unlock</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button size="sm" className="gap-1">
                  {earnedAchievementIds.includes(selectedAchievement.id) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Earned
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      Track Progress
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

