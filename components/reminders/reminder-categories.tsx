import type React from "react"
import { Activity, Apple, Dumbbell, Moon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReminderCategories() {
  const categories = [
    {
      icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
      name: "Workouts",
      count: 3,
      description: "Exercise and training reminders",
    },
    {
      icon: <Apple className="h-5 w-5 text-green-500" />,
      name: "Nutrition",
      count: 5,
      description: "Meal and supplement timings",
    },
    {
      icon: <Activity className="h-5 w-5 text-red-500" />,
      name: "Progress",
      count: 2,
      description: "Measurement and weigh-in reminders",
    },
    {
      icon: <Moon className="h-5 w-5 text-purple-500" />,
      name: "Rest",
      count: 1,
      description: "Sleep and recovery reminders",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-start space-x-4 rounded-lg border p-4">
              <div className="rounded-full bg-background p-2 shadow-sm">{category.icon}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{category.name}</p>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "secondary"
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
      }`}
    >
      {children}
    </span>
  )
}

