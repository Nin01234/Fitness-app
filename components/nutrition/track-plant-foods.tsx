"use client"

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
import { Slider } from "@/components/ui/slider"
import { Leaf, Plus, Minus, Clock, Save, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

const vegetableCategories = [
  {
    name: "Leafy Greens",
    items: [
      { id: "spinach", name: "Spinach", servingSize: "1 cup" },
      { id: "kale", name: "Kale", servingSize: "1 cup" },
      { id: "lettuce", name: "Lettuce", servingSize: "2 cups" },
      { id: "arugula", name: "Arugula", servingSize: "2 cups" },
      { id: "swiss-chard", name: "Swiss Chard", servingSize: "1 cup" },
    ],
  },
  {
    name: "Cruciferous",
    items: [
      { id: "broccoli", name: "Broccoli", servingSize: "1 cup" },
      { id: "cauliflower", name: "Cauliflower", servingSize: "1 cup" },
      { id: "brussels", name: "Brussels Sprouts", servingSize: "1 cup" },
      { id: "cabbage", name: "Cabbage", servingSize: "1 cup" },
      { id: "bok-choy", name: "Bok Choy", servingSize: "1 cup" },
    ],
  },
  {
    name: "Root Vegetables",
    items: [
      { id: "carrots", name: "Carrots", servingSize: "1 cup" },
      { id: "beets", name: "Beets", servingSize: "1 cup" },
      { id: "sweet-potato", name: "Sweet Potato", servingSize: "1 medium" },
      { id: "radish", name: "Radish", servingSize: "10 small" },
      { id: "turnip", name: "Turnip", servingSize: "1 cup" },
    ],
  },
  {
    name: "Other Vegetables",
    items: [
      { id: "bell-pepper", name: "Bell Pepper", servingSize: "1 medium" },
      { id: "cucumber", name: "Cucumber", servingSize: "1 cup" },
      { id: "tomato", name: "Tomato", servingSize: "1 medium" },
      { id: "zucchini", name: "Zucchini", servingSize: "1 cup" },
      { id: "mushrooms", name: "Mushrooms", servingSize: "1 cup" },
    ],
  },
  {
    name: "Fruits",
    items: [
      { id: "apple", name: "Apple", servingSize: "1 medium" },
      { id: "banana", name: "Banana", servingSize: "1 medium" },
      { id: "berries", name: "Berries", servingSize: "1 cup" },
      { id: "orange", name: "Orange", servingSize: "1 medium" },
      { id: "avocado", name: "Avocado", servingSize: "1/2 medium" },
    ],
  },
]

export function TrackPlantFoods() {
  const [isOpen, setIsOpen] = useState(false)
  const [servings, setServings] = useState(1)
  const [time, setTime] = useState(getCurrentTime())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  function getCurrentTime() {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const itemNames = selectedItems.map((id) => {
      const item = vegetableCategories.flatMap((c) => c.items).find((i) => i.id === id)
      return item?.name || id
    })

    toast({
      title: "Plant foods tracked",
      description: `Added ${servings} serving(s) of ${itemNames.join(", ")} at ${time}`,
    })

    setIsSubmitting(false)
    setIsOpen(false)
  }

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const filteredCategories = searchQuery
    ? vegetableCategories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((category) => category.items.length > 0)
    : vegetableCategories

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          data-action="track-plant"
        >
          <Leaf className="mr-2 h-4 w-4" /> Track Plant Foods
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Track Plant Food Intake</DialogTitle>
          <DialogDescription>Record your vegetable and fruit consumption</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vegetables and fruits..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="leafy">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="leafy">Leafy</TabsTrigger>
              <TabsTrigger value="cruciferous">Cruciferous</TabsTrigger>
              <TabsTrigger value="root">Root</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
              <TabsTrigger value="fruits">Fruits</TabsTrigger>
            </TabsList>

            {filteredCategories.map((category, index) => (
              <TabsContent key={index} value={category.name.toLowerCase().split(" ")[0]}>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                        selectedItems.includes(item.id) ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <Checkbox
                        id={item.id}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={item.id} className="cursor-pointer">
                          {item.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{item.servingSize}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="space-y-2">
            <Label>Number of Servings</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setServings(Math.max(0.5, servings - 0.5))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Slider
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={[servings]}
                  onValueChange={(vals) => setServings(vals[0])}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setServings(Math.min(5, servings + 0.5))}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="w-16 text-center font-medium">{servings}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Time
            </Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedItems.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

