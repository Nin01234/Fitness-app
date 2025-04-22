import Link from "next/link"
import { format } from "date-fns"
import { Coffee, Edit, MoreVertical, Plus, Trash, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MealsListProps {
  meals: any[]
}

export function MealsList({ meals }: MealsListProps) {
  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      case "lunch":
      case "dinner":
      case "snack":
      default:
        return <Utensils className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Today&apos;s Meals</CardTitle>
          <CardDescription>Track your food intake for the day</CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link href="/nutrition/log-meal">
            <Plus className="mr-2 h-4 w-4" />
            Log Meal
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {meals.length > 0 ? (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">{getMealTypeIcon(meal.meal_type)}</div>
                  <div>
                    <p className="text-sm font-medium leading-none">{meal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)} • {meal.calories} cal
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground">{format(new Date(meal.date), "h:mm a")}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit meal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete meal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No meals logged</h3>
            <p className="mt-2 text-sm text-muted-foreground">Start tracking your meals to see them here.</p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/nutrition/log-meal">
                <Plus className="mr-2 h-4 w-4" />
                Log Meal
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

