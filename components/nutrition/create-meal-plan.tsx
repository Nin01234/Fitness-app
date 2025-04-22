"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Utensils, CalendarIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export function CreateMealPlan() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()
  const [mealPlan, setMealPlan] = useState({
    name: "",
    description: "",
    duration: "7",
    goal: "weight-loss",
    includeBreakfast: true,
    includeLunch: true,
    includeDinner: true,
    includeSnacks: true,
    calorieTarget: "2000",
    proteinTarget: "120",
    carbsTarget: "200",
    fatTarget: "65",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMealPlan((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setMealPlan((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMealPlan((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Meal plan created",
      description: `Successfully created meal plan: ${mealPlan.name}`,
    })

    setIsSubmitting(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Meal Plan</DialogTitle>
          <DialogDescription>Design a custom meal plan tailored to your nutrition goals</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Targets</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., High Protein Cutting Plan"
                value={mealPlan.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your meal plan..."
                value={mealPlan.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Select value={mealPlan.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="28">28 days</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={mealPlan.goal} onValueChange={(value) => handleSelectChange("goal", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="performance">Athletic Performance</SelectItem>
                    <SelectItem value="health">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meals to Include</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeBreakfast"
                    checked={mealPlan.includeBreakfast}
                    onCheckedChange={(checked) => handleCheckboxChange("includeBreakfast", checked as boolean)}
                  />
                  <Label htmlFor="includeBreakfast" className="cursor-pointer">
                    Breakfast
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeLunch"
                    checked={mealPlan.includeLunch}
                    onCheckedChange={(checked) => handleCheckboxChange("includeLunch", checked as boolean)}
                  />
                  <Label htmlFor="includeLunch" className="cursor-pointer">
                    Lunch
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDinner"
                    checked={mealPlan.includeDinner}
                    onCheckedChange={(checked) => handleCheckboxChange("includeDinner", checked as boolean)}
                  />
                  <Label htmlFor="includeDinner" className="cursor-pointer">
                    Dinner
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSnacks"
                    checked={mealPlan.includeSnacks}
                    onCheckedChange={(checked) => handleCheckboxChange("includeSnacks", checked as boolean)}
                  />
                  <Label htmlFor="includeSnacks" className="cursor-pointer">
                    Snacks
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="calorieTarget">Daily Calorie Target</Label>
              <Input
                id="calorieTarget"
                name="calorieTarget"
                type="number"
                value={mealPlan.calorieTarget}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 1800-2200 calories for weight loss, 2200-2800 for maintenance
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proteinTarget">Protein (g)</Label>
                <Input
                  id="proteinTarget"
                  name="proteinTarget"
                  type="number"
                  value={mealPlan.proteinTarget}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbsTarget">Carbs (g)</Label>
                <Input
                  id="carbsTarget"
                  name="carbsTarget"
                  type="number"
                  value={mealPlan.carbsTarget}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatTarget">Fat (g)</Label>
                <Input
                  id="fatTarget"
                  name="fatTarget"
                  type="number"
                  value={mealPlan.fatTarget}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/30 mt-4">
              <h3 className="font-medium">Macronutrient Distribution</h3>
              <div className="flex h-4 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-red-500"
                  style={{
                    width: `${
                      ((Number.parseInt(mealPlan.proteinTarget) * 4) /
                        (Number.parseInt(mealPlan.proteinTarget) * 4 +
                          Number.parseInt(mealPlan.carbsTarget) * 4 +
                          Number.parseInt(mealPlan.fatTarget) * 9)) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="bg-blue-500"
                  style={{
                    width: `${
                      ((Number.parseInt(mealPlan.carbsTarget) * 4) /
                        (Number.parseInt(mealPlan.proteinTarget) * 4 +
                          Number.parseInt(mealPlan.carbsTarget) * 4 +
                          Number.parseInt(mealPlan.fatTarget) * 9)) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="bg-yellow-500"
                  style={{
                    width: `${
                      ((Number.parseInt(mealPlan.fatTarget) * 9) /
                        (Number.parseInt(mealPlan.proteinTarget) * 4 +
                          Number.parseInt(mealPlan.carbsTarget) * 4 +
                          Number.parseInt(mealPlan.fatTarget) * 9)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Protein</span>
                <span>Carbs</span>
                <span>Fat</span>
              </div>

              <div className="mt-4 text-sm">
                <p>
                  Total Calories:{" "}
                  {Number.parseInt(mealPlan.proteinTarget) * 4 +
                    Number.parseInt(mealPlan.carbsTarget) * 4 +
                    Number.parseInt(mealPlan.fatTarget) * 9}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(
                    ((Number.parseInt(mealPlan.proteinTarget) * 4) /
                      (Number.parseInt(mealPlan.proteinTarget) * 4 +
                        Number.parseInt(mealPlan.carbsTarget) * 4 +
                        Number.parseInt(mealPlan.fatTarget) * 9)) *
                      100,
                  )}
                  % protein,{" "}
                  {Math.round(
                    ((Number.parseInt(mealPlan.carbsTarget) * 4) /
                      (Number.parseInt(mealPlan.proteinTarget) * 4 +
                        Number.parseInt(mealPlan.carbsTarget) * 4 +
                        Number.parseInt(mealPlan.fatTarget) * 9)) *
                      100,
                  )}
                  % carbs,{" "}
                  {Math.round(
                    ((Number.parseInt(mealPlan.fatTarget) * 9) /
                      (Number.parseInt(mealPlan.proteinTarget) * 4 +
                        Number.parseInt(mealPlan.carbsTarget) * 4 +
                        Number.parseInt(mealPlan.fatTarget) * 9)) *
                      100,
                  )}
                  % fat
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Additional Nutrition Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any specific nutrition requirements or preferences..."
                value={mealPlan.notes}
                onChange={handleInputChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 mt-4">
              <Label>Meal Timing</Label>
              <div className="space-y-4 mt-2">
                {mealPlan.includeBreakfast && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mr-2">
                        <Utensils className="h-4 w-4" />
                      </div>
                      <span>Breakfast</span>
                    </div>
                    <Input type="time" defaultValue="07:30" className="w-32" />
                  </div>
                )}

                {mealPlan.includeLunch && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mr-2">
                        <Utensils className="h-4 w-4" />
                      </div>
                      <span>Lunch</span>
                    </div>
                    <Input type="time" defaultValue="12:30" className="w-32" />
                  </div>
                )}

                {mealPlan.includeDinner && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mr-2">
                        <Utensils className="h-4 w-4" />
                      </div>
                      <span>Dinner</span>
                    </div>
                    <Input type="time" defaultValue="18:30" className="w-32" />
                  </div>
                )}

                {mealPlan.includeSnacks && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10 text-primary mr-2">
                          <Utensils className="h-4 w-4" />
                        </div>
                        <span>Morning Snack</span>
                      </div>
                      <Input type="time" defaultValue="10:00" className="w-32" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10 text-primary mr-2">
                          <Utensils className="h-4 w-4" />
                        </div>
                        <span>Afternoon Snack</span>
                      </div>
                      <Input type="time" defaultValue="15:30" className="w-32" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="createReminders" />
                <Label htmlFor="createReminders" className="cursor-pointer">
                  Create reminders for meal times
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="generateGroceryList" />
                <Label htmlFor="generateGroceryList" className="cursor-pointer">
                  Generate grocery list for this meal plan
                </Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !mealPlan.name}>
            {isSubmitting ? (
              <>Creating Plan...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Create Plan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

