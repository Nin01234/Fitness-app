"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight, Fruit, Salad, Utensils, Clock, HeartPulse, Calendar, Star, Leaf, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function HealthyLivingGuide() {
  const [activeTab, setActiveTab] = useState("habits")
  const [completedHabits, setCompletedHabits] = useState<string[]>([])
  const [streakDays, setStreakDays] = useState(3) // Simulated streak

  // Healthy eating habits data
  const healthyHabits = [
    {
      id: "habit1",
      title: "Eat a colorful plate",
      description: "Include at least 3 different colored vegetables or fruits in each meal",
      category: "meals",
      difficulty: "easy",
      icon: <Fruit className="h-5 w-5 text-green-500" />,
      benefits: ["Increased nutrient diversity", "Better antioxidant intake", "Improved digestive health"],
      tips: "Try to include greens (spinach, broccoli), reds (tomatoes, peppers), and yellows (squash, corn) in your meals."
    },
    {
      id: "habit2",
      title: "Practice mindful eating",
      description: "Take time to enjoy your food without distractions",
      category: "mindfulness",
      difficulty: "medium",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      benefits: ["Better digestion", "Reduced overeating", "Increased food enjoyment"],
      tips: "Turn off screens, chew slowly, and notice flavors and textures as you eat."
    },
    {
      id: "habit3",
      title: "Drink water before meals",
      description: "Have a glass of water 15-30 minutes before eating",
      category: "hydration",
      difficulty: "easy",
      icon: <HeartPulse className="h-5 w-5 text-blue-500" />,
      benefits: ["Improved hydration", "Better portion control", "Enhanced digestion"],
      tips: "Keep a water bottle nearby and set reminders if you tend to forget."
    },
    {
      id: "habit4",
      title: "Plant-based day",
      description: "Have one day a week with plant-based meals only",
      category: "meals",
      difficulty: "medium",
      icon: <Leaf className="h-5 w-5 text-green-500" />,
      benefits: ["Increased fiber intake", "Reduced ecological footprint", "Exposure to new foods"],
      tips: "Try meatless Monday as a simple way to remember your plant-based day."
    },
    {
      id: "habit5",
      title: "Meal prep Sunday",
      description: "Prepare healthy meals and snacks for the week ahead",
      category: "planning",
      difficulty: "hard",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      benefits: ["Better food choices", "Reduced food waste", "Time saving during the week"],
      tips: "Start with just prepping ingredients, then work up to full meals as you build the habit."
    },
    {
      id: "habit6",
      title: "Balanced breakfast",
      description: "Include protein, healthy fats, and complex carbs in breakfast",
      category: "meals",
      difficulty: "medium",
      icon: <Utensils className="h-5 w-5 text-amber-500" />,
      benefits: ["Sustained energy", "Better concentration", "Reduced mid-morning cravings"],
      tips: "Examples include Greek yogurt with nuts and berries, or eggs with avocado on whole grain toast."
    },
  ]

  // Nutrition plans data
  const nutritionPlans = [
    {
      id: "plan1",
      title: "Mediterranean Diet",
      description: "Focus on plant-based foods, healthy fats, and lean proteins",
      level: "Beginner friendly",
      image: "https://source.unsplash.com/UTw3j_mrUfA/400x300",
      benefits: ["Heart health", "Longevity", "Brain health"],
      keyFoods: ["Olive oil", "Nuts", "Fish", "Vegetables", "Whole grains"]
    },
    {
      id: "plan2",
      title: "Plant-Based Nutrition",
      description: "Emphasizes whole foods from plants with minimal processed foods",
      level: "Intermediate",
      image: "https://source.unsplash.com/IGfIGP5ONV0/400x300",
      benefits: ["Reduced inflammation", "Improved digestion", "Environmental sustainability"],
      keyFoods: ["Legumes", "Vegetables", "Fruits", "Nuts and seeds", "Whole grains"]
    },
    {
      id: "plan3",
      title: "Balanced Macros",
      description: "Focus on balancing proteins, carbs, and fats for optimal energy",
      level: "All levels",
      image: "https://source.unsplash.com/Yn0dIk2bJks/400x300",
      benefits: ["Athletic performance", "Satiety", "Energy management"],
      keyFoods: ["Lean proteins", "Complex carbohydrates", "Healthy fats", "Vegetables", "Fruits"]
    },
  ]

  // Nutrition tips data
  const nutritionTips = [
    {
      id: "tip1",
      title: "Prioritize whole foods",
      description: "Whole foods contain more nutrients and fiber than processed alternatives.",
      category: "general",
      icon: <Salad className="h-5 w-5 text-green-500" />
    },
    {
      id: "tip2",
      title: "Eat the rainbow",
      description: "Different colored fruits and vegetables provide different phytonutrients.",
      category: "produce",
      icon: <Fruit className="h-5 w-5 text-red-500" />
    },
    {
      id: "tip3",
      title: "Balance your plate",
      description: "Aim for 1/2 plate vegetables, 1/4 protein, and 1/4 quality carbohydrates.",
      category: "meals",
      icon: <Utensils className="h-5 w-5 text-blue-500" />
    },
    {
      id: "tip4",
      title: "Mind your portions",
      description: "Use smaller plates and listen to your body's hunger and fullness signals.",
      category: "mindfulness",
      icon: <Clock className="h-5 w-5 text-purple-500" />
    },
    {
      id: "tip5",
      title: "Stay hydrated",
      description: "Drink water throughout the day, especially before meals.",
      category: "hydration",
      icon: <HeartPulse className="h-5 w-5 text-cyan-500" />
    },
    {
      id: "tip6",
      title: "Plan ahead",
      description: "Meal planning helps you make healthier choices and reduces food waste.",
      category: "planning",
      icon: <Calendar className="h-5 w-5 text-amber-500" />
    },
  ]

  // Toggle habit completion
  const toggleHabit = (habitId: string) => {
    if (completedHabits.includes(habitId)) {
      setCompletedHabits(completedHabits.filter(id => id !== habitId))
    } else {
      setCompletedHabits([...completedHabits, habitId])
      toast.success('Habit marked as complete!', {
        description: 'Keep up the good work on building healthy habits.',
      })
    }
  }

  // View plan details
  const viewPlanDetails = (planId: string) => {
    const plan = nutritionPlans.find(p => p.id === planId)
    if (plan) {
      toast.info(`${plan.title} Plan`, {
        description: (
          <div className="space-y-2 text-sm">
            <p>{plan.description}</p>
            <div>
              <p className="font-semibold">Key Foods:</p>
              <ul className="list-disc pl-4">
                {plan.keyFoods.map((food, i) => (
                  <li key={i}>{food}</li>
                ))}
              </ul>
            </div>
          </div>
        ),
      })
    }
  }

  // Get difficulty badge style
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Healthy Eating Guide</CardTitle>
              <CardDescription>Build better nutrition habits for long-term health</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Leaf className="h-3 w-3" />
                <span className="hidden md:inline">Current Streak:</span> {streakDays} days
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Star className="h-3 w-3" />
                <span className="hidden md:inline">Completed:</span> {completedHabits.length}/{healthyHabits.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-1">
          {/* Overall progress */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall progress</span>
              <span className="text-sm">{Math.round((completedHabits.length / healthyHabits.length) * 100)}%</span>
            </div>
            <Progress value={(completedHabits.length / healthyHabits.length) * 100} className="h-2" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="habits">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Healthy Habits</span>
                <span className="sm:hidden">Habits</span>
              </TabsTrigger>
              <TabsTrigger value="plans">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nutrition Plans</span>
                <span className="sm:hidden">Plans</span>
              </TabsTrigger>
              <TabsTrigger value="tips">
                <Leaf className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nutrition Tips</span>
                <span className="sm:hidden">Tips</span>
              </TabsTrigger>
            </TabsList>

            {/* Healthy Habits Tab */}
            <TabsContent value="habits" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {healthyHabits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`h-full border transition-all ${
                      completedHabits.includes(habit.id) 
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "hover:border-primary/50 hover:shadow-sm"
                    }`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-full ${
                              completedHabits.includes(habit.id)
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-muted"
                            }`}>
                              {habit.icon}
                            </div>
                            <CardTitle className="text-base">{habit.title}</CardTitle>
                          </div>
                          <Badge className={`${getDifficultyStyle(habit.difficulty)}`}>
                            {habit.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{habit.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Benefits:</h4>
                          <ul className="text-sm space-y-1">
                            {habit.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          variant={completedHabits.includes(habit.id) ? "outline" : "default"}
                          size="sm"
                          className="w-full"
                          onClick={() => toggleHabit(habit.id)}
                        >
                          {completedHabits.includes(habit.id) ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              Completed
                            </>
                          ) : (
                            "Mark as Complete"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Nutrition Plans Tab */}
            <TabsContent value="plans" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-3">
                {nutritionPlans.map((plan) => (
                  <Card key={plan.id} className="overflow-hidden h-full border hover:border-primary/50 hover:shadow-sm transition-all">
                    <div className="relative h-48">
                      <Image
                        src={plan.image}
                        alt={plan.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge className="bg-white/80 text-black backdrop-blur-sm">
                          {plan.level}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {plan.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => viewPlanDetails(plan.id)}
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-4">
                <Link href="/nutrition/meal-plans">
                  <Button>
                    View All Nutrition Plans
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Nutrition Tips Tab */}
            <TabsContent value="tips" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {nutritionTips.map((tip) => (
                  <Card key={tip.id} className="border hover:border-primary/50 hover:shadow-sm transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-muted">
                          {tip.icon}
                        </div>
                        <CardTitle className="text-base">{tip.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tip of the day */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                    <Star className="mr-2 h-5 w-5 text-amber-500" />
                    Tip of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="italic text-blue-600 dark:text-blue-300">
                    "Prepare your meals in advance to avoid making impulsive food choices when you're hungry or short on time."
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

