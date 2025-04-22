"use client"

import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface NutritionSummaryProps {
  userId: string | undefined
}

export function NutritionSummary({ userId }: NutritionSummaryProps) {
  const [nutritionData, setNutritionData] = useState({
    calories: {
      consumed: 0,
      goal: 2200,
    },
    macros: {
      protein: {
        consumed: 0,
        goal: 150,
      },
      carbs: {
        consumed: 0,
        goal: 250,
      },
      fat: {
        consumed: 0,
        goal: 70,
      },
    },
  })
  
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchNutritionData() {
      if (!userId) return
      
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        // Fetch today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0]
        
        // Fetch nutrition goals with error handling
        let goalsData = null
        try {
          const { data, error } = await supabase
            .from('nutrition_goals')
            .select('*')
            .eq('user_id', userId)
            .single()
            
          if (!error) {
            goalsData = data
          }
        } catch (error) {
          console.error('Error fetching nutrition goals:', error)
        }
        
        // Fetch today's meals with error handling
        let mealsData = []
        try {
          const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('user_id', userId)
            .gte('date', `${today}T00:00:00`)
            .lte('date', `${today}T23:59:59`)
            
          if (!error && data) {
            mealsData = data
          }
        } catch (error) {
          console.error('Error fetching meals:', error)
        }
        
        // Calculate consumed nutrients from today's meals
        let consumedCalories = 0
        let consumedProtein = 0
        let consumedCarbs = 0
        let consumedFat = 0
        
        if (mealsData && mealsData.length > 0) {
          mealsData.forEach(meal => {
            consumedCalories += meal.calories || 0
            consumedProtein += meal.protein || 0
            consumedCarbs += meal.carbs || 0
            consumedFat += meal.fat || 0
          })
        }
        
        // Update nutrition data with fetched values or defaults
        setNutritionData({
          calories: {
            consumed: consumedCalories,
            goal: goalsData?.calories || 2200,
          },
          macros: {
            protein: {
              consumed: consumedProtein,
              goal: goalsData?.protein || 150,
            },
            carbs: {
              consumed: consumedCarbs, 
              goal: goalsData?.carbs || 250,
            },
            fat: {
              consumed: consumedFat,
              goal: goalsData?.fat || 70,
            },
          },
        })
      } catch (error) {
        console.error('Error fetching nutrition data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNutritionData()
  }, [userId])

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>Nutrition Summary</CardTitle>
        <CardDescription>Today&apos;s nutrition intake</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-[150px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Calories</span>
                <span>
                  {nutritionData.calories.consumed} / {nutritionData.calories.goal}
                </span>
              </div>
              <Progress value={(nutritionData.calories.consumed / nutritionData.calories.goal) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Protein
                </div>
                <p className="text-xs text-muted-foreground">
                  {nutritionData.macros.protein.consumed}g / {nutritionData.macros.protein.goal}g
                </p>
                <Progress
                  value={(nutritionData.macros.protein.consumed / nutritionData.macros.protein.goal) * 100}
                  className="h-1.5"
                  indicatorColor="bg-green-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Carbs
                </div>
                <p className="text-xs text-muted-foreground">
                  {nutritionData.macros.carbs.consumed}g / {nutritionData.macros.carbs.goal}g
                </p>
                <Progress
                  value={(nutritionData.macros.carbs.consumed / nutritionData.macros.carbs.goal) * 100}
                  className="h-1.5"
                  indicatorColor="bg-blue-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  Fat
                </div>
                <p className="text-xs text-muted-foreground">
                  {nutritionData.macros.fat.consumed}g / {nutritionData.macros.fat.goal}g
                </p>
                <Progress
                  value={(nutritionData.macros.fat.consumed / nutritionData.macros.fat.goal) * 100}
                  className="h-1.5"
                  indicatorColor="bg-yellow-500"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/nutrition">
            <span>View Nutrition Details</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

