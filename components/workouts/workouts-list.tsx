import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Dumbbell, MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface WorkoutsListProps {
  workouts: any[]
}

export function WorkoutsList({ workouts }: WorkoutsListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {workouts.length > 0 ? (
        <>
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{workout.name}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(workout.date), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </div>
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
                        <Link href={`/workouts/${workout.id}`} className="flex w-full">
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit workout</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete workout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{workout.duration} min</Badge>
                    <Badge variant="outline">{workout.calories_burned} cal</Badge>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {workout.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/workouts/${workout.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </>
      ) : (
        <Card className="col-span-full">
          <CardHeader className="pb-2">
            <CardTitle>No workouts found</CardTitle>
            <CardDescription>Get started by creating your first workout</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

