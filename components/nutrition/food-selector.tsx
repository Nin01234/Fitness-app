"use client"

import React, { useState, useEffect } from "react"
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
import { Plus, X, Camera, Search, Sparkles, ArrowRight, Info, Database, Filter, Settings, Check, Save } from "lucide-react"
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
  
  // For tracking daily nutrition totals
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFiber, setTotalFiber] = useState(0);
  const [fruitCount, setFruitCount] = useState(0);
  const [vegetableCount, setVegetableCount] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    // Calculate daily goal progress
    const currentFoods = form.getValues("foods") || [];
    let veggieCount = 0;
    let fruitCount = 0;
    let totalProtein = 0;
    let totalFiber = 0;

    currentFoods.forEach((item: any) => {
      const food = foods.find(f => f.id === item.food_id);
      if (food) {
        if (food.category === "vegetable") veggieCount += item.servings;
        if (food.category === "fruit") fruitCount += item.servings;
        totalProtein += (food.protein || 0) * item.servings;
        totalFiber += (food.fiber || 0) * item.servings;
      }
    });

    setTotalProtein(totalProtein);
    setTotalFiber(totalFiber);
    setFruitCount(fruitCount);
    setVegetableCount(veggieCount);

    setDailyGoalProgress({
      protein: Math.min(100, (totalProtein / 60) * 100), // Assuming 60g daily protein goal
      fiber: Math.min(100, (totalFiber / 30) * 100),     // Assuming 30g daily fiber goal
      fruits: Math.min(100, (fruitCount / 2) * 100),     // Assuming 2 servings of fruit daily
      vegetables: Math.min(100, (veggieCount / 5) * 100) // Assuming 5 servings of vegetables daily
    });
  }, [form.watch("foods"), foods]);

  // Filter foods based on search term and category
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle adding a food item
  const addFood = () => {
    if (!selectedFood) return;

    try {
      const currentFoods = form.getValues("foods") || [];

      // Check if the food is already in the list
      const existingIndex = currentFoods.findIndex(item => item.food_id === selectedFood);
      if (existingIndex >= 0) {
        // Update servings instead of adding a duplicate
        const updatedFoods = [...currentFoods];
        updatedFoods[existingIndex].servings += servings;
        form.setValue("foods", updatedFoods);
        
        // Update UI
        toast.success(`Updated ${foods.find(f => f.id === selectedFood)?.name} quantity`, {
          description: `Increased to ${updatedFoods[existingIndex].servings} servings`,
        });
      } else {
        // Add new food item
        form.setValue("foods", [
          ...currentFoods,
          {
            food_id: selectedFood,
            servings,
          },
        ]);
      }

      // Update nutrition values
      const food = foods.find((f) => f.id === selectedFood);
      if (food) {
        const currentCalories = form.getValues("calories") || 0;
        const currentProtein = form.getValues("protein") || 0;
        const currentCarbs = form.getValues("carbs") || 0;
        const currentFat = form.getValues("fat") || 0;

        form.setValue("calories", Math.round(currentCalories + food.calories * servings));
        form.setValue("protein", +(currentProtein + food.protein * servings).toFixed(1));
        form.setValue("carbs", +(currentCarbs + food.carbs * servings).toFixed(1));
        form.setValue("fat", +(currentFat + food.fat * servings).toFixed(1));
        
        // Save selected foods to localStorage for persistence
        const foodsArray = form.getValues("foods") || [];
        localStorage.setItem('temp_meal_foods', JSON.stringify(foodsArray));
        localStorage.setItem('temp_meal_nutrition', JSON.stringify({
          calories: form.getValues("calories"),
          protein: form.getValues("protein"),
          carbs: form.getValues("carbs"),
          fat: form.getValues("fat")
        }));
        
        toast.success(`Added ${food.name} to your meal`, {
          description: `${Math.round(food.calories * servings)} calories, ${Math.round(food.protein * servings)}g protein`,
        });
      }

      // Reset form
      setSelectedFood("");
      setServings(1);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Failed to add food item", {
        description: "Please try again or select a different food item."
      });
    }
  };

  // Load saved meal data from localStorage on component mount
  useEffect(() => {
    try {
      const savedFoods = localStorage.getItem('temp_meal_foods');
      const savedNutrition = localStorage.getItem('temp_meal_nutrition');
      
      if (savedFoods) {
        const foodsArray = JSON.parse(savedFoods);
        form.setValue("foods", foodsArray);
      }
      
      if (savedNutrition) {
        const nutrition = JSON.parse(savedNutrition);
        form.setValue("calories", nutrition.calories || 0);
        form.setValue("protein", nutrition.protein || 0);
        form.setValue("carbs", nutrition.carbs || 0);
        form.setValue("fat", nutrition.fat || 0);
      }
    } catch (error) {
      console.error("Error loading saved meal data:", error);
    }
  }, [form]);

  // Clear temp storage when form is submitted
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't clear data when just navigating away
      // localStorage.removeItem('temp_meal_foods');
      // localStorage.removeItem('temp_meal_nutrition');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const addCustomFood = () => {
    if (!customFood.name) return;

    // Generate a unique ID for the custom food
    const newId = `custom-${Date.now()}`;

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
    };

    setFoods((prev) => [...prev, newFood]);

    // Add to form
    const currentFoods = form.getValues("foods") || [];
    form.setValue("foods", [
      ...currentFoods,
      {
        food_id: newId,
        servings: 1,
      },
    ]);

    // Update nutrition values
    const currentCalories = form.getValues("calories") || 0;
    const currentProtein = form.getValues("protein") || 0;
    const currentCarbs = form.getValues("carbs") || 0;
    const currentFat = form.getValues("fat") || 0;

    form.setValue("calories", currentCalories + customFood.calories);
    form.setValue("protein", currentProtein + customFood.protein);
    form.setValue("carbs", currentCarbs + customFood.carbs);
    form.setValue("fat", currentFat + customFood.fat);

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
    });
    setIsDialogOpen(false);
  };

  const removeFood = (index: number) => {
    const currentFoods = form.getValues("foods") || [];
    const foodToRemove = currentFoods[index];
    const food = foods.find((f) => f.id === foodToRemove.food_id);

    if (food) {
      const currentCalories = form.getValues("calories") || 0;
      const currentProtein = form.getValues("protein") || 0;
      const currentCarbs = form.getValues("carbs") || 0;
      const currentFat = form.getValues("fat") || 0;

      form.setValue("calories", Math.round(currentCalories - food.calories * foodToRemove.servings));
      form.setValue("protein", +(currentProtein - food.protein * foodToRemove.servings).toFixed(1));
      form.setValue("carbs", +(currentCarbs - food.carbs * foodToRemove.servings).toFixed(1));
      form.setValue("fat", +(currentFat - food.fat * foodToRemove.servings).toFixed(1));
    }

    const updatedFoods = [...currentFoods];
    updatedFoods.splice(index, 1);
    form.setValue("foods", updatedFoods);
    
    // Update localStorage
    localStorage.setItem('temp_meal_foods', JSON.stringify(updatedFoods));
    localStorage.setItem('temp_meal_nutrition', JSON.stringify({
      calories: form.getValues("calories"),
      protein: form.getValues("protein"),
      carbs: form.getValues("carbs"),
      fat: form.getValues("fat")
    }));

    toast.info(`Removed ${food?.name || "food item"} from your meal`);
  };

  const handleScanQR = () => {
    toast.info("Barcode scanning would connect to food database API in production", {
      description: "This is a demo feature",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">Food Items</h3>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Food</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add Food to Meal</DialogTitle>
                <DialogDescription>
                  Search for foods or add your own custom items
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="search" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="search">
                    <Search className="h-4 w-4 mr-2" /> Search
                  </TabsTrigger>
                  <TabsTrigger value="scan">
                    <Camera className="h-4 w-4 mr-2" /> Scan Barcode
                  </TabsTrigger>
                  <TabsTrigger value="custom">
                    <Plus className="h-4 w-4 mr-2" /> Custom Food
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="search" className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search for a food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setSelectedCategory("all")}>
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                    {foodCategories.map((category) => (
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
                  
                  <ScrollArea className="h-[300px] rounded-md border p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredFoods.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center h-[200px] text-center p-4">
                          <Info className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No foods found. Try a different search term or category.</p>
                        </div>
                      ) : (
                        filteredFoods.map((food) => (
                          <Card
                            key={food.id}
                            className={`border cursor-pointer transition-all ${
                              selectedFood === food.id ? "border-primary" : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedFood(food.id)}
                          >
                            <CardContent className="p-3 flex gap-3 items-center">
                              <div
                                className="h-12 w-12 rounded bg-muted flex-shrink-0 overflow-hidden"
                                style={{
                                  backgroundImage: food.image ? `url(${food.image})` : "none",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{food.name}</p>
                                <div className="text-xs text-muted-foreground flex gap-2">
                                  <span>{food.calories} kcal</span>
                                  <span className="font-medium text-primary">{food.serving_size}</span>
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">P: {food.protein}g</Badge>
                                  <Badge variant="outline" className="text-xs">C: {food.carbs}g</Badge>
                                  <Badge variant="outline" className="text-xs">F: {food.fat}g</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  
                  {selectedFood && (
                    <div className="border rounded-md p-3 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Serving Size</h4>
                        <div className="text-sm text-muted-foreground">
                          {filteredFoods.find((f) => f.id === selectedFood)?.serving_size}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                          disabled={servings <= 0.5}
                        >
                          <span>-</span>
                        </Button>
                        <Input
                          type="number"
                          min={0.5}
                          step={0.5}
                          value={servings}
                          onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setServings(servings + 0.5)}
                        >
                          <span>+</span>
                        </Button>
                        <span className="ml-2 text-sm text-muted-foreground">servings</span>
                      </div>
                    </div>
                  )}
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
                          Calories
                        </label>
                        <Input
                          id="calories"
                          type="number"
                          min={0}
                          value={customFood.calories}
                          onChange={(e) => setCustomFood({ ...customFood, calories: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label htmlFor="serving" className="text-sm font-medium">
                          Serving Size
                        </label>
                        <Input
                          id="serving"
                          value={customFood.serving_size}
                          onChange={(e) => setCustomFood({ ...customFood, serving_size: e.target.value })}
                          placeholder="e.g., 100g, 1 cup"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="protein" className="text-sm font-medium">
                          Protein (g)
                        </label>
                        <Input
                          id="protein"
                          type="number"
                          min={0}
                          step={0.1}
                          value={customFood.protein}
                          onChange={(e) => setCustomFood({ ...customFood, protein: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label htmlFor="carbs" className="text-sm font-medium">
                          Carbs (g)
                        </label>
                        <Input
                          id="carbs"
                          type="number"
                          min={0}
                          step={0.1}
                          value={customFood.carbs}
                          onChange={(e) => setCustomFood({ ...customFood, carbs: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label htmlFor="fat" className="text-sm font-medium">
                          Fat (g)
                        </label>
                        <Input
                          id="fat"
                          type="number"
                          min={0}
                          step={0.1}
                          value={customFood.fat}
                          onChange={(e) => setCustomFood({ ...customFood, fat: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fiber" className="text-sm font-medium">
                          Fiber (g)
                        </label>
                        <Input
                          id="fiber"
                          type="number"
                          min={0}
                          step={0.1}
                          value={customFood.fiber}
                          onChange={(e) => setCustomFood({ ...customFood, fiber: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label htmlFor="sugar" className="text-sm font-medium">
                          Sugar (g)
                        </label>
                        <Input
                          id="sugar"
                          type="number"
                          min={0}
                          step={0.1}
                          value={customFood.sugar}
                          onChange={(e) => setCustomFood({ ...customFood, sugar: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  {activeTab === "custom" ? (
                    <Button 
                      disabled={!customFood.name || isNaN(customFood.calories)}
                      onClick={addCustomFood}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Custom Food
                    </Button>
                  ) : activeTab === "search" ? (
                    <Button 
                      disabled={!selectedFood} 
                      onClick={addFood}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save and Add to Meal
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleScanQR}
                      disabled={isLoading}
                    >
                      Scan Barcode
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> 
            Filter
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> 
            Customize Meal
          </Button>
        </div>
      </div>
      
      <Card className="border-primary/10">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Added Foods</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Database className="h-3.5 w-3.5 mr-1" />
              <span>Nutrition Breakdown</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {(!form.watch("foods") || form.watch("foods").length === 0) ? (
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg space-y-2">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No foods added yet</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Click the "Add Food" button to search our database or add your own custom items
                </p>
              </div>
              <Button className="mt-2" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add First Food
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid gap-2">
                {form.watch("foods")?.map((food: any, index: number) => {
                  const foodItem = foods.find((f) => f.id === food.food_id);
                  
                  if (!foodItem) return null;

                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex items-center gap-3">
                        {foodItem.image && (
                          <div
                            className="h-10 w-10 rounded bg-muted flex-shrink-0"
                            style={{
                              backgroundImage: `url(${foodItem.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        )}
                        <div>
                          <p className="font-medium">{foodItem.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {food.servings} {food.servings === 1 ? "serving" : "servings"} 
                            <span className="text-primary ml-1">
                              ({Math.round(foodItem.calories * food.servings)} kcal)
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm hidden md:block">
                          <div className="grid grid-cols-3 gap-2">
                            <Badge variant="outline" className="justify-center">
                              P: {Math.round(foodItem.protein * food.servings)}g
                            </Badge>
                            <Badge variant="outline" className="justify-center">
                              C: {Math.round(foodItem.carbs * food.servings)}g
                            </Badge>
                            <Badge variant="outline" className="justify-center">
                              F: {Math.round(foodItem.fat * food.servings)}g
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFood(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-3">Meal Nutrition Totals</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/40">
                    <CardContent className="p-3">
                      <div className="text-sm font-medium">Calories</div>
                      <div className="text-2xl font-bold">{form.watch("calories")}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/40">
                    <CardContent className="p-3">
                      <div className="text-sm font-medium">Protein</div>
                      <div className="text-2xl font-bold">{form.watch("protein")}g</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/40">
                    <CardContent className="p-3">
                      <div className="text-sm font-medium">Carbs</div>
                      <div className="text-2xl font-bold">{form.watch("carbs")}g</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/40">
                    <CardContent className="p-3">
                      <div className="text-sm font-medium">Fat</div>
                      <div className="text-2xl font-bold">{form.watch("fat")}g</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Daily Goal Progress */}
      {form.watch("foods")?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Protein ({Math.round(dailyGoalProgress.protein)}%)</div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(totalProtein)}g / 60g
                </span>
              </div>
              <Progress value={dailyGoalProgress.protein} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Fiber ({Math.round(dailyGoalProgress.fiber)}%)</div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(totalFiber)}g / 30g
                </span>
              </div>
              <Progress value={dailyGoalProgress.fiber} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Fruits ({Math.round(dailyGoalProgress.fruits)}%)</div>
                <span className="text-sm text-muted-foreground">
                  {fruitCount.toFixed(1)} / 2 servings
                </span>
              </div>
              <Progress value={dailyGoalProgress.fruits} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Vegetables ({Math.round(dailyGoalProgress.vegetables)}%)</div>
                <span className="text-sm text-muted-foreground">
                  {vegetableCount.toFixed(1)} / 5 servings
                </span>
              </div>
              <Progress value={dailyGoalProgress.vegetables} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

