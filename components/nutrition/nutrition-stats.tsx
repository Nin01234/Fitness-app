import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

interface NutritionStatsProps {
  userId: string | undefined
}

export function NutritionStats({ userId }: NutritionStatsProps) {
  // Initialize with 0 values
  const [nutritionData, setNutritionData] = useState({
    calories: {
      consumed: 0,
      goal: 2300,
    },
    macros: {
      protein: {
        consumed: 0,
        goal: 120,
      },
      carbs: {
        consumed: 0,
        goal: 250,
      },
      fat: {
        consumed: 0,
        goal: 80,
      },
    },
    water: {
      consumed: 0,
      goal: 2.5,
    },
  })

  // Data will only update when log meal form submits successfully
  useEffect(() => {
    // Check if we have the meal-logged flag in session storage
    const mealLogged = sessionStorage.getItem('meal-logged') === 'true'
    
    if (mealLogged) {
      // Update with sample data when a meal is logged
      setNutritionData({
        calories: {
          consumed: 1850,
          goal: 2300,
        },
        macros: {
          protein: {
            consumed: 85,
            goal: 120,
          },
          carbs: {
            consumed: 210,
            goal: 250,
          },
          fat: {
            consumed: 65,
            goal: 80,
          },
        },
        water: {
          consumed: 1.5,
          goal: 2.5,
        },
      })
      
      // Reset the flag
      sessionStorage.removeItem('meal-logged')
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today&apos;s Nutrition</CardTitle>
        <Button
          asChild
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Link href="/nutrition/log-meal">
            <Plus className="mr-1 h-4 w-4" /> Log Meal
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Daily Calories</h3>
            <span className="text-sm text-muted-foreground">
              {nutritionData.calories.consumed.toLocaleString()} of {nutritionData.calories.goal.toLocaleString()} goal
            </span>
          </div>
          <Progress 
            value={(nutritionData.calories.consumed / nutritionData.calories.goal) * 100} 
            className="h-2" 
          />
          <p className="text-xs text-right">{Math.round((nutritionData.calories.consumed / nutritionData.calories.goal) * 100)}%</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Protein</h3>
              <span className="text-sm text-muted-foreground">{nutritionData.macros.protein.consumed}g</span>
            </div>
            <Progress
              value={(nutritionData.macros.protein.consumed / nutritionData.macros.protein.goal) * 100}
              className="h-2"
              indicatorColor="bg-green-500"
            />
            <p className="text-xs text-muted-foreground">
              of {nutritionData.macros.protein.goal}g goal
              <span className="float-right">{Math.round((nutritionData.macros.protein.consumed / nutritionData.macros.protein.goal) * 100)}%</span>
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Carbs</h3>
              <span className="text-sm text-muted-foreground">{nutritionData.macros.carbs.consumed}g</span>
            </div>
            <Progress
              value={(nutritionData.macros.carbs.consumed / nutritionData.macros.carbs.goal) * 100}
              className="h-2"
              indicatorColor="bg-blue-500"
            />
            <p className="text-xs text-muted-foreground">
              of {nutritionData.macros.carbs.goal}g goal
              <span className="float-right">{Math.round((nutritionData.macros.carbs.consumed / nutritionData.macros.carbs.goal) * 100)}%</span>
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Fats</h3>
              <span className="text-sm text-muted-foreground">{nutritionData.macros.fat.consumed}g</span>
            </div>
            <Progress
              value={(nutritionData.macros.fat.consumed / nutritionData.macros.fat.goal) * 100}
              className="h-2"
              indicatorColor="bg-yellow-500"
            />
            <p className="text-xs text-muted-foreground">
              of {nutritionData.macros.fat.goal}g goal
              <span className="float-right">{Math.round((nutritionData.macros.fat.consumed / nutritionData.macros.fat.goal) * 100)}%</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

