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
import { Beef, Plus, Minus, Clock, Save, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

const proteinCategories = [
  {
    name: "Animal Proteins",
    items: [
      { id: "chicken", name: "Chicken Breast", servingSize: "100g", protein: 31 },
      { id: "beef", name: "Lean Beef", servingSize: "100g", protein: 26 },
      { id: "turkey", name: "Turkey", servingSize: "100g", protein: 29 },
      { id: "fish", name: "Fish (Salmon)", servingSize: "100g", protein: 25 },
      { id: "eggs", name: "Eggs", servingSize: "2 large", protein: 12 },
    ],
  },
  {
    name: "Dairy",
    items: [
      { id: "greek-yogurt", name: "Greek Yogurt", servingSize: "1 cup", protein: 23 },
      { id: "cottage-cheese", name: "Cottage Cheese", servingSize: "1 cup", protein: 28 },
      { id: "milk", name: "Milk", servingSize: "1 cup", protein: 8 },
      { id: "cheese", name: "Cheese", servingSize: "30g", protein: 7 },
      { id: "whey-protein", name: "Whey Protein", servingSize: "1 scoop", protein: 24 },
    ],
  },
  {
    name: "Plant Proteins",
    items: [
      { id: "tofu", name: "Tofu", servingSize: "100g", protein: 8 },
      { id: "tempeh", name: "Tempeh", servingSize: "100g", protein: 19 },
      { id: "seitan", name: "Seitan", servingSize: "100g", protein: 25 },
      { id: "edamame", name: "Edamame", servingSize: "1 cup", protein: 17 },
      { id: "lentils", name: "Lentils", servingSize: "1 cup cooked", protein: 18 },
    ],
  },
  {
    name: "Legumes & Nuts",
    items: [
      { id: "black-beans", name: "Black Beans", servingSize: "1 cup cooked", protein: 15 },
      { id: "chickpeas", name: "Chickpeas", servingSize: "1 cup cooked", protein: 15 },
      { id: "peanut-butter", name: "Peanut Butter", servingSize: "2 tbsp", protein: 8 },
      { id: "almonds", name: "Almonds", servingSize: "1/4 cup", protein: 7 },
      { id: "quinoa", name: "Quinoa", servingSize: "1 cup cooked", protein: 8 },
    ],
  },
  {
    name: "Supplements",
    items: [
      { id: "protein-shake", name: "Protein Shake", servingSize: "1 serving", protein: 25 },
      { id: "protein-bar", name: "Protein Bar", servingSize: "1 bar", protein: 20 },
      { id: "bcaa", name: "BCAA Supplement", servingSize: "1 serving", protein: 5 },
      { id: "collagen", name: "Collagen Peptides", servingSize: "1 scoop", protein: 18 },
      { id: "plant-protein", name: "Plant Protein Powder", servingSize: "1 scoop", protein: 20 },
    ],
  },
]

export function TrackProteinSources() {
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
      const item = proteinCategories.flatMap((c) => c.items).find((i) => i.id === id)
      return item?.name || id
    })

    toast({
      title: "Protein sources tracked",
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
    ? proteinCategories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((category) => category.items.length > 0)
    : proteinCategories

  // Calculate total protein
  const totalProtein = selectedItems.reduce((total, id) => {
    const item = proteinCategories.flatMap((c) => c.items).find((i) => i.id === id)
    return total + (item ? item.protein * servings : 0)
  }, 0)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          data-action="track-protein"
        >
          <Beef className="mr-2 h-4 w-4" /> Track Protein Sources
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Track Protein Intake</DialogTitle>
          <DialogDescription>Record your protein consumption from various sources</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search protein sources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="animal">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="animal">Animal</TabsTrigger>
              <TabsTrigger value="dairy">Dairy</TabsTrigger>
              <TabsTrigger value="plant">Plant</TabsTrigger>
              <TabsTrigger value="legumes">Legumes</TabsTrigger>
              <TabsTrigger value="supplements">Supplements</TabsTrigger>
            </TabsList>

            {filteredCategories.map((category, index) => (
              <TabsContent key={index} value={category.name.toLowerCase().split(" ")[0]}>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                        selectedItems.includes(item.id) ? "border-red-500 bg-red-50 dark:bg-red-950" : ""
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
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.servingSize}</span>
                          <span className="font-medium">{item.protein}g protein</span>
                        </div>
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

          {selectedItems.length > 0 && (
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Protein:</span>
                <span className="text-xl font-bold">{Math.round(totalProtein)}g</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {selectedItems.length} item(s) selected with {servings} serving(s) each
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedItems.length === 0}
            className="bg-red-600 hover:bg-red-700"
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

