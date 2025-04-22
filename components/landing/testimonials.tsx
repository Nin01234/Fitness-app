import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Suspense } from "react"

// This is a fallback component that shows while data is loading
function TestimonialsSkeleton() {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-3">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-muted text-muted-foreground"
                />
              ))}
            </div>
            <div className="mt-4 h-24 animate-pulse rounded bg-muted"></div>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                <div className="mt-2 h-3 w-16 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Component to fetch and display testimonials
function TestimonialsContent() {
  // If there's an error or no data, use fallback data
  const fallbackTestimonials = [
    {
      name: "Alex Johnson",
      role: "Fitness Enthusiast",
      content:
        "FitLife has completely transformed my fitness journey. The workout tracking and nutrition monitoring features have helped me stay consistent and see real results.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Sarah Williams",
      role: "Marathon Runner",
      content:
        "As a marathon runner, tracking my progress is crucial. FitLife provides all the tools I need to monitor my training, nutrition, and recovery in one place.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Personal Trainer",
      content:
        "I recommend FitLife to all my clients. The comprehensive tracking features and user-friendly interface make it easy for anyone to stay on top of their fitness goals.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
    },
  ]
  
  // Use fallback data for now (client-side data fetching will be implemented properly later)
  const displayTestimonials = fallbackTestimonials

  return (
    <div className="mt-16 grid gap-8 md:grid-cols-3">
      {displayTestimonials.map((testimonial, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <blockquote className="mt-4">
              <p className="text-muted-foreground">"{testimonial.content}"</p>
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <Image
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Main export component
export function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Join thousands of satisfied users who have transformed their fitness journey with FitLife.
          </p>
        </div>
        <Suspense fallback={<TestimonialsSkeleton />}>
          <TestimonialsContent />
        </Suspense>
      </div>
    </section>
  )
}

