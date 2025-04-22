import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame } from "lucide-react"

export function RecipeRecommendations() {
  const recipes = [
    {
      title: "Roasted Vegetable Medley",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2810%29.jfif-HYcjN0SWTtG2Z23ogymLfJCfc3HhXS.jpeg",
      time: "25 mins",
      calories: 320,
      tags: ["Vegetarian", "Low Carb"],
    },
    {
      title: "Chicken Protein Bowl",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2811%29.jfif-wrKuz5h47WgxCyFGNGxrpJKgxiOrYn.jpeg",
      time: "15 mins",
      calories: 420,
      tags: ["High Protein", "Gluten Free"],
    },
    {
      title: "Hearty Pasta Bolognese",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R.jfif-jcWFSI2yMggpDyqfh1xY2KES4FOFgE.jpeg",
      time: "35 mins",
      calories: 580,
      tags: ["High Protein", "Comfort Food"],
    },
    {
      title: "Veggie Mac & Cheese",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pouring-Nutritional-Yeast-Sauce-in-a-Mac-and-Cheese-with-Vegetables.jpg-stiAii5X5TE5QEqYmsPeqvPXIQooSR.jpeg",
      time: "30 mins",
      calories: 450,
      tags: ["Vegetarian", "Dairy"],
    },
    {
      title: "Stuffed Potato Cups",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recipe.jfif-vUYZcGzhHulgF9ofncVJ3F7OolzMTq.jpeg",
      time: "40 mins",
      calories: 380,
      tags: ["Family Friendly", "Meal Prep"],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Ideas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 overflow-x-auto pb-4">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="group min-w-[280px] max-w-[280px] snap-start">
                <div className="relative overflow-hidden rounded-lg border">
                  <div className="aspect-[2/1.5] overflow-hidden">
                    <Image
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      width={280}
                      height={200}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">{recipe.title}</h4>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        {recipe.calories} cal
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            View More Recipes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

