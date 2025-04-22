import Link from "next/link"
import { Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface GoalProgressProps {
  goals: any[]
}

export function GoalProgress({ goals }: GoalProgressProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Goal Progress</CardTitle>
        <CardDescription>Track your fitness goals</CardDescription>
      </CardHeader>
      <CardContent>
        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => {
              // Safely compute progress with fallback values
              const currentValue = goal.current_value || 0
              const targetValue = goal.target_value || 1
              const progress = Math.min(100, Math.round((currentValue / targetValue) * 100))

              return (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {currentValue} / {targetValue} {goal.goal_type === "weight" ? "lbs" : ""}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
            <div className="rounded-full bg-primary/10 p-2">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h3 className="mt-2 text-sm font-semibold">No goals set</h3>
            <p className="mt-1 text-xs text-muted-foreground">Set goals to track your progress</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/goals">View All Goals</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

