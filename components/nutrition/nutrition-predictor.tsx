"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useSupabase } from "@/app/supabase-provider"
import { Utensils, Droplets, Leaf, Activity, Lock, Sparkles, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePremiumStatus } from "@/components/hooks/use-premium-status"
import { PremiumUpsellBanner } from "@/components/premium/premium-upsell-banner"
import { PremiumBadge } from "@/components/premium/premium-badge"

interface NutrientPrediction {
  calories: number
  protein: number
  carbs: number
  fat: number
  hydration: number
}

export function NutritionPredictor() {
  const [prediction, setPrediction] = useState<NutrientPrediction>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    hydration: 2.5,
  })
  const [loading, setLoading] = useState(true)
  const [progressValues, setProgressValues] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    hydration: 0,
  })
  const [nutritionTips, setNutritionTips] = useState<string[]>([])
  const [timeBasedRecommendation, setTimeBasedRecommendation] = useState<string>("")
  const [seasonalFoods, setSeasonalFoods] = useState<{name: string, benefit: string}[]>([])
  
  const supabase = useSupabase()
  const { toast } = useToast()
  const { isPremium, isLoading, userId } = usePremiumStatus()

  const getSeasonalFoods = () => {
    const currentMonth = new Date().getMonth()
    let foods: {name: string, benefit: string}[] = []
    
    if (currentMonth >= 2 && currentMonth <= 4) {
      foods = [
        { name: "Asparagus", benefit: "Rich in folate and vitamins A, C, and K" },
        { name: "Spinach", benefit: "High in iron and antioxidants" },
        { name: "Strawberries", benefit: "High in vitamin C and manganese" },
        { name: "Peas", benefit: "Good source of protein and fiber" }
      ]
    } 
    else if (currentMonth >= 5 && currentMonth <= 7) {
      foods = [
        { name: "Tomatoes", benefit: "Rich in lycopene and vitamin C" },
        { name: "Berries", benefit: "High in antioxidants and fiber" },
        { name: "Zucchini", benefit: "Low in calories and high in water content" },
        { name: "Watermelon", benefit: "Hydrating and rich in vitamins A and C" }
      ]
    } 
    else if (currentMonth >= 8 && currentMonth <= 10) {
      foods = [
        { name: "Pumpkin", benefit: "Rich in beta-carotene and fiber" },
        { name: "Apples", benefit: "Good source of fiber and vitamin C" },
        { name: "Sweet Potatoes", benefit: "High in vitamins A and C" },
        { name: "Brussels Sprouts", benefit: "Rich in vitamins K and C" }
      ]
    } 
    else {
      foods = [
        { name: "Citrus Fruits", benefit: "High in vitamin C and antioxidants" },
        { name: "Kale", benefit: "Rich in vitamins A, K, and calcium" },
        { name: "Pomegranates", benefit: "High in antioxidants and vitamin C" },
        { name: "Winter Squash", benefit: "Good source of vitamins A and C" }
      ]
    }
    
    return foods
  }
  
  const getTimeBasedRecommendation = () => {
    const currentHour = new Date().getHours()
    
    if (currentHour >= 5 && currentHour < 9) {
      return "Morning: Focus on protein-rich breakfast to kickstart metabolism and provide lasting energy."
    } else if (currentHour >= 9 && currentHour < 11) {
      return "Mid-morning: Consider a small protein snack to maintain energy levels until lunch."
    } else if (currentHour >= 11 && currentHour < 14) {
      return "Lunch: Balance carbs with lean protein and healthy fats for sustained afternoon energy."
    } else if (currentHour >= 14 && currentHour < 17) {
      return "Afternoon: Choose a fiber-rich snack to avoid energy crashes before dinner."
    } else if (currentHour >= 17 && currentHour < 20) {
      return "Dinner: Prioritize vegetables and lean protein, slightly lower in carbs than lunch."
    } else {
      return "Evening: If hungry before bed, choose a small protein-based snack to support overnight recovery."
    }
  }
  
  const generateNutritionTips = (userData: any) => {
    const allTips = [
      "Aim to drink water before each meal to help with portion control.",
      "Include protein with every meal to help maintain muscle mass.",
      "Choose whole grains over refined carbohydrates for more fiber and nutrients.",
      "Eat a variety of colorful vegetables to get a wide range of nutrients.",
      "Healthy fats like avocados and nuts can help you feel satisfied longer.",
      "Plan your meals ahead of time to avoid impulsive, less healthy choices.",
      "Read nutrition labels to become more aware of what you're consuming.",
      "Be mindful of portion sizes, even with healthy foods.",
      "Limit processed foods which often contain hidden sugars and unhealthy fats.",
      "Consider tracking your food intake to better understand your habits.",
      "Try to eat slowly and mindfully to better recognize when you're full.",
      "Include fermented foods like yogurt for gut health benefits.",
      "Aim for at least 25g of fiber daily for digestive health.",
      "Reduce sodium intake by using herbs and spices instead of salt.",
      "Choose lean protein sources like fish, chicken, beans, and tofu.",
      "Prepare home-cooked meals when possible to control ingredients.",
      "Stay hydrated throughout the day, not just during meals.",
      "Consider eating smaller, more frequent meals if it helps control hunger."
    ]
    
    const premiumTips = [
      `Based on your recent activity levels, consider increasing your protein intake to ${Math.round(userData?.weight * 1.8)}g per day to support muscle recovery.`,
      `Your current carb to protein ratio is optimal for your ${userData?.goal || 'fitness'} goals.`,
      `Consider adding more ${userData?.gender === 'female' ? 'iron-rich foods' : 'zinc-rich foods'} to your diet based on your profile.`,
      `Your current hydration levels are below target. Aim for ${Math.round(userData?.weight * 0.03 * 100) / 100}L daily for optimal performance.`,
      `Based on your sleep data, consider adding more magnesium-rich foods to your evening meals.`,
      `Your recent workout intensity suggests you may benefit from increasing post-workout carbohydrates.`,
      `Consider timing your protein intake within 30 minutes of your strength training sessions for optimal results.`,
      `Based on your last 7 days of nutrition tracking, you're consistently low in dietary fiber. Consider adding more whole grains and vegetables.`
    ]
    
    const selectedTips = []
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * allTips.length)
      selectedTips.push(allTips[randomIndex])
      allTips.splice(randomIndex, 1)
    }
    
    if (isPremium && userData) {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * premiumTips.length)
        selectedTips.push(premiumTips[randomIndex])
        premiumTips.splice(randomIndex, 1)
      }
    }
    
    return selectedTips
  }

  useEffect(() => {
    async function fetchUserDataAndPredict() {
      try {
        if (!userId) {
          setLoading(false)
          return
        }
        
        setLoading(true)
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (!profile) {
          setLoading(false)
          return
        }
        
        const { data: activities } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
        
        const { data: nutritionEntries } = await supabase
          .from('nutrition_tracking')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)
        
        const weight = profile.weight || 70
        const height = profile.height || 170
        const age = profile.age || 30
        const isMale = profile.gender === 'male'
        
        let bmr = 0
        if (isMale) {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161
        }
        
        const activityLevels = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          very_active: 1.9
        }
        
        const activityFactor = activityLevels[(profile.activity_level || 'moderate') as keyof typeof activityLevels]
        let calorieNeeds = bmr * activityFactor
        
        const currentHour = new Date().getHours()
        if (currentHour >= 11 && currentHour <= 14) {
          calorieNeeds *= 1.05
        } else if (currentHour >= 17 && currentHour <= 19) {
          calorieNeeds *= 0.95
        } else if (currentHour >= 20) {
          calorieNeeds *= 0.9
        }
        
        const dayOfWeek = new Date().getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          calorieNeeds *= 1.1
        }
        
        switch (profile.goal) {
          case 'lose_weight':
            calorieNeeds -= 500
            break
          case 'gain_muscle':
            calorieNeeds += 300
            break
        }
        
        if (activities && activities.length > 0) {
          const recentActivityLevel = activities.reduce((sum, act) => 
            sum + (act.calories_burned || 0), 0) / activities.length
          
          if (recentActivityLevel > 400) {
            calorieNeeds += 200
          } else if (recentActivityLevel < 100) {
            calorieNeeds -= 100
          }
        }
        
        // Calculate macronutrient distribution
        let proteinPercentage = 0.3 // 30% by default
        let carbsPercentage = 0.4 // 40% by default
        let fatPercentage = 0.3 // 30% by default
        
        // NEW: Enhanced macro calculations for different goals
        if (isPremium) {
          if (profile.goal === 'gain_muscle') {
            // Higher protein for muscle gain, higher carbs for energy
            proteinPercentage = 0.35 + (Math.random() * 0.03) // Add randomness
            carbsPercentage = 0.45 - (Math.random() * 0.03)
            fatPercentage = 0.2 + (Math.random() * 0.02)
          } else if (profile.goal === 'lose_weight') {
            // Higher protein for satiety, lower carbs
            proteinPercentage = 0.4 + (Math.random() * 0.05)
            carbsPercentage = 0.3 - (Math.random() * 0.05) 
            fatPercentage = 0.3
          } else if (profile.goal === 'improve_endurance') {
            // Higher carbs for endurance activities
            proteinPercentage = 0.25
            carbsPercentage = 0.55
            fatPercentage = 0.2
          }
        }
        
        const proteinNeeds = (calorieNeeds * proteinPercentage) / 4 // 4 calories per gram
        const carbsNeeds = (calorieNeeds * carbsPercentage) / 4 // 4 calories per gram
        const fatNeeds = (calorieNeeds * fatPercentage) / 9 // 9 calories per gram
        
        // Calculate hydration needs (ml per kg of body weight)
        const hydrationNeeds = (weight * 35) / 1000 // Convert ml to liters
        
        // Set the predictions
        setPrediction({
          calories: Math.round(calorieNeeds),
          protein: Math.round(proteinNeeds),
          carbs: Math.round(carbsNeeds),
          fat: Math.round(fatNeeds),
          hydration: parseFloat(hydrationNeeds.toFixed(1))
        })
        
        // For non-premium users, we won't calculate today's progress
        // This is a premium feature
        if (isPremium) {
          // Calculate today's progress if nutrition data is available
          if (nutritionEntries && nutritionEntries.length > 0) {
            const today = new Date().toISOString().split('T')[0]
            const todayEntries = nutritionEntries.filter(entry => 
              entry.created_at.startsWith(today)
            )
            
            if (todayEntries.length > 0) {
              const totalCalories = todayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0)
              const totalProtein = todayEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0)
              const totalCarbs = todayEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0)
              const totalFat = todayEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0)
              
              // Get hydration data
              const { data: hydrationEntries } = await supabase
                .from('hydration_tracking')
                .select('amount')
                .eq('user_id', userId)
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`)
              
              const totalHydration = hydrationEntries 
                ? hydrationEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
                : 0
              
              setProgressValues({
                calories: Math.min(100, Math.round((totalCalories / calorieNeeds) * 100)),
                protein: Math.min(100, Math.round((totalProtein / proteinNeeds) * 100)),
                carbs: Math.min(100, Math.round((totalCarbs / carbsNeeds) * 100)),
                fat: Math.min(100, Math.round((totalFat / fatNeeds) * 100)),
                hydration: Math.min(100, Math.round((totalHydration / hydrationNeeds) * 100)),
              })
            }
          }
        } else {
          // For non-premium users, show simulated progress
          setProgressValues({
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            hydration: 0,
          })
        }
      } catch (error) {
        console.error('Error calculating nutrition predictions:', error)
        toast({
          title: "Error",
          description: "Failed to generate nutrition predictions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (!isLoading && userId) {
      fetchUserDataAndPredict()
    }
    
    // Update predictions every few hours to account for activity
    const interval = setInterval(() => {
      if (userId) {
        fetchUserDataAndPredict()
      }
    }, 3 * 60 * 60 * 1000) // Every 3 hours
    
    return () => clearInterval(interval)
  }, [supabase, toast, isPremium, isLoading, userId])

  const pathColors = {
    calories: "#ff6384",
    protein: "#36a2eb",
    carbs: "#ffce56",
    fat: "#4bc0c0",
    hydration: "#2563eb" 
  }

  // Show combined loading state - either our hook is loading or the predictor data is loading
  const showLoading = isLoading || loading

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Daily Nutrition Predictor
          {!isPremium && <PremiumBadge size="sm" />}
        </CardTitle>
        <CardDescription>
          Personalized recommendations based on your profile, activities, and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !isPremium ? (
          <div className="space-y-6">
            {/* Limited Preview for Non-Premium Users */}
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <div className="flex flex-col items-center">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={0}
                    text={`${prediction.calories}`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: pathColors.calories,
                      textColor: pathColors.calories,
                      trailColor: '#e6e6e6',
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Calories</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center opacity-50">
                <div style={{ width: 80, height: 80 }} className="relative">
                  <CircularProgressbar
                    value={0}
                    text={`?`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: '#d3d3d3',
                      textColor: '#888888',
                      trailColor: '#e6e6e6',
                    })}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-400">Protein</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center opacity-50">
                <div style={{ width: 80, height: 80 }} className="relative">
                  <CircularProgressbar
                    value={0}
                    text={`?`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: '#d3d3d3',
                      textColor: '#888888',
                      trailColor: '#e6e6e6',
                    })}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-400">Carbs</div>
                </div>
              </div>
            </div>
            
            {/* Premium Upsell Banner */}
            <PremiumUpsellBanner 
              title="Unlock Advanced Nutrition Predictions"
              description="Upgrade to premium for personalized macronutrient tracking, real-time progress updates, and adaptive nutrition guidance."
              benefits={[
                "Personalized protein, carbs and fat recommendations",
                "Real-time progress tracking of daily nutrition targets",
                "Adaptive predictions based on your activity level"
              ]}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={progressValues.calories}
                    text={`${progressValues.calories}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: pathColors.calories,
                      textColor: pathColors.calories,
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Calories</div>
                  <div className="text-xs">{prediction.calories} kcal</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={progressValues.protein}
                    text={`${progressValues.protein}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: pathColors.protein,
                      textColor: pathColors.protein,
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Protein</div>
                  <div className="text-xs">{prediction.protein}g</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={progressValues.carbs}
                    text={`${progressValues.carbs}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: pathColors.carbs,
                      textColor: pathColors.carbs,
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Carbs</div>
                  <div className="text-xs">{prediction.carbs}g</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={progressValues.fat}
                    text={`${progressValues.fat}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: pathColors.fat,
                      textColor: pathColors.fat,
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Fat</div>
                  <div className="text-xs">{prediction.fat}g</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={progressValues.hydration}
                    text={`${progressValues.hydration}%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: pathColors.hydration,
                      textColor: pathColors.hydration,
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">Water</div>
                  <div className="text-xs">{prediction.hydration}L</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Daily Adaptive Insights
              </h3>
              <p className="text-xs text-muted-foreground">
                Your recommendations are dynamically adjusted based on your activity level, goals, and recent exercise patterns.
                Today's nutrition targets are optimized for your current fitness journey.
              </p>
            </div>
          </>
        )}
      </CardContent>
      {!isPremium && (
        <CardFooter className="border-t pt-4 flex justify-center">
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/premium">
              Learn more about premium benefits
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
} 