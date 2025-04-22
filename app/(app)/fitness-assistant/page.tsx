import { Metadata } from "next"
import { AIAssistant } from "@/components/ai-assistant"
import { Badge } from "@/components/ui/badge"
import { HeartPulse, Brain, Dumbbell, Calculator } from "lucide-react"

export const metadata: Metadata = {
  title: "FitLife AI Assistant",
  description: "Get personalized fitness advice, calculate your metrics, and receive workout recommendations",
}

export default function FitnessAssistantPage() {
  return (
    <div className="container py-6 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <HeartPulse className="mr-2 h-8 w-8 text-primary" />
            FitLife AI Assistant
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm bg-primary/10 font-medium">
              <Brain className="mr-1 h-3 w-3" />
              Personalized Advice
            </Badge>
            <Badge variant="outline" className="text-sm bg-primary/10 font-medium">
              <Calculator className="mr-1 h-3 w-3" />
              Advanced Calculators
            </Badge>
            <Badge variant="outline" className="text-sm bg-primary/10 font-medium">
              <Dumbbell className="mr-1 h-3 w-3" />
              Custom Plans
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">
          Your personal AI fitness coach that helps you achieve your health and fitness goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AIAssistant />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 border rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <h2 className="text-xl font-semibold mb-4">How to Use Your Assistant</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary font-semibold">1</span>
                  <span>Ask questions about workouts, nutrition, or tracking</span>
                </li>
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary font-semibold">2</span>
                  <span>Use the calculator to determine your BMI, calorie needs, and more</span>
                </li>
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary font-semibold">3</span>
                  <span>Get personalized workout and nutrition recommendations</span>
                </li>
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary font-semibold">4</span>
                  <span>Track progress by regularly calculating your metrics</span>
                </li>
                <li className="flex gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary font-semibold">5</span>
                  <span>Enable voice features for hands-free assistance</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-3">New Features</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  <span>Dynamic styling with changing themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  <span>Enhanced voice recognition and response</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  <span>Comprehensive fitness calculators</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  <span>Mobile-responsive design</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  <span>Expanded AI knowledge on fitness topics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 