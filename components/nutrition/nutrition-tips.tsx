import { Apple, Brain, Heart, Zap, Droplets, Leaf, Beef, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NutritionTips() {
  const tips = [
    {
      icon: <Heart className="h-5 w-5 text-red-500" />,
      title: "Heart Health",
      description: "Include omega-3 rich foods like fish, nuts, and seeds in your diet.",
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "Brain Power",
      description: "Boost cognitive function with berries, leafy greens, and healthy fats.",
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "Energy Boost",
      description: "Complex carbs provide sustained energy throughout the day.",
    },
    {
      icon: <Apple className="h-5 w-5 text-green-500" />,
      title: "Nutrient Timing",
      description: "Eat protein within 30 minutes after workouts for better recovery.",
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      title: "Hydration",
      description: "Drink water before, during, and after meals to aid digestion.",
    },
    {
      icon: <Leaf className="h-5 w-5 text-emerald-500" />,
      title: "Plant Power",
      description: "Aim for at least 5 different colored vegetables daily for diverse nutrients.",
    },
    {
      icon: <Beef className="h-5 w-5 text-rose-500" />,
      title: "Protein Balance",
      description: "Combine plant and animal proteins for a complete amino acid profile.",
    },
    {
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      title: "Meal Timing",
      description: "Eat smaller meals every 3-4 hours to maintain stable blood sugar levels.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="rounded-full bg-background p-2 shadow-sm">{tip.icon}</div>
            <div>
              <h4 className="font-medium">{tip.title}</h4>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

