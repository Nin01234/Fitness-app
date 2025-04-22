"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, X, Camera, Search, Sparkles, ArrowRight, Info, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FoodSelectorProps {
  form: UseFormReturn<any>
}

// Expanded food database
const nutritionDatabase = [
  { id: "1", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein", fiber: 0, sugar: 0, sodium: 74, potassium: 256, vitamin_a: 0, vitamin_c: 0, calcium: 0, iron: 0.9, serving_size: "100g", image: "https://source.unsplash.com/kvPEIGiQ4us/100x100" },
  { id: "2", name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, category: "grain", fiber: 3.5, sugar: 0.7, sodium: 10, potassium: 84, vitamin_a: 0, vitamin_c: 0, calcium: 10, iron: 0.8, serving_size: "100g", image: "https://source.unsplash.com/7Ja-I8-ea3M/100x100" },
  { id: "3", name: "Broccoli", calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, category: "vegetable", fiber: 5.1, sugar: 2.5, sodium: 33, potassium: 316, vitamin_a: 623, vitamin_c: 89.2, calcium: 47, iron: 0.7, serving_size: "100g", image: "https://source.unsplash.com/K0yMA4M1L1I/100x100" },
  { id: "4", name: "Salmon", calories: 206, protein: 22, carbs: 0, fat: 13, category: "protein", fiber: 0, sugar: 0, sodium: 59, potassium: 384, vitamin_a: 58, vitamin_c: 0, calcium: 12, iron: 0.8, serving_size: "100g", image: "https://source.unsplash.com/QnNqGoCnBg0/100x100" },
  { id: "5", name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, category: "vegetable", fiber: 3, sugar: 4.2, sodium: 55, potassium: 337, vitamin_a: 14187, vitamin_c: 2.4, calcium: 30, iron: 0.6, serving_size: "100g", image: "https://source.unsplash.com/xeduTB5Q_aY/100x100" },
  { id: "6", name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: "vegetable", fiber: 2.2, sugar: 0.4, sodium: 79, potassium: 558, vitamin_a: 9377, vitamin_c: 28.1, calcium: 99, iron: 2.7, serving_size: "100g", image: "https://source.unsplash.com/PYxLK1HEFT0/100x100" },
  { id: "7", name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: "dairy", fiber: 0, sugar: 3.6, sodium: 36, potassium: 141, vitamin_a: 45, vitamin_c: 0, calcium: 110, iron: 0.1, serving_size: "100g", image: "https://source.unsplash.com/6K4gqB5qDdU/100x100" },
  { id: "8", name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, category: "nuts", fiber: 3.5, sugar: 1.2, sodium: 1, potassium: 220, vitamin_a: 0, vitamin_c: 0, calcium: 75, iron: 1, serving_size: "28g", image: "https://source.unsplash.com/qXlHbElX3TM/100x100" },
  { id: "9", name: "Banana", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, category: "fruit", fiber: 2.6, sugar: 12.2, sodium: 1, potassium: 358, vitamin_a: 64, vitamin_c: 8.7, calcium: 5, iron: 0.3, serving_size: "100g", image: "https://source.unsplash.com/fczCr7MdE7U/100x100" },
  { id: "10", name: "Egg", calories: 68, protein: 5.5, carbs: 0.6, fat: 4.8, category: "protein", fiber: 0, sugar: 0.6, sodium: 71, potassium: 69, vitamin_a: 487, vitamin_c: 0, calcium: 25, iron: 0.9, serving_size: "50g", image: "https://source.unsplash.com/1d9xXWMtQzQ/100x100" },
  { id: "11", name: "Avocado", calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: "fruit", fiber: 6.7, sugar: 0.7, sodium: 7, potassium: 485, vitamin_a: 146, vitamin_c: 10, calcium: 12, iron: 0.6, serving_size: "100g", image: "https://source.unsplash.com/Iw-thiBGzAs/100x100" },
  { id: "12", name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, category: "grain", fiber: 1.7, sugar: 0.4, sodium: 2, potassium: 61, vitamin_a: 0, vitamin_c: 0, calcium: 10, iron: 0.7, serving_size: "100g", image: "https://source.unsplash.com/YLyxXawZm4w/100x100" },
  { id: "13", name: "Quinoa", calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, category: "grain", fiber: 2.8, sugar: 0.9, sodium: 7, potassium: 172, vitamin_a: 9, vitamin_c: 0, calcium: 17, iron: 1.5, serving_size: "100g", image: "https://source.unsplash.com/F-AdanKMxFQ/100x100" },
  { id: "14", name: "Blueberries", calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, category: "fruit", fiber: 2.4, sugar: 10, sodium: 1, potassium: 77, vitamin_a: 54, vitamin_c: 9.7, calcium: 6, iron: 0.3, serving_size: "100g", image: "https://source.unsplash.com/QO6DTIm4FI8/100x100" },
  { id: "15", name: "Black Beans", calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, category: "legume", fiber: 8.7, sugar: 0.3, sodium: 1, potassium: 355, vitamin_a: 0, vitamin_c: 0, calcium: 27, iron: 2.1, serving_size: "100g", image: "https://source.unsplash.com/YeGao3uk8kI/100x100" },
];

// Food categories for filtering
const foodCategories = [
  { id: "all", name: "All Foods" },
  { id: "protein", name: "Proteins" },
  { id: "vegetable", name: "Vegetables" },
  { id: "fruit", name: "Fruits" },
  { id: "grain", name: "Grains" },
  { id: "dairy", name: "Dairy" },
  { id: "nuts", name: "Nuts & Seeds" },
  { id: "legume", name: "Legumes" },
];

// Healthy eating goals
const healthyEatingTips = [
  "Aim for 5+ servings of vegetables and fruits daily",
  "Choose whole grains over refined grains",
  "Include lean protein with each meal",
  "Limit added sugars and processed foods",
  "Stay hydrated with water throughout the day",
  "Practice mindful eating by slowing down",
];

export function FoodSelector({ form }: FoodSelectorProps) {
  const [foods, setFoods] = useState<any[]>(nutritionDatabase);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [servings, setServings] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [dailyGoalProgress, setDailyGoalProgress] = useState({
    protein: 0,
    fiber: 0,
    fruits: 0,
    vegetables: 0,
  });
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    category: "custom",
    serving_size: "100g",
  });

  const supabase = createClient()

  useEffect(() => {
    // Calculate daily goal progress
    const currentFoods = form.getValues("foods") || [];
    let vegetableCount = 0;
    let fruitCount = 0;
    let totalProtein = 0;
    let totalFiber = 0;

    currentFoods.forEach((item: any) => {
      const food = foods.find(f => f.id === item.food_id);
      if (food) {
        if (food.category === "vegetable") vegetableCount += item.servings;
        if (food.category === "fruit") fruitCount += item.servings;
        totalProtein += (food.protein || 0) * item.servings;
        totalFiber += (food.fiber || 0) * item.servings;
      }
    });

    setDailyGoalProgress({
      protein: Math.min(100, (totalProtein / 60) * 100), // Assuming 60g daily protein goal
      fiber: Math.min(100, (totalFiber / 30) * 100),     // Assuming 30g daily fiber goal
      fruits: Math.min(100, (fruitCount / 2) * 100),     // Assuming 2 servings of fruit daily
      vegetables: Math.min(100, (vegetableCount / 5) * 100) // Assuming 5 servings of vegetables daily
    });
  }, [form.watch("foods")]);

  // Filter foods based on search term and category
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addFood = () => {
    if (!selectedFood) return;

    const currentFoods = form.getValues("foods") || [];

    form.setValue("foods", [
      ...currentFoods,
      {
        food_id: selectedFood,
        servings,
      },
    ]);

    // Update nutrition values
    const food = foods.find((f) => f.id === selectedFood);
    if (food) {
      const currentCalories = form.getValues("calories") || 0;
      const currentProtein = form.getValues("protein") || 0;
      const currentCarbs = form.getValues("carbs") || 0;
      const currentFat = form.getValues("fat") || 0;

      form.setValue("calories", currentCalories + food.calories * servings);
      form.setValue("protein", currentProtein + food.protein * servings);
      form.setValue("carbs", currentCarbs + food.carbs * servings);
      form.setValue("fat", currentFat + food.fat * servings);
      
      toast.success(`Added ${food.name} to your meal`, {
        description: `${Math.round(food.calories * servings)} calories, ${Math.round(food.protein * servings)}g protein`,
      });
    }

    // Reset form
    setSelectedFood("");
    setServings(1);
    setIsDialogOpen(false);
  };

  const addCustomFood = () => {
    if (!customFood.name) return

    // Generate a unique ID for the custom food
    const newId = `custom-${Date.now()}`

    // Add to foods list
    const newFood = {
      id: newId,
      name: customFood.name,
      calories: customFood.calories,
      protein: customFood.protein,
      carbs: customFood.carbs,
      fat: customFood.fat,
      fiber: customFood.fiber,
      sugar: customFood.sugar,
      category: customFood.category,
      serving_size: customFood.serving_size,
    }

    setFoods((prev) => [...prev, newFood])

    // Add to form
    const currentFoods = form.getValues("foods") || []
    form.setValue("foods", [
      ...currentFoods,
      {
        food_id: newId,
        servings: 1,
      },
    ])

    // Update nutrition values
    const currentCalories = form.getValues("calories") || 0
    const currentProtein = form.getValues("protein") || 0
    const currentCarbs = form.getValues("carbs") || 0
    const currentFat = form.getValues("fat") || 0

    form.setValue("calories", currentCalories + customFood.calories)
    form.setValue("protein", currentProtein + customFood.protein)
    form.setValue("carbs", currentCarbs + customFood.carbs)
    form.setValue("fat", currentFat + customFood.fat)

    // Reset form
    setCustomFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      category: "custom",
      serving_size: "100g",
    })
    setIsDialogOpen(false)
  }

  const removeFood = (index: number) => {
    const currentFoods = form.getValues("foods") || []
    const foodToRemove = currentFoods[index]
    const food = foods.find((f) => f.id === foodToRemove.food_id)

    if (food) {
      const currentCalories = form.getValues("calories") || 0
      const currentProtein = form.getValues("protein") || 0
      const currentCarbs = form.getValues("carbs") || 0
      const currentFat = form.getValues("fat") || 0

      form.setValue("calories", currentCalories - food.calories * foodToRemove.servings)
      form.setValue("protein", currentProtein - food.protein * foodToRemove.servings)
      form.setValue("carbs", currentCarbs - food.carbs * foodToRemove.servings)
      form.setValue("fat", currentFat - food.fat * foodToRemove.servings)
      
      toast.info(`Removed ${food.name} from your meal`)
    }

    const updatedFoods = [...currentFoods]
    updatedFoods.splice(index, 1)
    form.setValue("foods", updatedFoods)
  }

  const handleScanQR = () => {
    // In a real app, this would activate the camera for QR scanning
    toast.info("QR scanning would be activated here.")
  }

  const selectedFoods = form.watch("foods") || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Foods & Nutrition</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 border-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add Food</DialogTitle>
              <DialogDescription>Search for a food or add your own custom entry</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="scan">Scan Barcode</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="py-2">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search foods..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {foodCategories.map(category => (
                      <Badge 
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <ScrollArea className="h-[350px] pr-4">
                    <div className="grid grid-cols-1 gap-3">
                      {filteredFoods.length > 0 ? (
                        filteredFoods.map((food) => (
                          <div
                            key={food.id}
                            className={`p-3 border rounded-lg flex gap-3 items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${
                              selectedFood === food.id ? "border-primary bg-primary/10" : ""
                            }`}
                            onClick={() => setSelectedFood(food.id)}
                          >
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              {food.image ? (
                                <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                  <Sparkles size={20} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{food.name}</div>
                              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-2">
                                <span>{food.calories} kcal</span>
                                <span>•</span>
                                <span>{food.protein}g protein</span>
                                <span>•</span>
                                <span>{food.serving_size}</span>
                              </div>
                            </div>
                            <div className="ml-auto flex flex-col justify-between items-end">
                              <Badge variant="outline" className="mb-2">{food.category}</Badge>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => {
                                      e.stopPropagation();
                                      // Show detailed nutrition info
                                      toast.info(`Nutrition for ${food.name}`, {
                                        description: (
                                          <div className="text-xs space-y-1">
                                            <div>Calories: {food.calories}kcal</div>
                                            <div>Protein: {food.protein}g</div>
                                            <div>Carbs: {food.carbs}g</div>
                                            <div>Fat: {food.fat}g</div>
                                            <div>Fiber: {food.fiber}g</div>
                                            <div>Sugar: {food.sugar}g</div>
                                          </div>
                                        ),
                                      });
                                    }}>
                                      <Info size={14} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View detailed nutrition</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                          No foods found matching your search
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {selectedFood && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <label htmlFor="servings" className="text-sm font-medium">
                          Servings
                        </label>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                            disabled={servings <= 0.5}
                          >
                            -
                          </Button>
                          <Input
                            id="servings"
                            type="number"
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                            className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            step={0.5}
                            min={0.5}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => setServings(servings + 0.5)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="scan" className="h-[350px] flex flex-col items-center justify-center space-y-4">
                <div className="p-6 border-2 border-dashed rounded-xl flex flex-col items-center gap-4">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <p className="text-center">Scan a barcode to quickly add food information</p>
                </div>
                <Button onClick={handleScanQR}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
                <p className="text-sm text-muted-foreground">
                  This feature would connect to a food database API in a production environment.
                </p>
              </TabsContent>

              <TabsContent value="custom" className="py-2">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium">
                      Food Name
                    </label>
                    <Input
                      id="name"
                      value={customFood.name}
                      onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                      placeholder="e.g., Homemade Pasta"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="calories" className="text-sm font-medium">
                        Calories (kcal)
                      </label>
                      <Input
                        id="calories"
                        type="number"
                        value={customFood.calories}
                        onChange={(e) =>
                          setCustomFood({ ...customFood, calories: Number(e.target.value) })
                        }
                        min={0}
                      />
                    </div>
                    <div>
                      <label htmlFor="protein" className="text-sm font-medium">
                        Protein (g)
                      </label>
                      <Input
                        id="protein"
                        type="number"
                        value={customFood.protein}
                        onChange={(e) =>
                          setCustomFood({ ...customFood, protein: Number(e.target.value) })
                        }
                        min={0}
                      />
                    </div>
                    <div>
                      <label htmlFor="carbs" className="text-sm font-medium">
                        Carbs (g)
                      </label>
                      <Input
                        id="carbs"
                        type="number"
                        value={customFood.carbs}
                        onChange={(e) =>
                          setCustomFood({ ...customFood, carbs: Number(e.target.value) })
                        }
                        min={0}
                      />
                    </div>
                    <div>
                      <label htmlFor="fat" className="text-sm font-medium">
                        Fat (g)
                      </label>
                      <Input
                        id="fat"
                        type="number"
                        value={customFood.fat}
                        onChange={(e) => setCustomFood({ ...customFood, fat: Number(e.target.value) })}
                        min={0}
                      />
                    </div>
                    <div>
                      <label htmlFor="fiber" className="text-sm font-medium">
                        Fiber (g)
                      </label>
                      <Input
                        id="fiber"
                        type="number"
                        value={customFood.fiber}
                        onChange={(e) =>
                          setCustomFood({ ...customFood, fiber: Number(e.target.value) })
                        }
                        min={0}
                      />
                    </div>
                    <div>
                      <label htmlFor="sugar" className="text-sm font-medium">
                        Sugar (g)
                      </label>
                      <Input
                        id="sugar"
                        type="number"
                        value={customFood.sugar}
                        onChange={(e) =>
                          setCustomFood({ ...customFood, sugar: Number(e.target.value) })
                        }
                        min={0}
                      />
                    </div>
                    <div>
                      <label htmlFor="serving_size" className="text-sm font-medium">
                        Serving Size
                      </label>
                      <Input
                        id="serving_size"
                        value={customFood.serving_size}
                        onChange={(e) =>
                          setCustomFood({ ...customFood, serving_size: e.target.value })
                        }
                        placeholder="e.g., 100g, 1 cup"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-auto pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              {activeTab === "search" ? (
                <Button onClick={addFood} disabled={!selectedFood}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Meal
                </Button>
              ) : activeTab === "custom" ? (
                <Button onClick={addCustomFood} disabled={!customFood.name}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Food
                </Button>
              ) : (
                <Button onClick={handleScanQR}>
                  <Camera className="mr-2 h-4 w-4" />
                  Scan
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Healthy Eating Progress */}
      {selectedFoods.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Nutrition Goals</CardTitle>
            <CardDescription>Track your progress toward healthy eating habits</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Protein (Goal: 60g)</span>
                  <span>{Math.round(form.getValues("protein") || 0)}g</span>
                </div>
                <Progress value={dailyGoalProgress.protein} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fiber (Goal: 30g)</span>
                  <span>{Math.round(dailyGoalProgress.fiber * 0.3)}g</span>
                </div>
                <Progress value={dailyGoalProgress.fiber} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vegetables (Goal: 5 servings)</span>
                  <span>{Math.round(dailyGoalProgress.vegetables * 0.05 * 100) / 100} servings</span>
                </div>
                <Progress value={dailyGoalProgress.vegetables} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fruits (Goal: 2 servings)</span>
                  <span>{Math.round(dailyGoalProgress.fruits * 0.02 * 100) / 100} servings</span>
                </div>
                <Progress value={dailyGoalProgress.fruits} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" size="sm" className="px-0" onClick={() => {
              toast.info("Healthy Eating Habits", {
                description: (
                  <ul className="text-sm space-y-1 list-disc pl-4">
                    {healthyEatingTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                ),
              });
            }}>
              View healthy eating tips <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {selectedFoods.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {selectedFoods.map((item: any, index: number) => {
            const food = foods.find((f) => f.id === item.food_id);
            if (!food) return null;

            return (
              <div
                key={`${food.id}-${index}`}
                className="flex items-center p-3 border rounded-lg gap-3"
              >
                <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {food.image ? (
                    <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Database size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.servings} {item.servings > 1 ? "servings" : "serving"} ({Math.round(food.calories * item.servings)} kcal)
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFood(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 border rounded-lg bg-muted/10">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">No foods added yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Food
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium mb-1.5">{children}</div>;
}

