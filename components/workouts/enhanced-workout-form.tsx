"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ExerciseSelector } from "@/components/workouts/exercise-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Save, Play } from "lucide-react"

const workoutFormSchema = z.object({
  name: z.string().min(2, {
    message: "Workout name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  type: z.string({
    required_error: "Please select a workout type.",
  }),
  difficulty: z.string({
    required_error: "Please select a difficulty level.",
  }),
  duration: z.number().min(5).max(180),
  schedule: z.array(z.string()).optional(),
  exercises: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sets: z.number().min(1),
      reps: z.number().min(1),
      weight: z.number().optional(),
      duration: z.number().optional(),
      notes: z.string().optional(),
    }),
  ),
  public: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

const defaultValues: Partial<WorkoutFormValues> = {
  name: "",
  description: "",
  type: "strength",
  difficulty: "intermediate",
  duration: 45,
  exercises: [],
  public: false,
  tags: [],
  schedule: [],
}

export function EnhancedWorkoutForm() {
  const router = useRouter()
  const supabase = createClient()
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues,
  })

  async function onSubmit(data: WorkoutFormValues) {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a workout",
          variant: "destructive",
        })
        return
      }

      // Save workout to database
      const { data: workout, error } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description,
          type: data.type,
          difficulty: data.difficulty,
          duration: data.duration,
          schedule: data.schedule,
          is_public: data.public,
          tags: data.tags,
        })
        .select()

      if (error) throw error

      // Save exercises for this workout
      if (workout && workout[0]?.id) {
        const workoutExercises = data.exercises.map((exercise, index) => ({
          workout_id: workout[0].id,
          exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || null,
          duration: exercise.duration || null,
          notes: exercise.notes || null,
          order: index,
        }))

        const { error: exercisesError } = await supabase.from("workout_exercises").insert(workoutExercises)

        if (exercisesError) throw exercisesError
      }

      toast({
        title: "Workout Created",
        description: "Your workout has been successfully created",
      })

      router.push("/workouts")
      router.refresh()
    } catch (error) {
      console.error("Error creating workout:", error)
      toast({
        title: "Error",
        description: "There was an error creating your workout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function startWorkout() {
    const data = form.getValues()
    if (data.exercises.length === 0) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Details</CardTitle>
                  <CardDescription>Enter the basic information about your workout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Full Body Strength" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your workout..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workout Type & Difficulty</CardTitle>
                  <CardDescription>Categorize your workout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a workout type" />
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
                            <SelectItem value="bodyweight">Bodyweight</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                            <SelectTrigger>
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

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Estimated Duration (minutes)</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Slider
                              min={5}
                              max={180}
                              step={5}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                            />
                          </FormControl>
                          <span className="w-12 text-center font-medium">{value}</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Exercises</CardTitle>
                <CardDescription>Add exercises to your workout</CardDescription>
              </CardHeader>
              <CardContent>
                <ExerciseSelector
                  selectedExercises={selectedExercises}
                  setSelectedExercises={(exercises) => {
                    setSelectedExercises(exercises)
                    form.setValue("exercises", exercises)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>Fine-tune your workout settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="public"
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={startWorkout} disabled={isSubmitting} className="gap-2">
              <Play className="h-4 w-4" />
              Start Now
            </Button>

            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              Save Workout
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

