import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Dumbbell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentWorkoutsProps {
  workouts: any[]
}

export function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your latest workout sessions</CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link href="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            New
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {workouts.length > 0 ? (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Dumbbell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {workout.duration} min • {workout.calories_burned} cal
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(workout.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No workouts yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Start tracking your workouts to see them here.</p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/workouts/new">
                <Plus className="mr-2 h-4 w-4" />
                New Workout
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/workouts">View All Workouts</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

