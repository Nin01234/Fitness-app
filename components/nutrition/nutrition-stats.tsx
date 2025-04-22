import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface NutritionStatsProps {
  userId: string | undefined
}

export function NutritionStats({ userId }: NutritionStatsProps) {
  // This would normally be fetched from the database
  const nutritionData = {
    calories: {
      consumed: 1850,
      goal: 2200,
    },
    macros: {
      protein: {
        consumed: 120,
        goal: 150,
      },
      carbs: {
        consumed: 200,
        goal: 250,
      },
      fat: {
        consumed: 65,
        goal: 70,
      },
    },
    water: {
      consumed: 1.8,
      goal: 2.5,
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Calories</h3>
            <span className="text-sm text-muted-foreground">
              {nutritionData.calories.consumed} / {nutritionData.calories.goal} kcal
            </span>
          </div>
          <Progress value={(nutritionData.calories.consumed / nutritionData.calories.goal) * 100} className="h-2" />
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
            <p className="text-xs text-muted-foreground text-right">Goal: {nutritionData.macros.protein.goal}g</p>
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
            <p className="text-xs text-muted-foreground text-right">Goal: {nutritionData.macros.carbs.goal}g</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Fat</h3>
              <span className="text-sm text-muted-foreground">{nutritionData.macros.fat.consumed}g</span>
            </div>
            <Progress
              value={(nutritionData.macros.fat.consumed / nutritionData.macros.fat.goal) * 100}
              className="h-2"
              indicatorColor="bg-yellow-500"
            />
            <p className="text-xs text-muted-foreground text-right">Goal: {nutritionData.macros.fat.goal}g</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Water Intake</h3>
            <span className="text-sm text-muted-foreground">
              {nutritionData.water.consumed} / {nutritionData.water.goal} L
            </span>
          </div>
          <Progress
            value={(nutritionData.water.consumed / nutritionData.water.goal) * 100}
            className="h-2"
            indicatorColor="bg-sky-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}

