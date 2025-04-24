"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { 
  CheckIcon, 
  ChevronRightIcon, 
  SparklesIcon, 
  BellIcon, 
  BarChart3Icon, 
  DumbbellIcon, 
  UtensilsIcon, 
  HeartIcon, 
  VideoIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  CalendarIcon,
  TimerIcon,
  FlameIcon,
  BoltIcon,
  MessageSquare,
  SendIcon,
  Zap,
  BrainCircuit,
  Bot
} from "lucide-react"
import { PricingCards } from "@/components/premium/pricing-cards"
import { PremiumFeatures } from "@/components/premium/premium-features"
import { PremiumFaq } from "@/components/premium/premium-faq"
import { PremiumTestimonials } from "@/components/premium/premium-testimonials"
import { PaymentForm } from "@/components/premium/payment-form"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ThirdPartyConnections } from "@/components/premium/third-party-connections"

// Secure image URLs that will definitely work
const SECURE_IMAGES = {
  analytics: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=800&auto=format&fit=crop",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", 
  weights: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
  nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
  hydration: "https://images.unsplash.com/photo-1606681129817-c5d8ec35927a?q=80&w=800&auto=format&fit=crop",
  workout: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop",
  training: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  user: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop",
}

export default function PremiumPage() {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [simulationMode, setSimulationMode] = useState(false)
  const [selectedTab, setSelectedTab] = useState("subscription")
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'ai', content: string}[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  
  // Dynamic data for simulation mode
  const [dynamicStats, setDynamicStats] = useState({
    caloriesBurned: Math.floor(Math.random() * 500) + 300,
    workoutTime: Math.floor(Math.random() * 30) + 45,
    workoutsCompleted: Math.floor(Math.random() * 5) + 3,
    progress: Math.floor(Math.random() * 30) + 65,
  })
  const supabase = createClient()

  // Update dynamic data periodically for simulation
  useEffect(() => {
    if (simulationMode) {
      const interval = setInterval(() => {
        setDynamicStats({
          caloriesBurned: Math.floor(Math.random() * 500) + 300,
          workoutTime: Math.floor(Math.random() * 30) + 45,
          workoutsCompleted: Math.floor(Math.random() * 5) + 3,
          progress: Math.floor(Math.random() * 30) + 65,
        })
      }, 10000) // Update every 10 seconds

      return () => clearInterval(interval)
    }
  }, [simulationMode])

  // Check if user already has premium status
  useEffect(() => {
    async function checkPremiumStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_premium, premium_plan, premium_since")
            .eq("id", user.id)
            .single()
          
          if (profile?.is_premium) {
            setIsPremium(true)
          }
        }
      } catch (error) {
        console.error("Error checking premium status:", error)
      }
    }
    
    // Check for simulated premium mode
    const simulated = localStorage.getItem('simulatedPremium') === 'true'
    if (simulated) {
      setIsPremium(true)
      setSimulationMode(true)
    } else {
      checkPremiumStatus()
    }
  }, [supabase])

  const handleSubscribe = async () => {
    setIsSubscribing(true)
  }

  const handleSimulatedSubscription = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing steps
    await simulateProcessingSteps()
    
    // Set premium status in local state (without saving to database)
    setIsPremium(true)
    setSimulationMode(true)
    setIsProcessing(false)
    
    // Show success message
    toast({
      title: "Simulated Premium Activated!",
      description: "You now have access to all premium features in simulation mode",
      duration: 5000,
    })
    
    // Save simulation mode in localStorage
    localStorage.setItem('simulatedPremium', 'true')
  }

  const handlePaymentSuccess = async (plan: string, paymentMethod: string) => {
    setIsProcessing(true)
    
    // Simulate payment processing steps
    await simulateProcessingSteps()
    
    try {
      // In a real app, this would be verified by a webhook from your payment provider
      // Here we're just updating the user's profile directly
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Update user profile with premium status
        const { error } = await supabase
          .from("profiles")
          .update({
            is_premium: true,
            premium_plan: plan,
            premium_since: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          
        if (error) {
          throw error
        }
        
        // Record subscription history
        await supabase
          .from("premium_subscription_history")
          .insert({
            user_id: user.id,
            action: 'subscribed',
            plan: plan,
            payment_method: paymentMethod,
            price: plan === 'annual' ? 89.99 : plan === 'quarterly' ? 24.99 : 9.99
          })
        
        // Set premium status in the UI
        setIsPremium(true)
        setIsProcessing(false)
        
        // Show success message
        toast({
          title: "Premium Subscription Activated!",
          description: "You now have access to all premium features",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error updating premium status:", error)
      setIsProcessing(false)
      
      toast({
        title: "Subscription Error",
        description: "There was a problem activating your subscription. Please contact support.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }
  
  const simulateProcessingSteps = async () => {
    const steps = [
      "Processing payment",
      "Verifying account",
      "Updating subscription",
      "Granting premium access",
      "Finalizing setup"
    ]
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i)
      // Add a delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 700))
    }
  }
  
  const cancelSubscription = () => {
    setIsSubscribing(false)
    setIsProcessing(false)
    setProcessingStep(0)
  }

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
  }

  // Handle feature card click
  const handleFeatureClick = useCallback((path: string) => {
    toast({
      title: "Navigating to feature",
      description: `Opening ${path} in simulation mode`,
      duration: 2000,
    })
  }, [])

  // Get formatted date for today
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  })

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!chatInput.trim()) return
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', content: chatInput }])
    setChatLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      // Generate contextual response based on input
      let aiResponse = ''
      const userQuery = chatInput.toLowerCase()
      
      if (userQuery.includes('workout') || userQuery.includes('exercise') || userQuery.includes('training')) {
        aiResponse = "Based on your fitness profile and goals, I recommend incorporating more compound movements like squats, deadlifts, and bench press into your routine. These exercises engage multiple muscle groups and can help you achieve balanced muscle development. Would you like a customized 4-week workout plan tailored to your specific goals?"
      } else if (userQuery.includes('diet') || userQuery.includes('nutrition') || userQuery.includes('meal') || userQuery.includes('eat')) {
        aiResponse = "Analyzing your recent nutrition logs, I notice your protein intake is slightly below the recommended range for your goals. Try adding more lean protein sources like chicken breast, Greek yogurt, or plant-based alternatives if you're vegetarian. I can create a personalized meal plan that targets your macronutrient needs while accommodating your food preferences."
      } else if (userQuery.includes('weight') || userQuery.includes('fat') || userQuery.includes('muscle')) {
        aiResponse = "Looking at your progress data, you've been making steady improvements in your body composition. Your current approach is working well, but we could optimize your results by adjusting your workout intensity and timing your nutrient intake more strategically around your training sessions. Would you like specific recommendations?"
      } else if (userQuery.includes('sleep') || userQuery.includes('recovery') || userQuery.includes('rest')) {
        aiResponse = "Quality recovery is crucial for fitness progress. Your sleep data shows an average of 6.5 hours per night, which is below the recommended 7-9 hours for optimal recovery. Consider implementing a consistent sleep schedule and a pre-bed routine to improve sleep quality. This could significantly enhance your workout performance and results."
      } else if (userQuery.includes('goal') || userQuery.includes('target') || userQuery.includes('aim')) {
        aiResponse = "Based on your current metrics and progress rate, you're on track to reach your primary fitness goal in approximately 8-10 weeks. To accelerate your progress, I recommend increasing workout frequency from 3 to 4 days per week and implementing strategic cardio sessions. Would you like me to adjust your training program accordingly?"
      } else if (userQuery.includes('premium') || userQuery.includes('subscription') || userQuery.includes('plan')) {
        aiResponse = "Your Premium subscription unlocks all FitLife Pro features, including personalized AI coaching, advanced analytics, custom meal and workout planning, and priority support. You currently have full access to all premium features. Is there a specific premium feature you'd like to learn more about?"
      } else if (userQuery.includes('supplement') || userQuery.includes('protein') || userQuery.includes('creatine')) {
        aiResponse = "Based on your current training program and goals, I would recommend considering whey protein for post-workout recovery and creatine monohydrate for improved strength performance. However, supplements should complement a solid nutrition foundation, not replace it. Always consult with a healthcare professional before starting any new supplement regimen."
      } else {
        aiResponse = "I'm your AI Fitness Assistant powered by advanced machine learning. I can help analyze your workout data, create personalized training plans, optimize your nutrition strategy, track your progress, and provide evidence-based recommendations to help you reach your fitness goals faster. What specific fitness guidance are you looking for today?"
      }
      
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }])
      setChatLoading(false)
      setChatInput('')
    }, 1500)
  }

  return (
    <div className="container relative py-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-muted-foreground">
            Take your fitness journey to the next level with premium features
          </p>
        </div>
        
        {isPremium ? (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-8 rounded-lg border border-green-200 dark:border-green-800 text-center mb-6">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
                <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Premium Access Granted!</h2>
              <p className="text-muted-foreground mb-6">
                {simulationMode 
                  ? "You're in simulation mode with access to all premium features."
                  : "Thank you for subscribing. You now have full access to all premium features."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild onClick={() => handleFeatureClick('/premium/analytics')}>
                  <Link href="/premium/analytics">
                    <BarChart3Icon className="h-5 w-5 mr-2" /> Premium Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" onClick={() => handleFeatureClick('/premium/workouts')}>
                  <Link href="/premium/workouts">
                    <DumbbellIcon className="h-5 w-5 mr-2" /> Premium Workouts
                  </Link>
                </Button>
                <Button asChild variant="outline" onClick={() => handleFeatureClick('/premium/nutrition')}>
                  <Link href="/premium/nutrition">
                    <UtensilsIcon className="h-5 w-5 mr-2" /> Nutrition Plans
                  </Link>
                </Button>
                <Button asChild variant="outline" onClick={() => handleFeatureClick('/premium/training')}>
                  <Link href="/premium/training">
                    <VideoIcon className="h-5 w-5 mr-2" /> Training Guides
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Key Stats */}
            {simulationMode && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Today's Workouts</p>
                        <p className="text-2xl font-bold">{dynamicStats.workoutsCompleted}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Calories Burned</p>
                        <p className="text-2xl font-bold">{dynamicStats.caloriesBurned}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FlameIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Minutes</p>
                        <p className="text-2xl font-bold">{dynamicStats.workoutTime}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TimerIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Goal Progress</p>
                        <p className="text-2xl font-bold">{dynamicStats.progress}%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUpIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid grid-cols-5 md:w-auto w-full mb-8">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <BarChart3Icon className="h-5 w-5 mr-2 text-primary" /> 
                          Premium Analytics
                        </CardTitle>
                        <CardDescription>
                          Advanced insights and analytics for your fitness journey
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">New</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                      <div className="relative h-[200px] rounded-md overflow-hidden">
                        <Image 
                          src={SECURE_IMAGES.analytics}
                          alt="Analytics Preview" 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-4 text-white">
                            <h3 className="font-bold mb-1">Comprehensive Tracking</h3>
                            <p className="text-sm opacity-90">Monitor all aspects of your fitness journey</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 border rounded-lg p-3 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <TrendingUpIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">AI Progress Predictions</h4>
                            <p className="text-sm text-muted-foreground">Advanced algorithms predict your future fitness results</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 border rounded-lg p-3 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <BarChart3Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Interactive Charts</h4>
                            <p className="text-sm text-muted-foreground">Visualize your progress with dynamic charts</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 border rounded-lg p-3 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <HeartIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Health Insights</h4>
                            <p className="text-sm text-muted-foreground">Get actionable insights for better health</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild onClick={() => handleFeatureClick('/premium/analytics')}>
                      <Link href="/premium/analytics">View Full Analytics</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="workouts">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <DumbbellIcon className="h-5 w-5 mr-2 text-primary" /> 
                          Premium Workouts
                        </CardTitle>
                        <CardDescription>
                          Exclusive training programs designed by fitness experts
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">Updated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                      <div className="relative rounded-lg overflow-hidden border group cursor-pointer" onClick={() => handleFeatureClick('/premium/workouts')}>
                        <div className="relative h-[150px]">
                          <Image 
                            src={SECURE_IMAGES.gym}
                            alt="HIIT Program" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary/90 backdrop-blur-sm">Pro Program</Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-1">HIIT Master Program</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            A 12-week progressive HIIT program to maximize calorie burn and improve cardiovascular fitness
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">12 workouts • {today}</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border group cursor-pointer" onClick={() => handleFeatureClick('/premium/workouts')}>
                        <div className="relative h-[150px]">
                          <Image 
                            src={SECURE_IMAGES.weights}
                            alt="Strength Program" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary/90 backdrop-blur-sm">Featured</Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-1">Strength Builder Pro</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Focus on compound movements and progressive overload for maximum strength gains
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">16 workouts • {today}</span>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild onClick={() => handleFeatureClick('/premium/workouts')}>
                      <Link href="/premium/workouts">Browse All Premium Workouts</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="nutrition">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <UtensilsIcon className="h-5 w-5 mr-2 text-primary" /> 
                          Premium Nutrition
                        </CardTitle>
                        <CardDescription>
                          Advanced nutrition planning and meal recommendations
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">AI Powered</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border group cursor-pointer" onClick={() => handleFeatureClick('/premium/nutrition')}>
                      <div className="relative h-[200px]">
                        <Image 
                          src={SECURE_IMAGES.nutrition}
                          alt="Meal Planning" 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium mb-2">Personalized Meal Plans</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          AI-generated meal plans tailored to your goals, preferences, dietary restrictions, and fitness routine. Get precise macronutrient recommendations and shopping lists.
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="bg-primary/5 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                            <div className="font-medium">Macro Tracking</div>
                          </div>
                          <div className="bg-primary/5 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                            <div className="font-medium">Shopping Lists</div>
                          </div>
                          <div className="bg-primary/5 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                            <div className="font-medium">Recipe Database</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild onClick={() => handleFeatureClick('/premium/nutrition')}>
                      <Link href="/premium/nutrition">Access Nutrition Features</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="training">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <VideoIcon className="h-5 w-5 mr-2 text-primary" /> 
                          Training Guides
                        </CardTitle>
                        <CardDescription>
                          Expert video tutorials and educational content
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">New</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                      <div className="relative rounded-lg overflow-hidden border group cursor-pointer" onClick={() => handleFeatureClick('/premium/training')}>
                        <div className="relative h-[120px]">
                          <iframe 
                            src="https://www.youtube.com/embed/Dy28eq2PjcM?mute=1&controls=0&showinfo=0" 
                            className="absolute inset-0 w-full h-full"
                            title="Perfect Your Squat Form"
                            allowFullScreen
                          ></iframe>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/90 flex items-center justify-center">
                              <VideoIcon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm line-clamp-1">Perfect Your Squat Form</h4>
                          <p className="text-xs text-muted-foreground">12 min • Form Guide</p>
                        </div>
                      </div>
                      
                      <div className="relative rounded-lg overflow-hidden border group cursor-pointer" onClick={() => handleFeatureClick('/premium/training')}>
                        <div className="relative h-[120px]">
                          <iframe 
                            src="https://www.youtube.com/embed/wHk3YdDnGBw?mute=1&controls=0&showinfo=0" 
                            className="absolute inset-0 w-full h-full"
                            title="Maximizing Muscle Growth"
                            allowFullScreen
                          ></iframe>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/90 flex items-center justify-center">
                              <VideoIcon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm line-clamp-1">Maximizing Muscle Growth</h4>
                          <p className="text-xs text-muted-foreground">20 min • Training Science</p>
                        </div>
                      </div>
                      
                      <div className="relative rounded-lg overflow-hidden border group cursor-pointer" onClick={() => handleFeatureClick('/premium/training')}>
                        <div className="relative h-[120px]">
                          <iframe 
                            src="https://www.youtube.com/embed/saA6zYwUN0U?mute=1&controls=0&showinfo=0" 
                            className="absolute inset-0 w-full h-full"
                            title="Recovery Optimization"
                            allowFullScreen
                          ></iframe>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-primary/90 flex items-center justify-center">
                              <VideoIcon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm line-clamp-1">Recovery Optimization</h4>
                          <p className="text-xs text-muted-foreground">15 min • Recovery Strategies</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild onClick={() => handleFeatureClick('/premium/training')}>
                      <Link href="/premium/training">Browse All Training Guides</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="connections">
                <ThirdPartyConnections />
              </TabsContent>
            </Tabs>
            
            {simulationMode && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300 text-center flex items-center justify-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  You're viewing premium features in simulation mode. <Button variant="link" className="h-auto p-0" asChild onClick={() => {
                    localStorage.removeItem('simulatedPremium');
                    window.location.reload();
                  }}><span>Exit Simulation</span></Button>
                </p>
              </div>
            )}
          </div>
        ) : isSubscribing ? (
          <div className="max-w-md mx-auto mb-12">
            {isProcessing ? (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">Setting Up Your Premium Account</h2>
                <Progress value={(processingStep + 1) * 20} className="mb-4" />
                <p className="text-center text-muted-foreground mb-6">
                  {["Processing payment", "Verifying account", "Updating subscription", "Granting premium access", "Finalizing setup"][processingStep]}...
                </p>
                <p className="text-xs text-center text-muted-foreground">
                  Please don't close this window
                </p>
              </div>
            ) : (
              <>
                <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full mb-6">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="subscription">Real Subscription</TabsTrigger>
                    <TabsTrigger value="simulation">Simulation Mode</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subscription" className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Payment Details</h2>
                      <Button variant="ghost" size="sm" onClick={cancelSubscription}>
                        Cancel
                      </Button>
                    </div>
                    <PaymentForm onSuccess={handlePaymentSuccess} />
                  </TabsContent>
                  
                  <TabsContent value="simulation" className="pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Premium Simulation Mode</CardTitle>
                        <CardDescription>
                          Try premium features without entering payment details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-md border p-4 bg-muted/50">
                          <p className="text-sm">
                            Simulation mode lets you experience all premium features without real payment. 
                            This is a temporary access for demonstration purposes.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">What you'll get:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Full access to premium analytics with interactive charts</li>
                            <li>Exclusive premium workouts and training programs</li>
                            <li>Advanced nutrition tools and meal planning</li>
                            <li>Expert training guides and video tutorials</li>
                            <li>AI-powered recommendations and insights</li>
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex flex-col w-full gap-4">
                          <Button onClick={handleSimulatedSubscription} className="w-full">
                            Activate Simulation Mode
                          </Button>
                          <Button variant="outline" onClick={cancelSubscription} className="w-full">
                            Cancel
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        ) : (
          <>
            <PricingCards onSubscribe={handleSubscribe} />
            
            <div className="my-12">
              <h2 className="text-3xl font-bold text-center mb-8">Premium Features</h2>
              <PremiumFeatures />
            </div>
            
            <div className="my-12">
              <h2 className="text-3xl font-bold text-center mb-8">What Our Members Say</h2>
              <PremiumTestimonials />
            </div>
            
            {/* After premium features section */}
            <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-3xl my-16 overflow-hidden">
              <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                  <Badge className="mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                    <BrainCircuit className="h-3.5 w-3.5 mr-1" /> AI POWERED
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Personal AI Fitness Assistant</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Get instant, personalized fitness guidance powered by advanced AI models. Ask anything about workouts, nutrition, recovery, or progress tracking.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Bot className="h-5 w-5 text-indigo-600" /> AI Capabilities
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <span className="font-medium">Custom Workout Design</span>
                          <p className="text-sm text-muted-foreground">Tailored exercise plans based on your goals and preferences</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <span className="font-medium">Nutritional Analysis</span>
                          <p className="text-sm text-muted-foreground">Get macronutrient recommendations and meal timing advice</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <span className="font-medium">Progress Optimization</span>
                          <p className="text-sm text-muted-foreground">Advanced insights to break plateaus and maximize results</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <span className="font-medium">Recovery Strategies</span>
                          <p className="text-sm text-muted-foreground">Personalized advice on sleep, mobility, and stress management</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <span className="font-medium">Scientific Recommendations</span>
                          <p className="text-sm text-muted-foreground">Evidence-based guidance for sustainable results</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="md:col-span-3 bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col">
                    <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">AI Fitness Coach</h3>
                          <p className="text-xs text-muted-foreground">Powered by advanced machine learning</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Zap className="h-3 w-3" /> Premium Feature
                      </Badge>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto h-60 flex flex-col gap-4">
                      {chatMessages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-center">
                          <div className="max-w-sm">
                            <BrainCircuit className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                            <h4 className="text-lg font-medium mb-2">AI Fitness Coach</h4>
                            <p className="text-sm text-muted-foreground">
                              Ask me anything about your workouts, nutrition, or fitness goals. I'll provide personalized recommendations based on your profile and progress.
                            </p>
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <div 
                            key={index} 
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                msg.type === 'user' 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-muted'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="h-2 w-2 bg-indigo-600/60 rounded-full animate-bounce [animation-delay:0ms]"></span>
                              <span className="h-2 w-2 bg-indigo-600/60 rounded-full animate-bounce [animation-delay:150ms]"></span>
                              <span className="h-2 w-2 bg-indigo-600/60 rounded-full animate-bounce [animation-delay:300ms]"></span>
                            </div>
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <form onSubmit={handleChatSubmit} className="p-4 border-t flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask about workouts, nutrition, or goals..."
                        className="flex-1 rounded-lg border border-input bg-background p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={!isPremium && !simulationMode}
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        className="shrink-0"
                        disabled={!chatInput.trim() || (!isPremium && !simulationMode) || chatLoading}
                      >
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="my-12">
              <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <PremiumFaq />
            </div>
            
            <div className="text-center mt-16 mb-8">
              <h2 className="text-2xl font-bold mb-4">Ready to transform your fitness journey?</h2>
              <Button size="lg" onClick={handleSubscribe}>
                Upgrade to Premium Now
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                Not sure yet? <Button variant="link" className="p-0 h-auto" onClick={() => {
                  setIsSubscribing(true);
                  setSelectedTab("simulation");
                }}>Try the simulation mode</Button> first
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2" onClick={() => handleFeatureClick('/premium/analytics')}>
                <Link href="/premium/analytics">
                  <BarChart3Icon className="h-5 w-5" /> Premium Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => handleFeatureClick('/premium/workouts')}>
                <Link href="/premium/workouts">
                  <DumbbellIcon className="h-5 w-5" /> Premium Workouts
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => handleFeatureClick('/premium/nutrition')}>
                <Link href="/premium/nutrition">
                  <UtensilsIcon className="h-5 w-5" /> Nutrition Plans
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => handleFeatureClick('/premium/training')}>
                <Link href="/premium/training">
                  <VideoIcon className="h-5 w-5" /> Training Guides
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

