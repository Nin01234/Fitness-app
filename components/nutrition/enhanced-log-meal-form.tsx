"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FoodSelector } from "@/components/nutrition/food-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Utensils,
  Clock,
  Calendar,
  Camera,
  Plus,
  Minus,
  Save,
  Apple,
  Beef,
  CroissantIcon as Bread,
  Coffee,
  Fish,
  Salad,
  Droplets,
  Flame,
} from "lucide-react"

const mealFormSchema = z.object({
  name: z.string().min(2, {
    message: "Meal name must be at least 2 characters.",
  }),
  meal_type: z.string({
    required_error: "Please select a meal type.",
  }),
  date: z.string(),
  time: z.string(),
  foods: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      quantity: z.number().min(0.1),
      unit: z.string(),
      calories: z.number().min(0),
      protein: z.number().min(0),
      carbs: z.number().min(0),
      fat: z.number().min(0),
    }),
  ),
  water_intake: z.number().min(0).default(0),
  notes: z.string().optional(),
  hunger_level: z.number().min(1).max(5).default(3),
  satisfaction_level: z.number().min(1).max(5).default(3),
  energy_level: z.number().min(1).max(5).default(3),
  is_favorite: z.boolean().default(false),
})

type MealFormValues = z.infer<typeof mealFormSchema>

// Get current date and time in the format expected by the date and time inputs
const now = new Date()
const currentDate = now.toISOString().split("T")[0]
const currentTime = now.toTimeString().split(" ")[0].substring(0, 5)

const defaultValues: Partial<MealFormValues> = {
  name: "",
  meal_type: "lunch",
  date: currentDate,
  time: currentTime,
  foods: [],
  water_intake: 0,
  notes: "",
  hunger_level: 3,
  satisfaction_level: 3,
  energy_level: 3,
  is_favorite: false,
}

const mealTypeIcons: Record<string, React.ReactNode> = {
  breakfast: <Coffee className="h-4 w-4" />,
  lunch: <Salad className="h-4 w-4" />,
  dinner: <Utensils className="h-4 w-4" />,
  snack: <Apple className="h-4 w-4" />,
}

export function EnhancedLogMealForm() {
  const router = useRouter()
  const supabase = createClient()
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])
  const [mealPhoto, setMealPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues,
  })

  // Calculate nutrition totals
  const calculateTotals = () => {
    const foods = form.watch("foods") || []
    return foods.reduce(
      (acc, food) => {
        acc.calories += food.calories * food.quantity
        acc.protein += food.protein * food.quantity
        acc.carbs += food.carbs * food.quantity
        acc.fat += food.fat * food.quantity
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const totals = calculateTotals()

  async function onSubmit(data: MealFormValues) {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to log a meal",
          variant: "destructive",
        })
        return
      }

      // Combine date and time
      const dateTime = new Date(`${data.date}T${data.time}`)

      // Save meal to database
      const { data: meal, error } = await supabase
        .from("meals")
        .insert({
          user_id: user.id,
          name: data.name,
          meal_type: data.meal_type,
          date: dateTime.toISOString(),
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
          water_intake: data.water_intake,
          notes: data.notes,
          hunger_level: data.hunger_level,
          satisfaction_level: data.satisfaction_level,
          energy_level: data.energy_level,
          is_favorite: data.is_favorite,
        })
        .select()

      if (error) throw error

      // Save food items for this meal
      if (meal && meal[0]?.id) {
        const mealId = meal[0].id
        const foodItems = data.foods.map((food) => ({
          meal_id: mealId,
          name: food.name,
          quantity: food.quantity,
          unit: food.unit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        }))

        const { error: foodsError } = await supabase.from("meal_foods").insert(foodItems)

        if (foodsError) throw foodsError

        // Upload meal photo if any
        if (mealPhoto) {
          const fileExt = mealPhoto.name.split(".").pop()
          const fileName = `${user.id}/${mealId}/meal.${fileExt}`

          const { error: uploadError } = await supabase.storage.from("meal-photos").upload(fileName, mealPhoto)

          if (uploadError) {
            console.error("Error uploading meal photo:", uploadError)
          } else {
            const { data: urlData } = supabase.storage.from("meal-photos").getPublicUrl(fileName)

            if (urlData) {
              await supabase
                .from("meals")
                .update({
                  photo_url: urlData.publicUrl,
                })
                .eq("id", mealId)
            }
          }
        }
      }

      toast({
        title: "Meal Logged",
        description: "Your meal has been successfully recorded",
      })

      router.push("/nutrition")
      router.refresh()
    } catch (error) {
      console.error("Error logging meal:", error)
      toast({
        title: "Error",
        description: "There was an error logging your meal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setMealPhoto(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="foods">Foods</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meal Information</CardTitle>
                  <CardDescription>Enter basic information about your meal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Grilled Chicken Salad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meal_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breakfast">
                              <div className="flex items-center">
                                <Coffee className="mr-2 h-4 w-4" /> Breakfast
                              </div>
                            </SelectItem>
                            <SelectItem value="lunch">
                              <div className="flex items-center">
                                <Salad className="mr-2 h-4 w-4" /> Lunch
                              </div>
                            </SelectItem>
                            <SelectItem value="dinner">
                              <div className="flex items-center">
                                <Utensils className="mr-2 h-4 w-4" /> Dinner
                              </div>
                            </SelectItem>
                            <SelectItem value="snack">
                              <div className="flex items-center">
                                <Apple className="mr-2 h-4 w-4" /> Snack
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> Date
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" /> Time
                          </FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Photo</CardTitle>
                  <CardDescription>Upload a photo of your meal (optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    {photoPreview ? (
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src={photoPreview || "/placeholder.svg"}
                          alt="Meal preview"
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setMealPhoto(null)
                            setPhotoPreview(null)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-48 mb-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                      </div>
                    )}

                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="meal-photo"
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="meal-photo">
                      <Button type="button" variant="outline" className="w-full" asChild>
                        <span>
                          <Camera className="mr-2 h-4 w-4" />
                          {photoPreview ? "Change Photo" : "Upload Photo"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="foods" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Food Items</CardTitle>
                <CardDescription>Add the foods you've eaten in this meal</CardDescription>
              </CardHeader>
              <CardContent>
                <FoodSelector
                  selectedFoods={selectedFoods}
                  setSelectedFoods={(foods) => {
                    setSelectedFoods(foods)
                    form.setValue("foods", foods)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Summary</CardTitle>
                  <CardDescription>Nutritional breakdown of your meal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Flame className="h-5 w-5 mr-2 text-orange-500" />
                        <span>Calories</span>
                      </div>
                      <span className="font-bold">{Math.round(totals.calories)} kcal</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Beef className="h-5 w-5 mr-2 text-red-500" />
                        <span>Protein</span>
                      </div>
                      <span className="font-bold">{Math.round(totals.protein)}g</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bread className="h-5 w-5 mr-2 text-amber-500" />
                        <span>Carbs</span>
                      </div>
                      <span className="font-bold">{Math.round(totals.carbs)}g</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Fish className="h-5 w-5 mr-2 text-blue-500" />
                        <span>Fat</span>
                      </div>
                      <span className="font-bold">{Math.round(totals.fat)}g</span>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Macronutrient Ratio</h4>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        {totals.calories > 0 ? (
                          <>
                            <div
                              className="bg-red-500"
                              style={{ width: `${((totals.protein * 4) / totals.calories) * 100}%` }}
                            />
                            <div
                              className="bg-amber-500"
                              style={{ width: `${((totals.carbs * 4) / totals.calories) * 100}%` }}
                            />
                            <div
                              className="bg-blue-500"
                              style={{ width: `${((totals.fat * 9) / totals.calories) * 100}%` }}
                            />
                          </>
                        ) : (
                          <div className="bg-gray-200 w-full" />
                        )}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Protein</span>
                        <span>Carbs</span>
                        <span>Fat</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Water Intake</CardTitle>
                  <CardDescription>Track your water consumption with this meal</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="water_intake"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className="flex items-center">
                            <Droplets className="mr-2 h-4 w-4 text-blue-500" /> Water (glasses)
                          </FormLabel>
                          <span className="font-bold">{value}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => onChange(Math.max(0, value - 0.5))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.5}
                              value={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              className="flex-1"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => onChange(Math.min(10, value + 0.5))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription>One glass is approximately 250ml</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Daily Water Progress</h4>
                    <div className="w-full bg-blue-100 dark:bg-blue-950 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${Math.min(100, (form.watch("water_intake") / 8) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>0</span>
                      <span>Daily Goal: 8 glasses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meal Experience</CardTitle>
                  <CardDescription>Rate your experience with this meal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="hunger_level"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Hunger Level Before Eating (1-5)</FormLabel>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Not Hungry</span>
                            <span>Very Hungry</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                            />
                          </FormControl>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <span
                                key={num}
                                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                  value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                                onClick={() => onChange(num)}
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="satisfaction_level"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Satisfaction Level (1-5)</FormLabel>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Not Satisfied</span>
                            <span>Very Satisfied</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                            />
                          </FormControl>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <span
                                key={num}
                                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                  value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                                onClick={() => onChange(num)}
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="energy_level"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Energy Level After Eating (1-5)</FormLabel>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Low Energy</span>
                            <span>High Energy</span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                            />
                          </FormControl>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <span
                                key={num}
                                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                  value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                                onClick={() => onChange(num)}
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Add notes and preferences for this meal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any notes about this meal..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include details about how you prepared the meal, how you felt after eating, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_favorite"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Save as Favorite</FormLabel>
                          <FormDescription>Add this meal to your favorites for quick access</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            Save Meal
          </Button>
        </div>
      </form>
    </Form>
  )
}

