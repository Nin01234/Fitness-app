"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, ChevronRight, Dumbbell, Heart, Clock, Zap, Droplets } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface WorkoutTip {
  title: string
  description: string
  icon: React.ReactNode
  category: "form" | "recovery" | "nutrition" | "technique" | "general"
  expanded?: boolean
}

export function EnhancedWorkoutTips() {
  const [expandedTips, setExpandedTips] = useState<string[]>([])

  const toggleTip = (tipTitle: string) => {
    setExpandedTips((prev) =>
      prev.includes(tipTitle) ? prev.filter((title) => title !== tipTitle) : [...prev, tipTitle],
    )
  }

  const tips: WorkoutTip[] = [
    {
      title: "Proper Form",
      description:
        "Focus on maintaining proper form throughout each exercise. Quality over quantity! Poor form can lead to injuries and reduced effectiveness.",
      icon: <Dumbbell className="h-4 w-4 text-blue-500" />,
      category: "form",
    },
    {
      title: "Breathing Technique",
      description:
        "Remember to breathe steadily. Exhale during exertion (the hard part), inhale during the easier phase. Never hold your breath during lifting.",
      icon: <Heart className="h-4 w-4 text-red-500" />,
      category: "technique",
    },
    {
      title: "Progressive Overload",
      description:
        "Gradually increase weight, frequency, or reps as you get stronger. This is the key principle for continued improvement and muscle growth.",
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      category: "technique",
    },
    {
      title: "Rest Periods",
      description:
        "Allow adequate rest between sets (30-90 seconds) based on your goals. Shorter rest for endurance, longer rest for strength and power.",
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      category: "recovery",
    },
    {
      title: "Hydration",
      description:
        "Drink water before, during, and after your workout. Even mild dehydration can significantly impact performance and recovery.",
      icon: <Droplets className="h-4 w-4 text-blue-500" />,
      category: "nutrition",
    },
    {
      title: "Warm-Up Properly",
      description:
        "Always spend 5-10 minutes warming up with light cardio and dynamic stretches specific to your workout. Cold muscles are more prone to injury.",
      icon: <Heart className="h-4 w-4 text-red-500" />,
      category: "general",
    },
    {
      title: "Mind-Muscle Connection",
      description:
        "Focus on the muscle you're working. Visualize it contracting and stretching with each rep for better engagement and results.",
      icon: <Dumbbell className="h-4 w-4 text-blue-500" />,
      category: "technique",
    },
    {
      title: "Post-Workout Nutrition",
      description:
        "Consume protein and carbs within 30-60 minutes after your workout to optimize recovery and muscle protein synthesis.",
      icon: <Zap className="h-4 w-4 text-green-500" />,
      category: "nutrition",
    },
    {
      title: "Rest Days",
      description:
        "Schedule 1-2 rest days per week. Muscles grow during recovery, not during the workout itself. Active recovery like walking or yoga can be beneficial.",
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      category: "recovery",
    },
    {
      title: "Track Your Progress",
      description:
        "Keep a workout journal or use the app to track weights, reps, and sets. This helps ensure progressive overload and keeps you motivated.",
      icon: <Dumbbell className="h-4 w-4 text-blue-500" />,
      category: "general",
    },
  ]

  const categorizedTips = tips.reduce(
    (acc, tip) => {
      if (!acc[tip.category]) {
        acc[tip.category] = []
      }
      acc[tip.category].push(tip)
      return acc
    },
    {} as Record<string, WorkoutTip[]>,
  )

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Exercise Safety</AlertTitle>
        <AlertDescription>
          Always warm up properly and listen to your body. Stop if you experience pain and consult a professional if
          needed.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="technique">Technique</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Accordion type="multiple" className="w-full">
            {tips.map((tip, index) => (
              <AccordionItem key={index} value={tip.title}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    {tip.icon}
                    <span>{tip.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {Object.entries(categorizedTips).map(([category, categoryTips]) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {categoryTips.map((tip, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      {tip.icon}
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Quick Tips for Today's Workout</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm">
            <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span>Start with compound movements (squats, deadlifts, bench press) before isolation exercises.</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span>
              For muscle growth, aim for 8-12 reps per set with moderate weight. For strength, 4-6 reps with heavier
              weight.
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span>
              Don't forget to stretch after your workout when muscles are warm to improve flexibility and reduce
              soreness.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

