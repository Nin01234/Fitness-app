import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Flame, Heart, ChevronLeft, Bookmark, Share2, Printer } from "lucide-react"

interface RecipePageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: RecipePageProps): Metadata {
  return {
    title: `Recipe - FitLife`,
    description: "View detailed recipe information",
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
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
      description:
        "A colorful mix of roasted seasonal vegetables seasoned with herbs and spices. This dish is perfect as a side or a light main course.",
      ingredients: [
        "2 cups baby potatoes, halved",
        "1 red bell pepper, sliced",
        "1 yellow bell pepper, sliced",
        "1 zucchini, sliced",
        "1 red onion, chunked",
        "2 tbsp olive oil",
        "1 tsp dried rosemary",
        "1 tsp dried thyme",
        "Salt and pepper to taste",
        "Fresh herbs for garnish",
      ],
      instructions: [
        "Preheat oven to 425°F (220°C).",
        "In a large bowl, toss all vegetables with olive oil, rosemary, thyme, salt, and pepper.",
        "Spread vegetables in a single layer on a baking sheet.",
        "Roast for 20-25 minutes, stirring halfway through, until vegetables are tender and lightly browned.",
        "Garnish with fresh herbs before serving.",
      ],
      nutrition: {
        protein: "6g",
        carbs: "38g",
        fat: "14g",
        fiber: "6g",
        servings: 4,
      },
      rating: 4.7,
      reviews: 24,
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
      description:
        "A nutritious bowl with lean chicken, fresh vegetables, and a creamy sauce. Perfect for post-workout recovery.",
      ingredients: [
        "8 oz grilled chicken breast, diced",
        "1 cup mixed vegetables (carrots, zucchini, cherry tomatoes)",
        "1/2 cup quinoa, cooked",
        "1/4 avocado, sliced",
        "2 tbsp Greek yogurt",
        "1 tbsp lemon juice",
        "1 tsp tahini",
        "1 tsp honey",
        "Salt and pepper to taste",
        "Fresh herbs for garnish",
      ],
      instructions: [
        "Combine Greek yogurt, lemon juice, tahini, honey, salt, and pepper in a small bowl to make the sauce.",
        "Arrange cooked quinoa in a bowl.",
        "Top with grilled chicken and mixed vegetables.",
        "Add avocado slices.",
        "Drizzle with prepared sauce.",
        "Garnish with fresh herbs before serving.",
      ],
      nutrition: {
        protein: "35g",
        carbs: "32g",
        fat: "15g",
        fiber: "7g",
        servings: 1,
      },
      rating: 4.8,
      reviews: 42,
    },
    {
      id: 3,
      title: "Hearty Pasta Bolognese",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R.jfif-jcWFSI2yMggpDyqfh1xY2KES4FOFgE.jpeg",
      time: "35 mins",
      calories: 580,
      category: "dinner",
      tags: ["High Protein", "Comfort Food"],
      description:
        "A classic Italian pasta dish with rich meat sauce and melted cheese. Perfect for refueling after an intense workout session.",
      ingredients: [
        "8 oz fusilli pasta",
        "1 lb lean ground beef",
        "1 onion, diced",
        "2 cloves garlic, minced",
        "1 carrot, grated",
        "1 celery stalk, diced",
        "1 can (14 oz) crushed tomatoes",
        "2 tbsp tomato paste",
        "1 tsp dried oregano",
        "1 tsp dried basil",
        "1/2 cup grated parmesan cheese",
        "Salt and pepper to taste",
        "Fresh basil for garnish",
      ],
      instructions: [
        "Cook pasta according to package directions. Drain and set aside.",
        "In a large skillet, brown ground beef over medium heat.",
        "Add onion, garlic, carrot, and celery. Cook until vegetables are soft.",
        "Stir in crushed tomatoes, tomato paste, oregano, and basil.",
        "Simmer for 15-20 minutes, stirring occasionally.",
        "Season with salt and pepper to taste.",
        "Combine sauce with pasta and top with parmesan cheese and fresh basil.",
      ],
      nutrition: {
        protein: "42g",
        carbs: "56g",
        fat: "22g",
        fiber: "5g",
        servings: 4,
      },
      rating: 4.9,
      reviews: 56,
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
      description:
        "A healthier twist on classic mac and cheese with added vegetables and nutritional yeast for extra flavor and nutrients.",
      ingredients: [
        "8 oz whole grain macaroni",
        "2 cups mixed vegetables (broccoli, bell peppers, cherry tomatoes)",
        "2 tbsp butter",
        "2 tbsp flour",
        "2 cups milk",
        "2 cups shredded cheddar cheese",
        "1/4 cup nutritional yeast",
        "1 tsp mustard powder",
        "1/2 tsp garlic powder",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Cook macaroni according to package directions. Add broccoli during the last 3 minutes. Drain and set aside.",
        "In a large saucepan, melt butter over medium heat. Add flour and whisk for 1-2 minutes.",
        "Gradually add milk, whisking constantly until smooth.",
        "Cook until sauce thickens, about 5 minutes.",
        "Remove from heat and stir in cheese, nutritional yeast, mustard powder, and garlic powder.",
        "Combine sauce with pasta and vegetables.",
        "Season with salt and pepper to taste.",
      ],
      nutrition: {
        protein: "22g",
        carbs: "48g",
        fat: "20g",
        fiber: "8g",
        servings: 4,
      },
      rating: 4.6,
      reviews: 38,
    },
    {
      id: 5,
      title: "Stuffed Potato Cups",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recipe.jfif-vUYZcGzhHulgF9ofncVJ3F7OolzMTq.jpeg",
      time: "40 mins",
      calories: 380,
      category: "dinner",
      tags: ["Family Friendly", "Meal Prep"],
      description:
        "Savory mashed potato cups filled with seasoned ground meat and topped with cheese. Great for meal prep and family dinners.",
      ingredients: [
        "4 large potatoes, boiled and mashed",
        "1/2 lb ground turkey or beef",
        "1 onion, finely diced",
        "2 cloves garlic, minced",
        "1 cup mixed vegetables (peas, carrots, corn)",
        "1 tsp paprika",
        "1 tsp dried oregano",
        "2 tbsp chopped fresh parsley",
        "1 cup shredded cheese",
        "2 tbsp olive oil",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Preheat oven to 375°F (190°C).",
        "Mix mashed potatoes with 1 tbsp olive oil, salt, and pepper.",
        "In a skillet, heat remaining olive oil and cook ground meat until browned.",
        "Add onion and garlic, cook until softened.",
        "Stir in mixed vegetables, paprika, oregano, salt, and pepper. Cook for 5 minutes.",
        "Grease a muffin tin and press mashed potatoes into each cup, forming a well in the center.",
        "Fill each potato cup with the meat mixture.",
        "Top with shredded cheese.",
        "Bake for 20-25 minutes until golden and cheese is melted.",
        "Garnish with fresh parsley before serving.",
      ],
      nutrition: {
        protein: "18g",
        carbs: "40g",
        fat: "16g",
        fiber: "4g",
        servings: 6,
      },
      rating: 4.5,
      reviews: 29,
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
      description:
        "A complete breakfast with protein and fruits to start your day right. Features eggs, bacon, fruit salad, and a crepe.",
      ingredients: [
        "2 large eggs",
        "2 slices bacon",
        "2 slices whole grain toast",
        "1 cup mixed fruits (strawberries, blueberries, mango, kiwi)",
        "1 tbsp butter",
        "1/4 cup flour",
        "1/2 cup milk",
        "1 egg (for crepe)",
        "1 tbsp sugar",
        "1 tbsp fresh chives, chopped",
        "Salt and pepper to taste",
      ],
      instructions: [
        "For the crepe: Whisk together flour, milk, egg, and sugar. Let rest for 5 minutes.",
        "Heat a non-stick pan, pour thin layer of batter, cook until golden on both sides.",
        "Cook bacon until crispy. Set aside.",
        "In the same pan, fry eggs to your liking.",
        "Toast bread slices.",
        "Arrange eggs, bacon, and toast on one side of the plate.",
        "Place crepe and fruit salad on the other side.",
        "Garnish eggs with chives, salt, and pepper.",
      ],
      nutrition: {
        protein: "28g",
        carbs: "52g",
        fat: "29g",
        fiber: "6g",
        servings: 1,
      },
      rating: 4.9,
      reviews: 65,
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
      description:
        "Three classic breakfast options: avocado toast with egg, bacon & egg croissant, and fluffy pancakes with blueberries.",
      ingredients: [
        "2 slices whole grain bread",
        "1 ripe avocado",
        "2 eggs",
        "1 croissant",
        "2 slices bacon",
        "1 cup pancake mix",
        "3/4 cup milk",
        "1 tbsp vegetable oil",
        "1/2 cup fresh blueberries",
        "2 tbsp maple syrup",
        "1 tbsp chopped fresh herbs",
        "Salt and pepper to taste",
      ],
      instructions: [
        "For avocado toast: Toast bread, mash avocado and spread on toast. Top with a fried egg, salt, pepper, and herbs.",
        "For croissant: Cook bacon until crispy. Slice croissant, add cooked bacon and a fried egg.",
        "For pancakes: Mix pancake mix, milk, and oil. Cook on a hot griddle until bubbles form, then flip.",
        "Top pancakes with blueberries and maple syrup.",
        "Arrange all three breakfast items on a plate and serve.",
      ],
      nutrition: {
        protein: "24g",
        carbs: "58g",
        fat: "26g",
        fiber: "8g",
        servings: 1,
      },
      rating: 4.8,
      reviews: 48,
    },
  ]

  const recipe = recipes.find((r) => r.id === Number.parseInt(params.id))

  if (!recipe) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold">Recipe not found</h2>
          <p className="mt-2 text-muted-foreground">The recipe you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/nutrition/recipes">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Recipes
            </Link>
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/nutrition/recipes">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Recipes
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
            <p className="mt-2 text-muted-foreground">{recipe.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{recipe.calories} calories</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Heart key={i} className={`h-4 w-4 ${i < Math.floor(recipe.rating) ? "fill-current" : ""}`} />
                  ))}
                </div>
                <span className="text-sm">
                  {recipe.rating} ({recipe.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" priority />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nutrition (per serving)</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 rounded-lg bg-muted p-2 text-center">
                      <span className="text-sm text-muted-foreground">Calories</span>
                      <p className="text-lg font-medium">{recipe.calories}</p>
                    </div>
                    <div className="space-y-1 rounded-lg bg-muted p-2 text-center">
                      <span className="text-sm text-muted-foreground">Servings</span>
                      <p className="text-lg font-medium">{recipe.nutrition.servings}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Protein</span>
                      <p className="font-medium">{recipe.nutrition.protein}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Carbs</span>
                      <p className="font-medium">{recipe.nutrition.carbs}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Fat</span>
                      <p className="font-medium">{recipe.nutrition.fat}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Fiber</span>
                      <p className="font-medium">{recipe.nutrition.fiber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {index + 1}
                    </span>
                    <p>{instruction}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <Button className="w-full">Add to Meal Plan</Button>
                <Button variant="outline" className="w-full flex gap-2">
                  <Heart className="h-4 w-4" /> Favorite
                </Button>
                <Button variant="outline" className="w-full flex gap-2">
                  <Bookmark className="h-4 w-4" /> Save for Later
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 flex gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" className="flex-1 flex gap-2">
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Similar Recipes</h3>
              <div className="space-y-4">
                {recipes
                  .filter((r) => r.id !== recipe.id && r.category === recipe.category)
                  .slice(0, 3)
                  .map((similarRecipe) => (
                    <Link
                      key={similarRecipe.id}
                      href={`/nutrition/recipes/${similarRecipe.id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={similarRecipe.image || "/placeholder.svg"}
                            alt={similarRecipe.title}
                            fill
                            className="object-cover transition-all group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {similarRecipe.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {similarRecipe.time} • {similarRecipe.calories} cal
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

