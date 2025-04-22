"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { VideoLibrary } from "@/components/support/video-library"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNotifications } from "@/components/notifications/notification-provider"
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Video,
  FileText,
  Mail,
  Phone,
  Calendar,
  Heart,
  Activity,
  ChevronRight,
  X,
  ExternalLink,
  SendHorizontal,
  MessagesSquare,
  History,
  ListChecks,
  Book,
  Play,
  Info,
  Loader2,
  Dumbbell,
  Salad,
  Brain
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { HealthTalks } from "@/components/support/health-talks"
import { toast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { EnhancedAiTrainer } from "@/components/ai/enhanced-ai-trainer"
import { WellnessResources } from "@/components/support/wellness-resources"

export function EnhancedSupportCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotifications()
  const [aiMode, setAiMode] = useState<"support" | "fitness" | "nutrition" | "wellness">("support")
  const [webSearchQuery, setWebSearchQuery] = useState("")
  const [webSearchResults, setWebSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResultsVisible, setSearchResultsVisible] = useState(false)

  const faqs = [
    {
      question: "How do I track my walking or running?",
      answer:
        "Go to the Workouts tab and select 'Activity Tracking'. Choose the type of activity you want to track (walking, running, etc.) and click 'Start'. The app will use your device's GPS to track your distance, pace, and calories burned.",
    },
    {
      question: "Can I connect my fitness tracker or smartwatch?",
      answer:
        "Yes! Go to Settings > Devices > Connect and follow the instructions to pair your device. We support most major fitness trackers and smartwatches including Fitbit, Garmin, Apple Watch, and Samsung Galaxy watches.",
    },
    {
      question: "How accurate is the calorie tracking?",
      answer:
        "Our calorie tracking uses industry-standard formulas based on your activity, weight, height, age, and gender. For more accurate results, connect a heart rate monitor or fitness tracker.",
    },
    {
      question: "Can I track indoor workouts?",
      answer:
        "For indoor workouts like treadmill running or stationary cycling, use the manual tracking option in the Workouts section.",
    },
    {
      question: "How do I log my meals?",
      answer:
        "Go to the Nutrition tab and select 'Log Meal'. You can search our food database, scan barcodes, or create custom foods and recipes.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security seriously. All your fitness and health data is encrypted and stored securely. You can review our privacy policy for more details.",
    },
  ]

  const guides = [
    {
      id: "getting-started",
      title: "Getting Started Guide",
      description: "Learn the basics of FitLife",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      content: `
        # Getting Started with FitLife

        Welcome to FitLife, your all-in-one fitness tracking solution! This guide will help you get started with the app and make the most of its features.

        ## Setting Up Your Profile

        1. **Complete your profile**: Add your height, weight, age, and fitness goals
        2. **Set your preferences**: Customize your dashboard and notification settings
        3. **Connect devices**: Link your fitness trackers and smartwatches for better tracking

        ## Key Features

        - **Activity Tracking**: Monitor your walks, runs, and other activities with GPS
        - **Workout Plans**: Follow pre-made plans or create your own
        - **Nutrition Tracking**: Log meals and track your macros
        - **Progress Monitoring**: See your improvements over time
        - **Community**: Connect with other users for motivation

        ## Quick Tips

        - Enable notifications to stay on track with your goals
        - Use the barcode scanner for quick meal logging
        - Sync daily to ensure all your data is up to date
        - Check out the AI trainer for personalized workout suggestions
      `,
    },
    {
      id: "activity-tracking",
      title: "Activity Tracking",
      description: "Master GPS and device tracking",
      icon: <Activity className="h-8 w-8 text-primary" />,
      content: `
        # Activity Tracking Guide

        Learn how to track your activities effectively using FitLife's advanced tracking features.

        ## GPS Tracking

        FitLife uses your device's GPS to track outdoor activities like walking, running, cycling, and hiking.

        ### How to Start Tracking

        1. Go to the **Workouts** tab
        2. Select the **Activity Tracking** tab
        3. Choose your activity type (walking, running, etc.)
        4. Tap **Start** to begin tracking
        5. The app will track your route, distance, pace, and calories burned
        6. Tap **Pause** to pause tracking or **Stop** to end your activity

        ### Tips for Accurate Tracking

        - Allow location permissions for the app
        - Make sure your device has a good GPS signal
        - Keep your phone with you during the activity
        - For better battery life, close other apps while tracking

        ## Device Connectivity

        Connect your fitness trackers and smartwatches for enhanced tracking:

        1. Go to **Settings > Devices > Connect**
        2. Select your device from the list
        3. Follow the pairing instructions
        4. Once connected, your device data will sync automatically

        ## Tracking Metrics

        FitLife tracks the following metrics during your activities:

        - **Distance**: How far you've traveled
        - **Duration**: How long you've been active
        - **Pace**: Your speed per kilometer/mile
        - **Calories**: Estimated calories burned
        - **Route**: Map of your activity (for outdoor activities)
        - **Heart Rate**: If connected to a heart rate monitor
        - **Elevation**: Changes in altitude during your activity
      `,
    },
    {
      id: "nutrition-tracking",
      title: "Nutrition Tracking",
      description: "Learn to log meals and track macros",
      icon: <FileText className="h-8 w-8 text-primary" />,
      content: `
        # Nutrition Tracking Guide

        Learn how to effectively track your nutrition and maintain a balanced diet with FitLife.

        ## Logging Meals

        ### Quick Add

        1. Go to the **Nutrition** tab
        2. Tap **Log Meal**
        3. Search for foods in our database
        4. Adjust portions and add to your diary

        ### Barcode Scanner

        1. Tap the barcode icon in the meal logger
        2. Scan the product barcode
        3. Adjust quantity and add to your diary

        ### Creating Custom Foods

        1. Tap **Create New Food** in the meal logger
        2. Enter nutritional information
        3. Save for future use

        ## Understanding Your Nutrition Dashboard

        - **Calorie Summary**: Daily intake vs. goal
        - **Macronutrient Breakdown**: Carbs, protein, and fat distribution
        - **Micronutrient Tracking**: Vitamins and minerals
        - **Water Intake**: Track your hydration
        - **Meal Analysis**: Nutritional quality of your meals

        ## Setting Nutrition Goals

        1. Go to **Profile > Nutrition Goals**
        2. Set your calorie target
        3. Adjust macronutrient ratios
        4. Set specific nutrient goals

        ## Meal Planning

        Use the meal planner to prepare your nutrition in advance:

        1. Go to **Nutrition > Meal Plans**
        2. Create a new plan or use a template
        3. Add meals for each day
        4. Generate a shopping list
      `,
    },
    {
      id: "progress-tracking",
      title: "Progress Tracking",
      description: "Monitor your fitness journey",
      icon: <FileText className="h-8 w-8 text-primary" />,
      content: `
        # Progress Tracking Guide

        Learn how to monitor and analyze your fitness progress over time.

        ## Tracking Measurements

        1. Go to the **Progress** tab
        2. Tap **New Entry**
        3. Enter your measurements (weight, body fat %, etc.)
        4. Add progress photos if desired
        5. Save your entry

        ## Viewing Progress

        - **Charts**: Visual representation of your progress
        - **Timeline**: Chronological view of your journey
        - **Comparison**: Before and after photos
        - **Stats**: Numerical breakdown of your improvements

        ## Setting Goals

        1. Go to **Profile > Goals**
        2. Set targets for weight, measurements, or performance
        3. Choose a target date
        4. Track your progress toward these goals

        ## Progress Photos

        Taking consistent progress photos helps visualize changes:

        1. Use the same lighting and position
        2. Wear similar clothing
        3. Take photos from multiple angles
        4. Maintain a consistent schedule (weekly/monthly)

        ## Analyzing Trends

        The app provides insights based on your data:

        - **Progress Rate**: How quickly you're advancing
        - **Plateaus**: Identifying when progress slows
        - **Correlations**: How activities affect your results
        - **Predictions**: Estimated timeline for reaching goals
      `,
    },
    {
      id: "device-connectivity",
      title: "Device Connectivity",
      description: "Connect your fitness devices",
      icon: <FileText className="h-8 w-8 text-primary" />,
      content: `
        # Device Connectivity Guide

        Learn how to connect and sync your fitness devices with FitLife.

        ## Supported Devices

        FitLife supports a wide range of fitness devices:

        - **Smartwatches**: Apple Watch, Samsung Galaxy Watch, Garmin, etc.
        - **Fitness Trackers**: Fitbit, Whoop, Oura Ring, etc.
        - **Heart Rate Monitors**: Polar, Garmin, etc.
        - **Smart Scales**: Withings, Fitbit, etc.
        - **Other Sensors**: Cadence sensors, power meters, etc.

        ## Connecting Devices

        ### Bluetooth Devices

        1. Go to **Settings > Devices > Connect**
        2. Ensure Bluetooth is enabled on your phone
        3. Put your device in pairing mode
        4. Select your device from the list
        5. Follow the on-screen instructions

        ### App Connections

        For devices that use their own apps:

        1. Go to **Settings > Devices > App Connections**
        2. Select the app (e.g., Fitbit, Garmin Connect)
        3. Log in with your credentials
        4. Authorize data sharing

        ## Syncing Data

        - **Automatic Sync**: Most devices sync automatically when connected
        - **Manual Sync**: Tap the sync button in the Devices section
        - **Background Sync**: Enable to sync even when the app is closed

        ## Troubleshooting

        If you're having trouble connecting:

        1. Ensure your device is charged and nearby
        2. Restart both your device and phone
        3. Check for firmware updates for your device
        4. Ensure the device is compatible with your phone
        5. Try removing and re-adding the device
      `,
    },
    {
      id: "advanced-features",
      title: "Advanced Features",
      description: "Get the most out of FitLife",
      icon: <FileText className="h-8 w-8 text-primary" />,
      content: `
        # Advanced Features Guide

        Discover the powerful advanced features of FitLife to take your fitness journey to the next level.

        ## AI Trainer

        The AI Trainer provides personalized workout recommendations:

        1. Go to **Workouts > AI Trainer**
        2. Set your preferences and goals
        3. Receive customized workout plans
        4. Get real-time form feedback with your camera

        ## Custom Workout Builder

        Create your own workouts:

        1. Go to **Workouts > New Workout**
        2. Add exercises from our library or create your own
        3. Set sets, reps, weights, or duration
        4. Save and share your workout

        ## Advanced Analytics

        Dive deeper into your data:

        1. Go to **Progress > Analytics**
        2. View detailed breakdowns of your activities
        3. Analyze trends and patterns
        4. Export data for external analysis

        ## Social Features

        Connect with the FitLife community:

        1. Go to **Community**
        2. Find friends or join groups
        3. Participate in challenges
        4. Share achievements and progress

        ## Premium Features

        Upgrade to Premium for additional features:

        - **Video Workouts**: Access to premium workout videos
        - **Advanced Metrics**: VO2 max, training load, recovery analysis
        - **Nutrition Coaching**: Personalized meal plans
        - **Priority Support**: Faster response from our team
        - **Ad-Free Experience**: Enjoy the app without advertisements
      `,
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Support request submitted",
      description: "We'll get back to you within 24 hours.",
    })

    addNotification({
      title: "Support Request Received",
      message: "We've received your support request and will respond within 24 hours.",
      type: "success"
    })

    setIsSubmitting(false)
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const selectedGuideContent = selectedGuide ? guides.find((guide) => guide.id === selectedGuide)?.content : null

  const aiTrainerSpecialties = [
    { 
      id: "support", 
      title: "Support Assistant", 
      description: "Get help with app features and troubleshooting" 
    },
    { 
      id: "fitness", 
      title: "Fitness Coach", 
      description: "Workout advice and exercise technique guidance" 
    },
    { 
      id: "nutrition", 
      title: "Nutrition Expert", 
      description: "Meal planning and dietary recommendations" 
    },
    { 
      id: "wellness", 
      title: "Wellness Advisor", 
      description: "Mental health and recovery strategies" 
    },
  ]

  // Handle web search functionality
  const handleWebSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!webSearchQuery.trim()) return
    
    setIsSearching(true)
    setSearchResultsVisible(true)
    
    try {
      // In a real app, you'd connect to a real search API
      // This simulates search results for demonstration
      const simulateSearch = () => {
        // Demo search results based on common fitness topics
        const demoResults = [
          {
            title: `${webSearchQuery} - Workout Guide | Men's Health`,
            url: `https://www.menshealth.com/fitness/${webSearchQuery.toLowerCase().replace(/\s+/g, '-')}`,
            description: `Find the best ${webSearchQuery} workouts, nutrition tips, and fitness advice from experts. Improve your technique and results.`
          },
          {
            title: `How to ${webSearchQuery} Correctly | WebMD`,
            url: `https://www.webmd.com/fitness-exercise/${webSearchQuery.toLowerCase().replace(/\s+/g, '-')}`,
            description: `Learn the proper form and technique for ${webSearchQuery}. Includes step-by-step instructions, common mistakes, and health benefits.`
          },
          {
            title: `${webSearchQuery} for Beginners | Healthline`,
            url: `https://www.healthline.com/health/${webSearchQuery.toLowerCase().replace(/\s+/g, '-')}`,
            description: `A comprehensive guide to ${webSearchQuery} for beginners. Includes benefits, risks, and a 4-week starter program.`
          },
          {
            title: `The Science Behind ${webSearchQuery} | Scientific American`,
            url: `https://www.scientificamerican.com/article/${webSearchQuery.toLowerCase().replace(/\s+/g, '-')}/`,
            description: `Scientific research explains how ${webSearchQuery} affects your body and why it's effective for fitness and health.`
          },
          {
            title: `${webSearchQuery} Training Plan PDF | ACE Fitness`,
            url: `https://www.acefitness.org/resources/${webSearchQuery.toLowerCase().replace(/\s+/g, '-')}-plan.pdf`,
            description: `Download this free ${webSearchQuery} training plan from certified fitness professionals. Includes schedule and progression tips.`
          }
        ]
        
        // Return "filtered" results that contain the search query in some way
        return demoResults.map(result => ({
          ...result,
          title: result.title.replace(/\{searchQuery\}/g, webSearchQuery),
          url: result.url.replace(/\{searchQuery\}/g, webSearchQuery.toLowerCase().replace(/\s+/g, '-')),
          description: result.description.replace(/\{searchQuery\}/g, webSearchQuery)
        }))
      }
      
      // Simulate network delay for realism
      setTimeout(() => {
        setWebSearchResults(simulateSearch())
        setIsSearching(false)
        
        addNotification({
          title: "Search Results Ready",
          message: `Found results for "${webSearchQuery}"`,
          type: "info"
        })
      }, 1200)
      
    } catch (error) {
      console.error("Search error:", error)
      setIsSearching(false)
      
      addNotification({
        title: "Search Failed",
        message: "Unable to complete your search. Please try again.",
        type: "error"
      })
    }
  }
  
  const handleOpenExternal = (url: string) => {
    // In a real app, this would open in a new tab
    console.log(`Opening external URL: ${url}`)
    
    addNotification({
      title: "External Link",
      message: "Opening external website in new tab",
      type: "info"
    })
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for help articles, videos, or topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="ai-trainer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ai-trainer">
            <MessagesSquare className="mr-2 h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="wellness">
            <Heart className="mr-2 h-4 w-4" />
            Wellness
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="mr-2 h-4 w-4" />
            Video Library
          </TabsTrigger>
          <TabsTrigger value="health-talks">
            <Activity className="mr-2 h-4 w-4" />
            Health Talks
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-trainer" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <CardTitle className="flex items-center">
                  <MessagesSquare className="mr-2 h-5 w-5" />
                  FitLife AI Assistant
                </CardTitle>
                <CardDescription className="text-white/90">
                  Powered by advanced AI to answer all your fitness, nutrition, and wellness questions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  {aiTrainerSpecialties.map((specialty) => (
                    <Button
                      key={specialty.id}
                      variant={aiMode === specialty.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAiMode(specialty.id as any)}
                      className="rounded-full text-xs px-4"
                    >
                      {specialty.id === "support" && <MessageSquare className="mr-2 h-3 w-3" />}
                      {specialty.id === "fitness" && <Dumbbell className="mr-2 h-3 w-3" />}
                      {specialty.id === "nutrition" && <Salad className="mr-2 h-3 w-3" />}
                      {specialty.id === "wellness" && <Brain className="mr-2 h-3 w-3" />}
                      {specialty.title}
                    </Button>
                  ))}
                </div>
                <div className="h-[500px] border rounded-lg overflow-hidden shadow-sm">
                  <EnhancedAiTrainer mode={aiMode} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="mt-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Wellness Resources</h2>
            <p className="text-muted-foreground">Explore guided meditations, breathing exercises, and mindfulness practices to support your mental and emotional wellbeing alongside your fitness journey.</p>
          </div>
          <WellnessResources />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <VideoLibrary />
        </TabsContent>

        <TabsContent value="health-talks" className="mt-6">
          <HealthTalks />
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Can't find what you're looking for?
              </div>
              <Button variant="outline" asChild>
                <Link href="#contact">Contact Support</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contact" id="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                We typically respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name <span className="text-destructive" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Your name" 
                    className="mt-1" 
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email <span className="text-destructive" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Your email" 
                    className="mt-1" 
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject <span className="text-destructive" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <Input 
                  id="subject" 
                  name="subject"
                  placeholder="Briefly describe your issue" 
                  className="mt-1" 
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  Message <span className="text-destructive" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Please provide details about your question or issue"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 rounded border-input" 
                    aria-label="Send me a copy of this message"
                  />
                  <span className="text-sm">Send me a copy of this message</span>
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="button" 
                className="w-full" 
                onClick={handleContactSubmit} 
                disabled={isSubmitting}
                aria-label="Send support request"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <SendHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="websearch" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Search the Web
              </CardTitle>
              <CardDescription>
                Find fitness, nutrition, and wellness information from across the internet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWebSearch} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for fitness information..."
                    value={webSearchQuery}
                    onChange={(e) => setWebSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Search topics like: workout routines, nutrition advice, training plans, fitness equipment, etc.</p>
                </div>
              </form>
              
              {searchResultsVisible && (
                <div className="mt-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {isSearching 
                        ? "Searching..." 
                        : webSearchResults.length 
                          ? `Results for "${webSearchQuery}"` 
                          : "No results found"}
                    </h3>
                    {webSearchResults.length > 0 && !isSearching && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSearchResultsVisible(false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {webSearchResults.map((result, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors">
                          <h4 className="font-medium text-primary">{result.title}</h4>
                          <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <span className="truncate">{result.url}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenExternal(result.url)}
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Visit Site
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Fitness Searches</CardTitle>
              <CardDescription>
                Trending topics in fitness and wellness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "HIIT workout plans", 
                  "Protein intake calculator",
                  "Best home workout equipment",
                  "Recovery techniques",
                  "Macro tracking apps",
                  "Stretching routines"
                ].map((term, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setWebSearchQuery(term)
                      handleWebSearch(new Event('submit') as any)
                    }}
                  >
                    <Search className="h-3 w-3 mr-2" />
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

