import {
  Check,
  X,
  Zap,
  Award,
  BarChart,
  Calendar,
  Clock,
  Gift,
  Heart,
  TrendingUp,
  Dumbbell,
  Utensils
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PricingCardsProps {
  onSubscribe: () => void
}

export function PricingCards({ onSubscribe }: PricingCardsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Free
            <span className="text-base font-normal text-muted-foreground">$0</span>
          </CardTitle>
          <CardDescription>Basic features for casual fitness enthusiasts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Track basic workouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Simple nutrition tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Basic progress tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Limited workout library</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">AI workout recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Custom meal planning</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Priority support</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-primary/50 bg-primary/5 dark:bg-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0">
          <div className="h-20 w-20 bg-primary/20 -mr-5 -mt-5 rotate-12"></div>
        </div>
        <div className="absolute -top-2 left-0 right-0 mx-auto w-max">
          <div className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full font-semibold">
            MOST POPULAR
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Premium Monthly
            <span className="text-base font-normal">$9.99<span className="text-xs text-muted-foreground">/month</span></span>
          </CardTitle>
          <CardDescription>All premium features with monthly billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium">Everything in Free, plus:</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Advanced workout analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>AI workout recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Custom meal planning</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Unlimited progress tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Ad-free experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Early access to new features</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button size="lg" className="w-full" onClick={onSubscribe}>
            <Zap className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Cancel anytime. No long-term commitment.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Premium Annual
            <span className="text-base font-normal text-muted-foreground">
              <span className="line-through mr-2">$119.88</span>
              $79.99<span className="text-xs">/year</span>
            </span>
          </CardTitle>
          <CardDescription>Save 34% with annual billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-medium">All Premium Monthly benefits</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">SAVE 34% ($39.89)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Free premium template library</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Quarterly fitness assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Premium challenge rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Partner discounts</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={onSubscribe}>
            Get Annual Plan
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Just $6.67/month, billed annually.
          </p>
        </CardFooter>
      </Card>
      
      <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
        <div className="md:col-span-2 text-center mb-2">
          <h3 className="text-lg font-semibold">Why Choose Premium?</h3>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <BarChart className="h-12 w-12 text-primary mb-2" />
          <h4 className="font-medium">Advanced Analytics</h4>
          <p className="text-sm text-muted-foreground mt-1">Detailed insights into your fitness progress</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Dumbbell className="h-12 w-12 text-primary mb-2" />
          <h4 className="font-medium">Custom Workout Plans</h4>
          <p className="text-sm text-muted-foreground mt-1">Personalized routines for your goals</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Utensils className="h-12 w-12 text-primary mb-2" />
          <h4 className="font-medium">Nutrition Planning</h4>
          <p className="text-sm text-muted-foreground mt-1">Optimized meal plans for your fitness goals</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Calendar className="h-12 w-12 text-primary mb-2" />
          <h4 className="font-medium">Priority Support</h4>
          <p className="text-sm text-muted-foreground mt-1">Get help when you need it most</p>
        </div>
      </div>
    </div>
  )
} 