"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ChevronRight, Plus } from "lucide-react"

interface MealPlannerProps {
  userId: string | undefined
}

export function MealPlanner({ userId }: MealPlannerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Sample meal plan data
  const mealPlan = {
    breakfast: "Oatmeal with berries and nuts",
    lunch: "Grilled chicken salad",
    dinner: "Salmon with quinoa and vegetables",
    snacks: ["Greek yogurt with honey", "Apple with almond butter"],
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Meal Planner</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Plan Meals
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">
                {date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <Badge variant="outline">Breakfast</Badge>
                <p className="mt-1 text-sm">{mealPlan.breakfast}</p>
              </div>
              <div>
                <Badge variant="outline">Lunch</Badge>
                <p className="mt-1 text-sm">{mealPlan.lunch}</p>
              </div>
              <div>
                <Badge variant="outline">Dinner</Badge>
                <p className="mt-1 text-sm">{mealPlan.dinner}</p>
              </div>
              <div>
                <Badge variant="outline">Snacks</Badge>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {mealPlan.snacks.map((snack, index) => (
                    <li key={index}>{snack}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button variant="ghost" className="w-full" size="sm">
              View Full Plan <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

