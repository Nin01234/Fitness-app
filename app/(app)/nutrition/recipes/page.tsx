import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Filter, Flame, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Recipes - FitLife",
  description: "Discover healthy recipes for your fitness journey",
}

export default async function RecipesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const recipes = [
    {
      id: 1,
      title: "Roasted Vegetable Medley",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2810%29.jfif-HYcjN0SWTtG2Z23ogymLfJCfc3HhXS.jpeg",
      time: "25 mins",
      calories: 320,
      category: "lunch",
      tags: ["Vegetarian", "Low Carb"],
    },
    {
      id: 2,
      title: "Protein-Packed Chicken Bowl",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2811%29.jfif-wrKuz5h47WgxCyFGNGxrpJKgxiOrYn.jpeg",
      time: "15 mins",
      calories: 420,
      category: "lunch",
      tags: ["High Protein", "Gluten Free"],
    },
    {
      id: 3,
      title: "Hearty Pasta Bolognese",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R.jfif-jcWFSI2yMggpDyqfh1xY2KES4FOFgE.jpeg",
      time: "35 mins",
      calories: 580,
      category: "dinner",
      tags: ["High Protein", "Comfort Food"],
    },
    {
      id: 4,
      title: "Veggie Mac & Cheese",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pouring-Nutritional-Yeast-Sauce-in-a-Mac-and-Cheese-with-Vegetables.jpg-stiAii5X5TE5QEqYmsPeqvPXIQooSR.jpeg",
      time: "30 mins",
      calories: 450,
      category: "dinner",
      tags: ["Vegetarian", "Dairy"],
    },
    {
      id: 5,
      title: "Stuffed Potato Cups",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recipe.jfif-vUYZcGzhHulgF9ofncVJ3F7OolzMTq.jpeg",
      time: "40 mins",
      calories: 380,
      category: "dinner",
      tags: ["Family Friendly", "Meal Prep"],
    },
    {
      id: 6,
      title: "Breakfast Delight Platter",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R%20%281%29.jfif-AM45Fp1OVz3bcSrgf4H7AKDQAu4Jgw.jpeg",
      time: "20 mins",
      calories: 550,
      category: "breakfast",
      tags: ["High Protein", "Balanced"],
    },
    {
      id: 7,
      title: "Breakfast Favorites",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OIP%20%2812%29.jfif-hgtYsdi4Q6wJNFPmst71fXCMHhTIRS.jpeg",
      time: "25 mins",
      calories: 520,
      category: "breakfast",
      tags: ["Classic", "Weekend"],
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Recipe Collection"
        text="Discover nutritious and delicious recipes to fuel your fitness journey"
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search recipes..." className="pl-8" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/nutrition/recipes/${recipe.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-md">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{recipe.title}</h3>
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
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breakfast" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes
              .filter((r) => r.category === "breakfast")
              .map((recipe) => (
                <Link key={recipe.id} href={`/nutrition/recipes/${recipe.id}`} className="group">
                  <Card className="overflow-hidden hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={recipe.image || "/placeholder.svg"}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{recipe.title}</h3>
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
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        {/* Similar content for other tabs */}
        <TabsContent value="lunch" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes
              .filter((r) => r.category === "lunch")
              .map((recipe) => (
                <Link key={recipe.id} href={`/nutrition/recipes/${recipe.id}`} className="group">
                  <Card className="overflow-hidden hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={recipe.image || "/placeholder.svg"}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{recipe.title}</h3>
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
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="dinner" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes
              .filter((r) => r.category === "dinner")
              .map((recipe) => (
                <Link key={recipe.id} href={`/nutrition/recipes/${recipe.id}`} className="group">
                  <Card className="overflow-hidden hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={recipe.image || "/placeholder.svg"}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{recipe.title}</h3>
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
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="snacks" className="space-y-6">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No snack recipes available yet.</p>
            <Button variant="outline" className="mt-4">
              Request Snack Recipes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

