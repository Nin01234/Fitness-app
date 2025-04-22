import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"

// Loading skeleton component
function PricingSkeleton() {
  return (
    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="flex flex-col">
          <div className="p-6">
            <div className="h-7 w-1/3 animate-pulse rounded bg-muted mb-2"></div>
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted"></div>
            <div className="mt-4">
              <div className="h-10 w-1/3 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Component to fetch and display pricing plans
async function PricingContent() {
  const supabase = await createClient()
  
  // Fetch pricing plans from Supabase
  const { data: plans, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('price')
  
  // Fallback data if no plans are found
  const fallbackPlans = [
    {
      name: "Free",
      description: "Basic features for personal use",
      price: "$0",
      duration: "forever",
      features: [
        "Basic workout tracking",
        "Simple nutrition logging",
        "Weight tracking",
        "Limited progress charts",
        "3 workout templates",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced features for fitness enthusiasts",
      price: "$9.99",
      duration: "per month",
      features: [
        "Advanced workout tracking",
        "Comprehensive nutrition analysis",
        "Body composition tracking",
        "Advanced progress visualization",
        "Unlimited workout templates",
        "Custom meal plans",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      description: "For trainers and fitness groups",
      price: "$19.99",
      duration: "per month",
      features: [
        "All Pro features",
        "Team management",
        "Client progress tracking",
        "Workout assignment",
        "Nutrition plan creation",
        "Team challenges",
        "API access",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]
  
  // Use fetched data if available, otherwise use fallback
  const displayPlans = plans && plans.length > 0 ? plans : fallbackPlans

  return (
    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {displayPlans.map((plan, index) => (
        <Card key={index} className={`flex flex-col ${plan.popular ? "border-primary shadow-md" : ""}`}>
          {plan.popular && (
            <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Popular
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground"> / {plan.duration}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {Array.isArray(plan.features) ? plan.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              )) : null}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
              <Link href="/signup">{plan.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Main export component
export function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Choose the plan that fits your fitness journey
        </p>
      </div>
      <Suspense fallback={<PricingSkeleton />}>
        <PricingContent />
      </Suspense>
    </section>
  )
}

