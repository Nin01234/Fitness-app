"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Clock, Utensils, Plus, MoreHorizontal, Copy, Calendar, Trash, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FavoriteMeal {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: number
  carbs: number
  fat: number
  prepTime: number
  imageUrl: string
  lastEaten?: string
}

const favoriteMeals: FavoriteMeal[] = [
  {
    id: "meal-1",
    name: "Greek Yogurt with Berries",
    type: "breakfast",
    calories: 320,
    protein: 22,
    carbs: 40,
    fat: 8,
    prepTime: 5,
    imageUrl: "/placeholder.svg?height=100&width=200",
    lastEaten: "2 days ago",
  },
  {
    id: "meal-2",
    name: "Chicken & Vegetable Stir Fry",
    type: "lunch",
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 15,
    prepTime: 20,
    imageUrl: "/placeholder.svg?height=100&width=200",
    lastEaten: "Yesterday",
  },
  {
    id: "meal-3",
    name: "Salmon with Roasted Vegetables",
    type: "dinner",
    calories: 520,
    protein: 40,
    carbs: 25,
    fat: 22,
    prepTime: 30,
    imageUrl: "/placeholder.svg?height=100&width=200",
    lastEaten: "3 days ago",
  },
  {
    id: "meal-4",
    name: "Protein Smoothie",
    type: "snack",
    calories: 250,
    protein: 25,
    carbs: 20,
    fat: 5,
    prepTime: 5,
    imageUrl: "/placeholder.svg?height=100&width=200",
    lastEaten: "Today",
  },
  {
    id: "meal-5",
    name: "Avocado Toast with Eggs",
    type: "breakfast",
    calories: 380,
    protein: 18,
    carbs: 30,
    fat: 20,
    prepTime: 10,
    imageUrl: "/placeholder.svg?height=100&width=200",
    lastEaten: "4 days ago",
  },
  {
    id: "meal-6",
    name: "Turkey & Hummus Wrap",
    type: "lunch",
    calories: 420,
    protein: 30,
    carbs: 45,
    fat: 12,
    prepTime: 10,
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
]

export function FavoriteMeals() {
  const [meals, setMeals] = useState<FavoriteMeal[]>(favoriteMeals)

  const handleLogMeal = (meal: FavoriteMeal) => {
    toast({
      title: "Meal logged",
      description: `Added ${meal.name} to your food diary`,
    })
  }

  const handleDeleteMeal = (mealId: string) => {
    setMeals(meals.filter((meal) => meal.id !== mealId))
    toast({
      title: "Meal removed",
      description: "Removed from your favorites",
    })
  }

  const getMealTypeIcon = (type: FavoriteMeal["type"]) => {
    switch (type) {
      case "breakfast":
        return (
          <div className="p-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <Utensils className="h-3 w-3" />
          </div>
        )
      case "lunch":
        return (
          <div className="p-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
            <Utensils className="h-3 w-3" />
          </div>
        )
      case "dinner":
        return (
          <div className="p-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
            <Utensils className="h-3 w-3" />
          </div>
        )
      case "snack":
        return (
          <div className="p-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
            <Utensils className="h-3 w-3" />
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            <CardTitle>Favorite Meals</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        <CardDescription>Quick access to your favorite meals</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snack">Snack</TabsTrigger>
          </TabsList>

          {["all", "breakfast", "lunch", "dinner", "snack"].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {meals
                  .filter((meal) => tab === "all" || meal.type === tab)
                  .map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center p-2 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={meal.imageUrl || "/placeholder.svg"}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center">
                          {getMealTypeIcon(meal.type)}
                          <p className="text-sm font-medium ml-1 truncate">{meal.name}</p>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{meal.prepTime} min</span>
                          <span className="mx-1">•</span>
                          <span>{meal.calories} kcal</span>
                          {meal.lastEaten && (
                            <>
                              <span className="mx-1">•</span>
                              <span>Last: {meal.lastEaten}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center ml-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLogMeal(meal)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleLogMeal(meal)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Log Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteMeal(meal.id)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Favorite
        </Button>
      </CardFooter>
    </Card>
  )
}

