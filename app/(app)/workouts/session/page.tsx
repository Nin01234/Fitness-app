"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { WorkoutCountdown } from "@/components/workouts/workout-countdown"
import { Play, Pause, SkipForward, CheckCircle, XCircle, Clock, Dumbbell, Heart, Flame } from "lucide-react"

export default function WorkoutSessionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [workout, setWorkout] = useState<any>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [workoutComplete, setWorkoutComplete] = useState(false)

  // Load workout data from localStorage
  useEffect(() => {
    const savedWorkout = localStorage.getItem("current_workout")
    if (!savedWorkout) {
      toast({
        title: "No workout found",
        description: "Please create or select a workout first",
        variant: "destructive",
      })
      router.push("/workouts")
      return
    }

    setWorkout(JSON.parse(savedWorkout))

    // Start session timer
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1)

      // Simulate heart rate changes
      setHeartRate((prev) => {
        const base = prev || 70
        const variation = Math.floor(Math.random() * 10) - 5
        return Math.max(60, Math.min(180, base + variation))
      })

      // Simulate calories burned (roughly 8-10 calories per minute for moderate exercise)
      setCaloriesBurned((prev) => prev + 8 / 60)
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  if (!workout) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading workout...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const currentExercise = workout.exercises[currentExerciseIndex]
  const totalExercises = workout.exercises.length
  const progress =
    (currentExerciseIndex / totalExercises) * 100 +
    (currentSetIndex / (currentExercise?.sets || 1)) * (100 / totalExercises)

  function handleNextSet() {
    if (currentSetIndex + 1 < currentExercise.sets) {
      setIsResting(true)
    } else {
      handleNextExercise()
    }
  }

  function handleNextExercise() {
    setIsResting(false)
    setCurrentSetIndex(0)

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1)
    } else {
      completeWorkout()
    }
  }

  function restComplete() {
    setIsResting(false)
    setCurrentSetIndex((prev) => prev + 1)
  }

  async function completeWorkout() {
    setWorkoutComplete(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Log completed workout
      await supabase.from("workout_logs").insert({
        user_id: user.id,
        workout_name: workout.name,
        duration: sessionTime,
        calories_burned: Math.round(caloriesBurned),
        exercises_completed: workout.exercises.length,
        date: new Date().toISOString(),
      })

      // Update user stats
      await supabase.rpc("increment_user_workout_stats", {
        user_id_param: user.id,
        workout_duration: sessionTime,
        calories_param: Math.round(caloriesBurned),
      })

      // Clear current workout from localStorage
      localStorage.removeItem("current_workout")
    } catch (error) {
      console.error("Error saving workout results:", error)
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (workoutComplete) {
    return (
      <DashboardShell>
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-8">
          <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mart-production-8033081.jpg-dZeJAzl5sR7F7MUHa0rpss9GwXIwcX.jpeg"
              alt="Workout complete"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 text-white">
            <h1 className="text-3xl font-bold">Workout Complete!</h1>
            <p className="mt-2 text-lg">Great job! You've finished your workout.</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Workout Summary</CardTitle>
            <CardDescription>Here's how you did</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">{formatTime(sessionTime)}</h3>
                <p className="text-sm text-muted-foreground">Total Time</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Dumbbell className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">{totalExercises}</h3>
                <p className="text-sm text-muted-foreground">Exercises Completed</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Flame className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">{Math.round(caloriesBurned)}</h3>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/workouts")}>
              Back to Workouts
            </Button>
            <Button onClick={() => router.push("/progress/new")}>Log Progress</Button>
          </CardFooter>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mart-production-8033081.jpg-dZeJAzl5sR7F7MUHa0rpss9GwXIwcX.jpeg"
            alt="Active workout session"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">{workout.name}</h1>
          <p className="mt-2 text-lg">Keep pushing! You're doing great.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{isResting ? "Rest Period" : currentExercise?.name}</CardTitle>
                  <CardDescription>
                    {isResting
                      ? "Take a short break before the next set"
                      : `Set ${currentSetIndex + 1} of ${currentExercise?.sets}`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currentExerciseIndex + 1}/{totalExercises}
                  </div>
                  <div className="text-sm text-muted-foreground">Exercise</div>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              {isResting ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <h3 className="text-xl font-bold mb-4">Rest Time</h3>
                  <WorkoutCountdown seconds={60} onComplete={restComplete} isPaused={isPaused} />
                  <p className="mt-4 text-muted-foreground">
                    Next: {currentExercise?.name} - Set {currentSetIndex + 1 + 1}
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Reps</div>
                      <div className="text-2xl font-bold">{currentExercise?.reps || "—"}</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="text-2xl font-bold">
                        {currentExercise?.weight ? `${currentExercise.weight} kg` : "Bodyweight"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button size="lg" variant="outline" className="w-1/3" onClick={() => setIsPaused(!isPaused)}>
                      {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      size="lg"
                      variant="default"
                      className="w-1/3 bg-green-600 hover:bg-green-700"
                      onClick={handleNextSet}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/workouts")}>
                <XCircle className="mr-2 h-4 w-4" />
                End Workout
              </Button>
              <Button variant="ghost" onClick={handleNextExercise}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps {exercise.weight ? `@ ${exercise.weight}kg` : ""}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{index === 0 ? "Next" : `+${index + 1}`}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Duration</span>
                  </div>
                  <div className="font-medium">{formatTime(sessionTime)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Calories</span>
                  </div>
                  <div className="font-medium">{Math.round(caloriesBurned)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Heart Rate</span>
                  </div>
                  <div className="font-medium">{heartRate || "—"} bpm</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Exercises</span>
                  </div>
                  <div className="font-medium">
                    {currentExerciseIndex + 1}/{totalExercises}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workout Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[120px] p-2 border rounded-md"
                placeholder="Add notes about your workout performance..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

