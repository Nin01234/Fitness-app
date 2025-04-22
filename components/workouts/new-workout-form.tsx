"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Loader2, Dumbbell, Clock, Flame, FileText, Trash2, Save, Play } from "lucide-react"
import { ExerciseSelector } from "@/components/workouts/exercise-selector"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  name: z.string().min(2, { message: "Workout name is required" }),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1 minute" }),
  calories_burned: z.coerce.number().min(0, { message: "Calories must be a positive number" }),
  workout_type: z.string().optional(),
  difficulty: z.string().optional(),
  is_public: z.boolean().default(false),
  schedule: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  exercises: z
    .array(
      z.object({
        exercise_id: z.string(),
        sets: z.coerce.number().min(1),
        reps: z.coerce.number().min(1),
        weight: z.coerce.number().optional(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
})

export function NewWorkoutForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      calories_burned: 0,
      workout_type: "strength",
      difficulty: "intermediate",
      is_public: false,
      schedule: [],
      tags: [],
      exercises: [],
    },
  })

  const watchExercises = form.watch("exercises") || []

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      // Insert workout
      const { data: workout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          user_id: userData.user.id,
          name: values.name,
          description: values.description,
          duration: values.duration,
          calories_burned: values.calories_burned,
          workout_type: values.workout_type,
          difficulty: values.difficulty,
          is_public: values.is_public,
          schedule: values.schedule,
          tags: values.tags,
          date: new Date().toISOString(),
        })
        .select()
        .single()

      if (workoutError) {
        throw workoutError
      }

      // Insert workout exercises if any
      if (values.exercises && values.exercises.length > 0) {
        const workoutExercises = values.exercises.map((exercise, index) => ({
          workout_id: workout.id,
          exercise_id: exercise.exercise_id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || 0,
          notes: exercise.notes || null,
          order: index,
        }))

        const { error: exercisesError } = await supabase.from("workout_exercises").insert(workoutExercises)

        if (exercisesError) {
          throw exercisesError
        }
      }

      toast({
        title: "Success",
        description: "Your workout has been created.",
      })

      router.push("/workouts")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function startWorkout() {
    const data = form.getValues()
    if (data.exercises && data.exercises.length === 0) {
      toast({
        title: "No exercises",
        description: "Please add at least one exercise to start a workout",
        variant: "destructive",
      })
      return
    }

    // Save workout data to localStorage for the workout session
    localStorage.setItem(
      "current_workout",
      JSON.stringify({
        ...data,
        startTime: new Date().toISOString(),
      }),
    )

    router.push("/workouts/session")
  }

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-indigo-50 dark:bg-indigo-950 mb-6">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-900"
              >
                Workout Details
              </TabsTrigger>
              <TabsTrigger
                value="exercises"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-900"
              >
                Exercises{" "}
                {watchExercises.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {watchExercises.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-900"
              >
                Advanced Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Dumbbell className="mr-2 h-4 w-4 text-indigo-600" /> Workout Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Upper Body Strength"
                          {...field}
                          className="border-indigo-100 focus:border-indigo-300 dark:border-indigo-900 dark:focus:border-indigo-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-indigo-600" /> Duration (min)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            className="border-indigo-100 focus:border-indigo-300 dark:border-indigo-900 dark:focus:border-indigo-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="calories_burned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Flame className="mr-2 h-4 w-4 text-indigo-600" /> Calories
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            className="border-indigo-100 focus:border-indigo-300 dark:border-indigo-900 dark:focus:border-indigo-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="workout_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-indigo-100 focus:border-indigo-300 dark:border-indigo-900 dark:focus:border-indigo-700">
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="strength">Strength Training</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="flexibility">Flexibility</SelectItem>
                          <SelectItem value="balance">Balance</SelectItem>
                          <SelectItem value="sport">Sport Specific</SelectItem>
                          <SelectItem value="circuit">Circuit Training</SelectItem>
                          <SelectItem value="crossfit">CrossFit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-indigo-100 focus:border-indigo-300 dark:border-indigo-900 dark:focus:border-indigo-700">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-indigo-600" /> Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your workout routine..."
                        className="resize-none min-h-[120px] border-indigo-100 focus:border-indigo-300 dark:border-indigo-900 dark:focus:border-indigo-700"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include details about the workout focus, rest periods, and any special instructions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("exercises")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Next: Add Exercises
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="space-y-6">
              <Card className="border-indigo-100 dark:border-indigo-900">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                  <CardTitle>Exercise Selection</CardTitle>
                  <CardDescription>Add exercises to your workout routine</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ExerciseSelector form={form} />
                </CardContent>
              </Card>

              {watchExercises.length > 0 && (
                <Card className="border-indigo-100 dark:border-indigo-900">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                    <CardTitle>Selected Exercises</CardTitle>
                    <CardDescription>Review and edit your selected exercises</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {watchExercises.map((exercise, index) => (
                        <div key={index} className="p-4 border rounded-lg border-indigo-100 dark:border-indigo-900">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Exercise #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => {
                                const currentExercises = form.getValues("exercises") || []
                                form.setValue(
                                  "exercises",
                                  currentExercises.filter((_, i) => i !== index),
                                )
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                          <Separator className="my-2" />
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Sets</p>
                              <p>{exercise.sets}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Reps</p>
                              <p>{exercise.reps}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Weight (kg)</p>
                              <p>{exercise.weight || "Bodyweight"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                  className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                >
                  Back to Details
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("advanced")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Next: Advanced Options
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="border-indigo-100 dark:border-indigo-900">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                  <CardTitle>Advanced Options</CardTitle>
                  <CardDescription>Fine-tune your workout settings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Make Workout Public</FormLabel>
                          <FormDescription>Allow other users to view and copy your workout</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., legs, strength, morning (comma separated)"
                            onChange={(e) => {
                              const tags = e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean)
                              field.onChange(tags)
                            }}
                          />
                        </FormControl>
                        <FormDescription>Add tags to help categorize your workout</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <Button
                              key={day}
                              type="button"
                              variant={field.value?.includes(day.toLowerCase()) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const currentValue = field.value || []
                                const dayLower = day.toLowerCase()

                                if (currentValue.includes(dayLower)) {
                                  field.onChange(currentValue.filter((d) => d !== dayLower))
                                } else {
                                  field.onChange([...currentValue, dayLower])
                                }
                              }}
                            >
                              {day.substring(0, 3)}
                            </Button>
                          ))}
                        </div>
                        <FormDescription>Select days when you plan to do this workout</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("exercises")}
                  className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                >
                  Back to Exercises
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={startWorkout}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start Now
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Create Workout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}

