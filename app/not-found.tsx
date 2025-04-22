import Link from "next/link"
import { Search, Home, ArrowLeft, AlertTriangle, Dumbbell, Utensils, LineChart, LifeBuoy, BookOpen, Settings, Frown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DynamicBackground } from "@/components/workouts/dynamic-background"
import { Card, CardContent } from "@/components/ui/card"
import { DynamicTextSlider } from "@/components/ui/dynamic-text-slider"

export default function NotFound() {
  // Motivational quotes for the 404 page
  const notFoundQuotes = [
    "Sometimes you miss a rep. Let's get back on track.",
    "Even the best athletes take a wrong turn sometimes.",
    "Lost your way? Your fitness journey continues here.",
    "Page not found, but your determination is.",
    "Every setback is a setup for a comeback."
  ]

  return (
    <div className="relative min-h-screen bg-background">
      {/* Dynamic background */}
      <div className="absolute inset-0 z-0">
        <DynamicBackground overlay={true} interval={5000} />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center md:p-8">
        <Card className="mx-auto max-w-md bg-background/80 backdrop-blur-md border-primary/20">
          <CardContent className="p-8 flex flex-col items-center space-y-6">
            <div className="rounded-full bg-primary/10 p-6 border border-primary/20 animate-pulse">
              <Frown className="h-12 w-12 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-primary to-blue-600">404</h1>
              
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Page not found</h2>
            </div>
            
            <div className="h-20 overflow-hidden">
              <DynamicTextSlider 
                messages={notFoundQuotes} 
                interval={4000}
                controls={false}
                textClassName="text-muted-foreground"
              />
            </div>
            
            <div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row w-full">
              <Button asChild variant="default" className="gap-2 w-full" size="lg">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="gap-2 w-full" size="lg">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="relative mt-6 w-full max-w-md">
              <div className="flex w-full items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search for workouts, nutrition tips..."
                    className="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </div>
            
            <div className="w-full pt-6 border-t border-border">
              <h3 className="text-sm font-medium mb-3">Popular Destinations</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Link
                  href="/workouts"
                  className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-primary/10"
                >
                  <Dumbbell className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">Workouts</span>
                </Link>
                <Link
                  href="/nutrition"
                  className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-primary/10"
                >
                  <Utensils className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">Nutrition</span>
                </Link>
                <Link
                  href="/progress"
                  className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-primary/10"
                >
                  <LineChart className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">Progress</span>
                </Link>
                <Link
                  href="/support"
                  className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-primary/10"
                >
                  <LifeBuoy className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">Support</span>
                </Link>
                <Link
                  href="/achievements"
                  className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-primary/10"
                >
                  <BookOpen className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">Achievements</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-primary/10"
                >
                  <Settings className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 