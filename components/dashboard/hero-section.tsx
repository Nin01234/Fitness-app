import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 p-8 text-white shadow-lg md:p-12">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard.jpg-7oGUbb7vwZ6UMWfLkHnzh80W9qYUJN.jpeg"
          alt="Fitness class background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-10">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Welcome Back!</h1>
              <p className="text-lg text-white/90 md:text-xl">
                Ready for another great workout? You're making amazing progress!
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary">
                Start Workout
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                View Progress
              </Button>
            </div>
          </div>
          <Card className="bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="mb-2 font-semibold text-white">Today's Motivation</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-300" />
                <p className="text-sm">You've worked out 3 days in a row! Keep the streak going!</p>
              </div>
              <p className="text-sm text-white/80">
                "The only bad workout is the one that didn't happen. Every effort counts towards your goals!"
              </p>
              <div className="mt-4 rounded-lg bg-white/20 p-4">
                <h4 className="mb-2 font-medium">Quick Tip</h4>
                <p className="text-sm">
                  Remember to stay hydrated! Aim to drink water before, during, and after your workout for optimal
                  performance.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

