"use client"

import type React from "react"
import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExerciseSelectorProps {
  form: UseFormReturn<any>
}

// Mock exercise data since the database table doesn't exist
const mockExercises = [
  { id: "1", name: "Bench Press", category: "chest", equipment: "barbell" },
  { id: "2", name: "Squat", category: "legs", equipment: "barbell" },
  { id: "3", name: "Deadlift", category: "back", equipment: "barbell" },
  { id: "4", name: "Pull-up", category: "back", equipment: "bodyweight" },
  { id: "5", name: "Push-up", category: "chest", equipment: "bodyweight" },
  { id: "6", name: "Leg Press", category: "legs", equipment: "machine" },
  { id: "7", name: "Shoulder Press", category: "shoulders", equipment: "dumbbell" },
  { id: "8", name: "Bicep Curl", category: "arms", equipment: "dumbbell" },
  { id: "9", name: "Tricep Extension", category: "arms", equipment: "cable" },
  { id: "10", name: "Plank", category: "core", equipment: "bodyweight" },
  { id: "11", name: "Lat Pulldown", category: "back", equipment: "cable" },
  { id: "12", name: "Leg Curl", category: "legs", equipment: "machine" },
  { id: "13", name: "Chest Fly", category: "chest", equipment: "cable" },
  { id: "14", name: "Lateral Raise", category: "shoulders", equipment: "dumbbell" },
  { id: "15", name: "Crunches", category: "core", equipment: "bodyweight" },
]

export function ExerciseSelector({ form }: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<any[]>(mockExercises)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [sets, setSets] = useState<number>(3)
  const [reps, setReps] = useState<number>(10)
  const [weight, setWeight] = useState<number>(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterEquipment, setFilterEquipment] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("search")
  const [customExercise, setCustomExercise] = useState({
    name: "",
    category: "other",
    equipment: "other",
  })

  const supabase = createClient()

  // Filter exercises based on search term and filters
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || exercise.category === filterCategory
    const matchesEquipment = filterEquipment === "all" || exercise.equipment === filterEquipment

    return matchesSearch && matchesCategory && matchesEquipment
  })

  const addExercise = () => {
    if (!selectedExercise) return

    const currentExercises = form.getValues("exercises") || []

    form.setValue("exercises", [
      ...currentExercises,
      {
        exercise_id: selectedExercise,
        sets,
        reps,
        weight,
      },
    ])

    // Reset form
    setSelectedExercise("")
    setSets(3)
    setReps(10)
    setWeight(0)
    setIsDialogOpen(false)
  }

  const addCustomExercise = () => {
    if (!customExercise.name) return

    // Generate a unique ID for the custom exercise
    const newId = `custom-${Date.now()}`

    // Add to exercises list
    const newExercise = {
      id: newId,
      name: customExercise.name,
      category: customExercise.category,
      equipment: customExercise.equipment,
    }

    setExercises((prev) => [...prev, newExercise])

    // Add to form
    const currentExercises = form.getValues("exercises") || []
    form.setValue("exercises", [
      ...currentExercises,
      {
        exercise_id: newId,
        sets,
        reps,
        weight,
      },
    ])

    // Reset form
    setCustomExercise({
      name: "",
      category: "other",
      equipment: "other",
    })
    setSets(3)
    setReps(10)
    setWeight(0)
    setIsDialogOpen(false)
  }

  const removeExercise = (index: number) => {
    const currentExercises = form.getValues("exercises") || []
    const updatedExercises = [...currentExercises]
    updatedExercises.splice(index, 1)
    form.setValue("exercises", updatedExercises)
  }

  const selectedExercises = form.watch("exercises") || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Exercises</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Exercise</DialogTitle>
              <DialogDescription>Search for an exercise or add your own</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search exercises..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="chest">Chest</SelectItem>
                      <SelectItem value="back">Back</SelectItem>
                      <SelectItem value="legs">Legs</SelectItem>
                      <SelectItem value="shoulders">Shoulders</SelectItem>
                      <SelectItem value="arms">Arms</SelectItem>
                      <SelectItem value="core">Core</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterEquipment} onValueChange={setFilterEquipment}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="barbell">Barbell</SelectItem>
                      <SelectItem value="dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="machine">Machine</SelectItem>
                      <SelectItem value="cable">Cable</SelectItem>
                      <SelectItem value="bodyweight">Bodyweight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="max-h-[200px] overflow-y-auto border rounded-md">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={`p-3 border-b cursor-pointer hover:bg-muted transition-colors ${selectedExercise === exercise.id ? "bg-primary/10" : ""}`}
                        onClick={() => setSelectedExercise(exercise.id)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{exercise.name}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700">
                              {exercise.category}
                            </Badge>
                            <Badge variant="outline" className="capitalize bg-purple-50 text-purple-700">
                              {exercise.equipment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No exercises found. Try a different search term or add a custom exercise.
                    </div>
                  )}
                </div>

                {selectedExercise && (
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="grid gap-2">
                      <Label>Sets</Label>
                      <Input
                        type="number"
                        min={1}
                        value={sets}
                        onChange={(e) => setSets(Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Reps</Label>
                      <Input
                        type="number"
                        min={1}
                        value={reps}
                        onChange={(e) => setReps(Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Weight (lbs)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={weight}
                        onChange={(e) => setWeight(Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 py-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Exercise Name</Label>
                    <Input
                      placeholder="e.g., Cable Twist"
                      value={customExercise.name}
                      onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={customExercise.category}
                        onValueChange={(value) => setCustomExercise({ ...customExercise, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chest">Chest</SelectItem>
                          <SelectItem value="back">Back</SelectItem>
                          <SelectItem value="legs">Legs</SelectItem>
                          <SelectItem value="shoulders">Shoulders</SelectItem>
                          <SelectItem value="arms">Arms</SelectItem>
                          <SelectItem value="core">Core</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Equipment</Label>
                      <Select
                        value={customExercise.equipment}
                        onValueChange={(value) => setCustomExercise({ ...customExercise, equipment: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="barbell">Barbell</SelectItem>
                          <SelectItem value="dumbbell">Dumbbell</SelectItem>
                          <SelectItem value="machine">Machine</SelectItem>
                          <SelectItem value="cable">Cable</SelectItem>
                          <SelectItem value="bodyweight">Bodyweight</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="grid gap-2">
                      <Label>Sets</Label>
                      <Input
                        type="number"
                        min={1}
                        value={sets}
                        onChange={(e) => setSets(Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Reps</Label>
                      <Input
                        type="number"
                        min={1}
                        value={reps}
                        onChange={(e) => setReps(Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Weight (lbs)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={weight}
                        onChange={(e) => setWeight(Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              {activeTab === "search" ? (
                <Button
                  onClick={addExercise}
                  disabled={!selectedExercise}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Add Exercise
                </Button>
              ) : (
                <Button
                  onClick={addCustomExercise}
                  disabled={!customExercise.name}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Add Custom Exercise
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {selectedExercises.length > 0 ? (
          <div className="space-y-2">
            {selectedExercises.map((exercise: any, index: number) => {
              const exerciseDetails = exercises.find((e) => e.id === exercise.exercise_id)

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{exerciseDetails?.name || "Exercise"}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                      >
                        {exercise.sets} sets
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
                      >
                        {exercise.reps} reps
                      </Badge>
                      {exercise.weight > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                        >
                          {exercise.weight} lbs
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No exercises added yet. Click the button above to add exercises to your workout.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium">{children}</div>
}

