"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  Trophy, Star, Crown, Gift, Zap, 
  Award, Flame, Check, Target, ArrowUp, 
  Plus, Unlock, Lock 
} from 'lucide-react'
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { toast } from 'sonner'

interface AchievementType {
  id: string
  name: string
  description: string
  badge_image: string
  points: number
  requirements: any
  emoji: string
  category: string
  difficulty: string
}

interface EarnedAchievementType {
  id: string
  user_id: string
  achievement_id: string
  date_earned: string
  achievements: AchievementType
}

interface GamificationSystemProps {
  userPoints: number
  achievements: AchievementType[]
  earnedAchievements: EarnedAchievementType[]
  streakDays: number
}

export function GamificationSystem({
  userPoints,
  achievements,
  earnedAchievements,
  streakDays,
}: GamificationSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false)
  const [achievementToShow, setAchievementToShow] = useState<AchievementType | null>(null)
  const [userLevel, setUserLevel] = useState(1)
  const [nextLevelPoints, setNextLevelPoints] = useState(100)
  const [progressToNextLevel, setProgressToNextLevel] = useState(0)
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string[]>([])

  // Demo gamification elements
  const badges = [
    { id: "badge1", name: "Workout Warrior", progress: 75, total: 100, image: "/placeholder.svg" },
    { id: "badge2", name: "Nutrition Master", progress: 50, total: 100, image: "/placeholder.svg" },
    { id: "badge3", name: "Early Bird", progress: 20, total: 100, image: "/placeholder.svg" },
  ]

  const challenges = [
    { id: "challenge1", name: "Complete 5 workouts this week", progress: 3, total: 5, reward: "50 points" },
    { id: "challenge2", name: "Track nutrition for 7 days straight", progress: 5, total: 7, reward: "100 points" },
    { id: "challenge3", name: "Reach 10,000 steps daily for 5 days", progress: 2, total: 5, reward: "75 points" },
  ]

  const rewards = [
    { id: "reward1", name: "Workout Plan Template", points: 500, claimed: false },
    { id: "reward2", name: "Premium Recipe Collection", points: 1000, claimed: false },
    { id: "reward3", name: "Virtual Training Session", points: 2500, claimed: false },
  ]

  // Determine user level and progress based on points
  useEffect(() => {
    // Simple level calculation: 100 points for level 1, 200 more for level 2, etc.
    // This creates a progressive difficulty curve
    let remainingPoints = userPoints
    let level = 0
    let nextLevelCost = 100

    while (remainingPoints >= nextLevelCost) {
      remainingPoints -= nextLevelCost
      level++
      nextLevelCost = 100 * (level + 1)
    }

    setUserLevel(Math.max(1, level))
    setNextLevelPoints(nextLevelCost)
    setProgressToNextLevel(Math.min(100, (remainingPoints / nextLevelCost) * 100))
  }, [userPoints])

  // Simulate achievement unlock on first render for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (earnedAchievements.length > 0 && !recentlyUnlocked.includes(earnedAchievements[0].achievement_id)) {
        setAchievementToShow(earnedAchievements[0].achievements)
        setShowUnlockAnimation(true)
        setRecentlyUnlocked([...recentlyUnlocked, earnedAchievements[0].achievement_id])
        
        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Filter achievements by category
  const getFilteredAchievements = () => {
    if (selectedCategory === "all") return achievements
    return achievements.filter((achievement) => achievement.category.toLowerCase() === selectedCategory.toLowerCase())
  }

  // Get earned achievement IDs for quick lookup
  const earnedAchievementIds = earnedAchievements.map((earned) => earned.achievement_id)

  // Handle unlocking achievement (simulated for demo)
  const handleUnlockAchievement = (achievement: AchievementType) => {
    if (earnedAchievementIds.includes(achievement.id)) return
    
    setAchievementToShow(achievement)
    setShowUnlockAnimation(true)
    setRecentlyUnlocked([...recentlyUnlocked, achievement.id])
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    toast.success(`Achievement Unlocked! ${achievement.name}`, {
      description: `+${achievement.points} points added to your account!`
    })
  }

  // Handle claiming a reward (simulated for demo)
  const handleClaimReward = (reward: any) => {
    if (userPoints < reward.points) {
      toast.error("Not enough points to claim this reward")
      return
    }
    
    toast.success(`Reward Claimed: ${reward.name}`, {
      description: "Check your rewards section to access your new content!"
    })
  }

  // Get achievement progress percentage (simulated for demo)
  const getAchievementProgress = (achievement: AchievementType) => {
    // This would use real data in a production app
    const isEarned = earnedAchievementIds.includes(achievement.id)
    if (isEarned) return 100
    
    // Random progress for demo
    const progressMap: Record<string, number> = {
      "1": 100, // First workout (if not earned, assume 0%)
      "2": Math.min(100, (streakDays / 5) * 100), // 5-day streak
      "3": 30, // Weight loss milestone
      "4": 65, // Nutrition master
      "5": 40, // Early bird
      "6": 15, // Marathon runner
      "7": 25, // Strength gains
      "8": 70, // Hydration hero
      "9": 10, // Social butterfly
      "10": 60, // Perfect week
      "11": 80, // Meal prep pro
      "12": 45, // Sleep champion
    }
    
    return progressMap[achievement.id] || Math.floor(Math.random() * 80)
  }

  // Get difficulty label styling
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
    }
  }

  // Get achievement icon based on category
  const getAchievementIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      "Beginner": <Trophy className="w-5 h-5 text-amber-500" />,
      "Consistency": <Flame className="w-5 h-5 text-red-500" />,
      "Progress": <Target className="w-5 h-5 text-indigo-500" />,
      "Nutrition": <Award className="w-5 h-5 text-emerald-500" />,
      "Lifestyle": <Star className="w-5 h-5 text-sky-500" />,
      "Cardio": <Zap className="w-5 h-5 text-pink-500" />,
      "Strength": <Award className="w-5 h-5 text-purple-500" />,
      "Social": <Star className="w-5 h-5 text-amber-500" />,
    }
    
    return iconMap[category] || <Award className="w-5 h-5 text-slate-500" />
  }

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-100 dark:border-indigo-800 overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Crown className="h-16 w-16 text-amber-300 opacity-10" />
        </div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Level {userLevel}</CardTitle>
              <CardDescription>
                {userPoints} total points • {Math.round(nextLevelPoints - (progressToNextLevel * nextLevelPoints / 100))} points to next level
              </CardDescription>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 mr-2">
                <Flame className="h-3.5 w-3.5 mr-1 text-amber-500" />
                {streakDays} Day Streak
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                <Trophy className="h-3.5 w-3.5 mr-1 text-amber-500" />
                {earnedAchievements.length} Achievements
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress to Level {userLevel + 1}</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-900">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Animation */}
      <AnimatePresence>
        {showUnlockAnimation && achievementToShow && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUnlockAnimation(false)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              className="relative bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl flex flex-col items-center max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-8 flex justify-center w-full"
              >
                <span className="text-4xl">{achievementToShow.emoji}</span>
              </motion.div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mt-4">Achievement Unlocked!</h2>
                <p className="text-2xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  {achievementToShow.name}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{achievementToShow.description}</p>
                
                <div className="mt-4 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="font-bold text-amber-500">+{achievementToShow.points} points</span>
                </div>
              </div>
              
              <Button className="mt-6 w-full" onClick={() => setShowUnlockAnimation(false)}>
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Achievements Section */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Achievements</span>
            <span className="sm:hidden">Achieve</span>
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Challenges</span>
            <span className="sm:hidden">Challenge</span>
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Rewards</span>
            <span className="sm:hidden">Reward</span>
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Badge>
            {Array.from(new Set(achievements.map((a) => a.category))).map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.toLowerCase())}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredAchievements().map((achievement) => {
              const isEarned = earnedAchievementIds.includes(achievement.id)
              const progress = getAchievementProgress(achievement)
              
              return (
                <Card
                  key={achievement.id}
                  className={`border transition-all duration-300 ${
                    isEarned
                      ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700"
                      : "hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <CardHeader className="pb-2 relative">
                    {isEarned && (
                      <div className="absolute top-3 right-3">
                        <Unlock className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {isEarned ? (
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
                          {getAchievementIcon(achievement.category)}
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {getAchievementIcon(achievement.category)}
                        </div>
                      )}
                      <div>
                        <CardTitle className={isEarned ? "text-amber-800 dark:text-amber-400" : ""}>
                          {achievement.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getDifficultyStyle(achievement.difficulty)}`}
                          >
                            {achievement.difficulty}
                          </Badge>
                          <span>{achievement.points} pts</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{isEarned ? "Completed" : "Progress"}</span>
                        <span>{isEarned ? "100%" : `${progress}%`}</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    {isEarned ? (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center">
                        <Trophy className="h-3.5 w-3.5 mr-1" />
                        Earned {new Date(
                          earnedAchievements.find((e) => e.achievement_id === achievement.id)?.date_earned || ""
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => handleUnlockAchievement(achievement)}
                      >
                        {progress >= 100 ? (
                          <>
                            <Unlock className="h-3.5 w-3.5 mr-1" /> Claim Reward
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5 mr-1" /> In Progress
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="border hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <Target className="w-4 h-4" />
                      </div>
                      <span>{challenge.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {challenge.progress} / {challenge.total}
                      </span>
                    </div>
                    <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward:</span>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                      <Trophy className="h-3.5 w-3.5 mr-1 text-amber-500" />
                      {challenge.reward}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={challenge.progress < challenge.total}
                  >
                    {challenge.progress >= challenge.total ? "Claim Reward" : "In Progress"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="border border-dashed p-4 flex items-center justify-center">
            <Link href="#">
              <Button variant="ghost" className="group">
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Discover more challenges
                </span>
              </Button>
            </Link>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className={`border transition-all duration-300 ${
                  reward.claimed
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800"
                    : "hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span>{reward.name}</span>
                  </CardTitle>
                  <CardDescription className="font-medium">
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                      <Trophy className="h-3.5 w-3.5 mr-1 text-amber-500" />
                      {reward.points} points
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Required Points:</span>
                      <span className="font-medium">{reward.points}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your Points:</span>
                      <span className={`font-medium ${userPoints >= reward.points ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {userPoints}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={reward.claimed ? "outline" : "default"}
                    disabled={userPoints < reward.points || reward.claimed}
                    onClick={() => handleClaimReward(reward)}
                  >
                    {reward.claimed ? "Claimed" : userPoints >= reward.points ? "Claim Reward" : "Not Enough Points"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Link href="#">
            <Card className="border border-dashed hover:border-primary/50 p-4 flex items-center justify-center hover:bg-muted/50 transition-all duration-300">
              <span className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <Plus className="h-4 w-4" />
                View Premium Rewards
              </span>
            </Card>
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  )
} 