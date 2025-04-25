"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Save, Check, UtensilsCrossed } from "lucide-react"
import { FoodSelector } from "@/components/nutrition/food-selector"

const formSchema = z.object({
  name: z.string().min(2, { message: "Meal name is required" }),
  meal_type: z.string().min(1, { message: "Meal type is required" }),
  calories: z.coerce.number().min(0, { message: "Calories must be a positive number" }),
  protein: z.coerce.number().min(0, { message: "Protein must be a positive number" }),
  carbs: z.coerce.number().min(0, { message: "Carbs must be a positive number" }),
  fat: z.coerce.number().min(0, { message: "Fat must be a positive number" }),
  foods: z
    .array(
      z.object({
        food_id: z.string(),
        servings: z.coerce.number().min(0.1),
      }),
    )
    .optional(),
})

export function LogMealForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      meal_type: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      foods: [],
    },
  })

  const foods = form.watch("foods") || [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      toast.loading("Saving your meal...");

      const { data: meal, error: mealError } = await supabase
        .from("meals")
        .insert({
          user_id: userData.user.id,
          name: values.name,
          meal_type: values.meal_type,
          calories: values.calories,
          protein: values.protein,
          carbs: values.carbs,
          fat: values.fat,
          date: new Date().toISOString(),
        })
        .select()
        .single()

      if (mealError) {
        throw mealError
      }

      if (values.foods && values.foods.length > 0) {
        const mealFoods = values.foods.map((food) => ({
          meal_id: meal.id,
          food_id: food.food_id,
          servings: food.servings,
        }))

        const { error: foodsError } = await supabase.from("meal_foods").insert(mealFoods)

        if (foodsError) {
          throw foodsError
        }
      }

      // Set the meal-logged flag to update nutrition stats
      sessionStorage.setItem('meal-logged', 'true');

      toast.dismiss();
      toast.success("Meal Logged Successfully", {
        description: `${values.name} has been added to your nutrition log.`,
        icon: <Check className="h-5 w-5 text-green-500" />,
        duration: 5000,
        position: "top-center",
      });

      setTimeout(() => {
        router.push("/nutrition");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      toast.dismiss();
      toast.error("Error Saving Meal", {
        description: error.message || "Something went wrong. Please try again.",
        icon: <UtensilsCrossed className="h-5 w-5 text-red-500" />,
        duration: 5000,
      });
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (foods.length > 0) {
      const totalCalories = form.getValues("calories") || 0;
      toast.info(`Food Item ${foods.length > 1 ? 'Update' : 'Added'}`, {
        description: `You now have ${foods.length} food ${foods.length === 1 ? 'item' : 'items'} (${totalCalories} calories) in your meal`,
        duration: 3000,
        position: "bottom-right",
      });
    }
  }, [foods.length]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Grilled Chicken Salad" {...field} />
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
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="protein"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protein (g)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carbs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs (g)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fat (g)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FoodSelector form={form} />
        <div className="flex justify-center mt-8">
          <Button 
            type="submit" 
            disabled={isLoading || foods.length === 0} 
            className="w-full md:w-1/3 bg-green-600 hover:bg-green-700" 
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging Meal...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" /> Save Meal {foods.length > 0 && `(${foods.length} items)`}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

