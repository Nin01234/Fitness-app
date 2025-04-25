"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePremiumStatus } from "@/components/hooks/use-premium-status"
import { PremiumUpsellBanner } from "@/components/premium/premium-upsell-banner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { 
  Apple, 
  BellRing, 
  CalendarDays, 
  ChevronRightIcon, 
  Clock, 
  ExternalLink, 
  FileText, 
  LineChart, 
  ListChecks, 
  PieChart, 
  PlusCircle, 
  ShoppingCart, 
  UtensilsCrossed,
  Check,
  X,
  ArrowRight,
  Calendar,
  Download,
  Package,
  SparklesIcon
} from "lucide-react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { toast } from "@/components/ui/use-toast"
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart as ReLineChart,
  Line
} from "recharts"
import { Input } from "@/components/ui/input"

// Sample data for macros
const macroData = [
  { name: "Protein", value: 35, color: "#0088FE" },
  { name: "Carbs", value: 45, color: "#00C49F" },
  { name: "Fats", value: 20, color: "#FFBB28" },
];

// Sample data for weekly calorie intake
const calorieData = [
  { day: "Mon", calories: 2250, target: 2300 },
  { day: "Tue", calories: 2400, target: 2300 },
  { day: "Wed", calories: 2100, target: 2300 },
  { day: "Thu", calories: 2350, target: 2300 },
  { day: "Fri", calories: 2450, target: 2300 },
  { day: "Sat", calories: 2600, target: 2300 },
  { day: "Sun", calories: 2200, target: 2300 },
];

// Sample data for nutrient tracking
const nutrientData = [
  { nutrient: "Protein", current: 0, target: 120, unit: "g" },
  { nutrient: "Carbs", current: 0, target: 250, unit: "g" },
  { nutrient: "Fats", current: 0, target: 80, unit: "g" },
  { nutrient: "Fiber", current: 0, target: 30, unit: "g" },
  { nutrient: "Sugar", current: 0, target: 40, unit: "g" },
  { nutrient: "Sodium", current: 0, target: 2300, unit: "mg" },
];

// Sample meal plan
const mealPlan = [
  {
    meal: "Breakfast",
    time: "7:30 AM",
    calories: 450,
    foods: [
      { name: "Greek Yogurt", amount: "200g", calories: 130, macros: "20g protein, 6g carbs, 0g fat" },
      { name: "Granola", amount: "50g", calories: 220, macros: "6g protein, 30g carbs, 8g fat" },
      { name: "Blueberries", amount: "100g", calories: 60, macros: "0g protein, 14g carbs, 0g fat" },
      { name: "Honey", amount: "1 tsp", calories: 40, macros: "0g protein, 12g carbs, 0g fat" }
    ]
  },
  {
    meal: "Morning Snack",
    time: "10:30 AM",
    calories: 200,
    foods: [
      { name: "Protein Shake", amount: "1 serving", calories: 120, macros: "25g protein, 3g carbs, 1g fat" },
      { name: "Apple", amount: "1 medium", calories: 80, macros: "0g protein, 22g carbs, 0g fat" }
    ]
  },
  {
    meal: "Lunch",
    time: "1:00 PM",
    calories: 650,
    foods: [
      { name: "Grilled Chicken Breast", amount: "150g", calories: 240, macros: "45g protein, 0g carbs, 6g fat" },
      { name: "Brown Rice", amount: "1 cup", calories: 220, macros: "5g protein, 45g carbs, 2g fat" },
      { name: "Mixed Vegetables", amount: "150g", calories: 90, macros: "3g protein, 12g carbs, 0g fat" },
      { name: "Olive Oil", amount: "1 tbsp", calories: 120, macros: "0g protein, 0g carbs, 14g fat" }
    ]
  },
  {
    meal: "Afternoon Snack",
    time: "4:00 PM",
    calories: 250,
    foods: [
      { name: "Almonds", amount: "30g", calories: 180, macros: "6g protein, 5g carbs, 16g fat" },
      { name: "Orange", amount: "1 medium", calories: 70, macros: "1g protein, 16g carbs, 0g fat" }
    ]
  },
  {
    meal: "Dinner",
    time: "7:00 PM",
    calories: 550,
    foods: [
      { name: "Salmon Fillet", amount: "150g", calories: 280, macros: "34g protein, 0g carbs, 16g fat" },
      { name: "Quinoa", amount: "3/4 cup", calories: 160, macros: "6g protein, 30g carbs, 2g fat" },
      { name: "Roasted Broccoli", amount: "150g", calories: 60, macros: "4g protein, 8g carbs, 0g fat" },
      { name: "Lemon Juice", amount: "1 tbsp", calories: 5, macros: "0g protein, 1g carbs, 0g fat" },
      { name: "Butter", amount: "1 tsp", calories: 45, macros: "0g protein, 0g carbs, 5g fat" }
    ]
  }
];

// Sample grocery list
const groceryList = [
  { category: "Proteins", items: ["Chicken Breast", "Salmon", "Greek Yogurt", "Eggs", "Tofu", "Lean Ground Turkey"] },
  { category: "Carbohydrates", items: ["Brown Rice", "Quinoa", "Sweet Potatoes", "Oats", "Whole Grain Bread", "Bananas"] },
  { category: "Fats", items: ["Olive Oil", "Avocados", "Almonds", "Chia Seeds", "Natural Peanut Butter"] },
  { category: "Vegetables", items: ["Broccoli", "Spinach", "Bell Peppers", "Carrots", "Zucchini", "Cherry Tomatoes"] },
  { category: "Fruits", items: ["Blueberries", "Apples", "Oranges", "Strawberries", "Pineapple"] },
  { category: "Dairy & Alternatives", items: ["Almond Milk", "Cottage Cheese", "Low-fat Mozzarella"] },
  { category: "Other", items: ["Salsa", "Hummus", "Honey", "Herbs and Spices", "Coffee"] }
];

// Secure image URLs that will definitely work
const SECURE_IMAGES = {
  food: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
  nutrition: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962fd?q=80&w=800&auto=format&fit=crop",
  fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1563908094972-7f678141a55e?q=80&w=800&auto=format&fit=crop",
  mealPrep: "https://images.unsplash.com/photo-1591986947655-02235e5d4b5b?q=80&w=800&auto=format&fit=crop",
  planning: "https://images.unsplash.com/photo-1598373182324-1a630238d499?q=80&w=800&auto=format&fit=crop",
}

const styles = {
  "@keyframes highlight": {
    "0%": { backgroundColor: "transparent" },
    "50%": { backgroundColor: "var(--primary-50)" },
    "100%": { backgroundColor: "transparent" }
  },
  ".grocery-highlight": {
    animation: "highlight 1.5s ease-in-out"
  },
  "@keyframes slideIn": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(0)" }
  },
  ".animate-in": {
    animation: "slideIn 0.3s ease-in-out forwards"
  }
}

export default function PremiumNutritionPage() {
  const { isPremium, isLoading } = usePremiumStatus()
  const [simulatedPremium, setSimulatedPremium] = useState(false)
  const [hydrationLevel, setHydrationLevel] = useState(0)
  const [notificationCount, setNotificationCount] = useState(2)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [dynamicNutrientData, setDynamicNutrientData] = useState(nutrientData)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'assistant', content: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [shoppingCart, setShoppingCart] = useState<string[]>([])
  const [selectedGroceryItems, setSelectedGroceryItems] = useState<{[key: string]: boolean}>({})
  const [dataViewed, setDataViewed] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])
  
  // Check for simulated premium mode
  useEffect(() => {
    const simulated = localStorage.getItem('simulatedPremium') === 'true'
    setSimulatedPremium(simulated)
  }, [])
  
  // Updated useEffect that only updates data if the view button was clicked
  useEffect(() => {
    // Only run if premium or simulated premium AND data has been viewed
    if ((isPremium || simulatedPremium) && dataViewed) {
      // Set realistic values for nutrients
      setDynamicNutrientData([
        { nutrient: "Protein", current: 85, target: 120, unit: "g" },
        { nutrient: "Carbs", current: 210, target: 250, unit: "g" },
        { nutrient: "Fats", current: 65, target: 80, unit: "g" },
        { nutrient: "Fiber", current: 22, target: 30, unit: "g" },
        { nutrient: "Sugar", current: 28, target: 40, unit: "g" },
        { nutrient: "Sodium", current: 1650, target: 2300, unit: "mg" },
      ]);
      
      // Set hydration level
      setHydrationLevel(1.5);
    }
  }, [isPremium, simulatedPremium, dataViewed]);
  
  // If not premium and not in simulation mode, redirect to premium page
  useEffect(() => {
    if (!isLoading && !isPremium && !simulatedPremium) {
      router.push('/premium')
    }
  }, [isPremium, isLoading, simulatedPremium, router])
  
  // Function to handle logging a meal
  const handleLogMeal = () => {
    toast({
      title: "Log Meal",
      description: "Opening meal logging interface",
      duration: 3000,
    })
    
    // Navigate to the meal logging page
    router.push('/nutrition/log-meal')
  }
  
  // Function to handle adding hydration
  const handleAddHydration = () => {
    setHydrationLevel(prev => {
      const newLevel = Math.min(2.5, prev + 0.2);
      return parseFloat(newLevel.toFixed(1));
    });
    
    toast({
      title: "Hydration Updated",
      description: "Added 200ml to your daily water intake",
      duration: 3000,
    })
  }
  
  // Function to handle exporting list
  const handleExportList = () => {
    toast({
      title: "List Exported",
      description: "Your grocery list has been exported",
      duration: 3000,
    })
  }
  
  // Function to handle smart list generation
  const handleSmartList = () => {
    // Simulate AI processing time
    toast({
      title: "Generating Smart List",
      description: "Analyzing your nutrition data and preferences...",
      duration: 2000,
    })
    
    // After a delay, show success message
    setTimeout(() => {
      toast({
        title: "Smart List Generated",
        description: "Your AI-optimized grocery list is ready",
        duration: 3000,
      })
      
      // Open grocery tab if on a different tab
      const groceryTab = document.querySelector('[data-state="inactive"][value="grocery"]') as HTMLButtonElement
      if (groceryTab) {
        groceryTab.click()
      }
      
      // Highlight the new items with a subtle animation
      const groceryItems = document.querySelectorAll('.grocery-item')
      groceryItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('grocery-highlight')
          setTimeout(() => {
            item.classList.remove('grocery-highlight')
          }, 1000)
        }, index * 100)
      })
    }, 2000)
  }
  
  // Function to handle toggling notifications
  const handleToggleNotifications = () => {
    setNotificationOpen(prev => !prev);
    
    // Reset count when opened
    if (!notificationOpen) {
      setNotificationCount(0);
      
      setTimeout(() => {
        setNotificationCount(1);
      }, 60000); // 1 minute later add a notification back
    }
  }
  
  // Functions for other buttons
  const handleExportMealPlan = () => {
    toast({
      title: "Meal Plan Exported",
      description: "Your meal plan has been exported to PDF",
      duration: 3000,
    })
  }
  
  const handleCalendarView = () => {
    toast({
      title: "Calendar View",
      description: "Opening meal plan calendar view",
      duration: 3000,
    })
  }
  
  // Function to handle grocery item selection
  const handleGroceryItemClick = (item: string) => {
    setSelectedGroceryItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
    
    setShoppingCart(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item)
      } else {
        return [...prev, item]
      }
    })
    
    toast({
      title: selectedGroceryItems[item] ? "Item Removed" : "Item Added",
      description: selectedGroceryItems[item] 
        ? `Removed ${item} from your shopping cart` 
        : `Added ${item} to your shopping cart`,
      duration: 1500,
    })
  }
  
  // Function to handle chat assistant
  const handleChatAssistant = (message?: string) => {
    if (!chatOpen) {
      setChatOpen(true)
      
      // Add welcome message if this is the first time opening
      if (chatMessages.length === 0) {
        setTimeout(() => {
          setChatMessages([
            { 
              type: 'assistant', 
              content: "Hello! I'm your nutrition assistant powered by advanced AI. How can I help you today? I can provide personalized meal planning, detailed nutritional analysis, ingredient recommendations, or help track your progress toward your fitness goals." 
            }
          ])
        }, 500)
      }
      return
    }
    
    if (message || chatInput.trim()) {
      const userMessage = message || chatInput.trim()
      
      // Add user message
      setChatMessages(prev => [...prev, { type: 'user', content: userMessage }])
      setChatInput('')
      
      // Simulate assistant typing
      setTimeout(() => {
        let response = ""
        
        // Generate different responses based on the message content
        if (userMessage.toLowerCase().includes("meal")) {
          response = "I can help you log your meals and optimize your meal plan. What did you eat today? You can specify portions and ingredients, and I'll calculate the nutritional breakdown including calories, macros, and micronutrients. Would you like recommendations based on your fitness goals?"
        } else if (userMessage.toLowerCase().includes("hydration") || userMessage.toLowerCase().includes("water")) {
          response = `Staying hydrated is crucial for performance and recovery! I see you're at ${hydrationLevel} liters of your 2.5 liter goal (${Math.round((hydrationLevel/2.5)*100)}%). Your hydration needs may increase based on your activity level and climate. Would you like me to send you reminders throughout the day?`
        } else if (userMessage.toLowerCase().includes("protein") || userMessage.toLowerCase().includes("carbs") || userMessage.toLowerCase().includes("fat")) {
          response = "Based on your recent activity and goals, I recommend a macronutrient distribution of approximately 30% protein, 45% carbs, and 25% fat. Your current intake shows you're slightly under your protein target. Some high-quality protein sources to consider adding are chicken breast, Greek yogurt, lentils, or a plant-based protein shake within 30 minutes after your workout."
        } else if (userMessage.toLowerCase().includes("grocery") || userMessage.toLowerCase().includes("shopping")) {
          response = "I've analyzed your meal plan and nutritional needs to generate a smart grocery list. Based on your preferences and current stock, I recommend adding more leafy greens, lean proteins, and complex carbohydrates. Would you like me to organize this by store section for efficient shopping?"
          
          // Also trigger smart list action
          handleSmartList()
        } else if (userMessage.toLowerCase().includes("recipe") || userMessage.toLowerCase().includes("cook")) {
          response = "Based on your preferences, dietary restrictions, and available ingredients, I recommend trying our high-protein quinoa bowl recipe. It contains 35g of protein, is gluten-free, and takes only 20 minutes to prepare. The meal provides balanced nutrition with all essential amino acids and micronutrients needed for recovery. Would you like the full recipe with preparation instructions?"
        } else if (userMessage.toLowerCase().includes("calorie") || userMessage.toLowerCase().includes("deficit")) {
          response = "Based on your metrics and activity level, your estimated maintenance calories are 2,300 per day. For your weight management goal, I recommend a moderate calorie deficit of 300-500 calories, bringing your daily target to 1,800-2,000 calories. Remember that quality matters as much as quantity - focus on nutrient-dense foods that keep you satisfied longer."
        } else if (userMessage.toLowerCase().includes("allerg") || userMessage.toLowerCase().includes("intoleran")) {
          response = "I've noted your food allergies and intolerances in your profile. All meal recommendations and grocery lists will automatically exclude these ingredients. Would you like me to suggest nutritionally equivalent alternatives to common allergens in your diet?"
        } else if (userMessage.toLowerCase().includes("supplement")) {
          response = "Based on your current diet analysis, you might benefit from vitamin D and omega-3 supplementation. However, I recommend getting nutrients from whole foods first. Try incorporating more fatty fish, flaxseeds, and more outdoor activity for natural vitamin D. Would you like more specific supplement recommendations based on your goals?"
        } else {
          response = "I'm your advanced nutrition coach. I can help with customized meal planning, detailed macro tracking, recipe suggestions, grocery list optimization, supplement guidance, hydration tracking, and personalized nutrition advice based on your specific fitness goals and dietary preferences. What specific nutrition guidance do you need today?"
        }
        
        setChatMessages(prev => [...prev, { type: 'assistant', content: response }])
      }, 800) // Slightly faster response time
    }
  }
  
  // Handle chat input submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleChatAssistant()
  }

  // Function to handle viewing nutrition data
  const handleViewData = () => {
    setDataViewed(true);
    toast({
      title: "Nutrition Data",
      description: "Loading your nutrition data...",
      duration: 3000,
    })
  }

  if (isLoading) {
    return (
      <div className="container relative flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!isPremium && !simulatedPremium) {
    return (
      <div className="container relative py-10">
        <Card>
          <CardHeader>
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              This feature is only available to premium subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PremiumUpsellBanner 
              title="Unlock Premium Nutrition Tools"
              description="Upgrade to premium to access advanced nutrition planning and tracking"
            />
            <div className="mt-4 text-center">
              <Button onClick={() => router.push('/premium')}>
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container relative py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Nutrition Planning</h1>
            <PremiumBadge />
          </div>
          <p className="text-muted-foreground mt-1">
            AI-powered meal plans and nutrition tracking
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="gap-2" onClick={handleLogMeal}>
            <PlusCircle className="h-4 w-4" /> Log Meal
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={handleToggleNotifications}
            >
              <BellRing className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
            
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-card shadow-lg z-50">
                <div className="p-4 border-b">
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-muted-foreground">Your nutrition updates</div>
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-3 border-b hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium text-sm">Meal Recommendation</div>
                    <div className="text-xs text-muted-foreground">Try our new high-protein breakfast options for your goals</div>
                    <div className="text-xs text-primary mt-1">10 minutes ago</div>
                  </div>
                  <div className="p-3 border-b hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium text-sm">Calorie Goal</div>
                    <div className="text-xs text-muted-foreground">You're on track to meet your daily calorie target</div>
                    <div className="text-xs text-primary mt-1">1 hour ago</div>
                  </div>
                  <div className="p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="font-medium text-sm">Grocery List Updated</div>
                    <div className="text-xs text-muted-foreground">Your weekly shopping list has been generated</div>
                    <div className="text-xs text-primary mt-1">Yesterday</div>
                  </div>
                </div>
                <div className="p-3 text-center border-t">
                  <Button variant="link" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Daily nutrition overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-3xl font-bold">1,850</div>
                <div className="flex items-center text-xs">
                  <span className="text-muted-foreground">of </span>
                  <span className="font-medium ml-1">2,300</span>
                  <span className="text-muted-foreground ml-1">goal</span>
                </div>
              </div>
              <div className="h-16 w-16">
                <CircularProgressbar 
                  value={80} 
                  text={`80%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: 'var(--primary)',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)'
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-3xl font-bold">85<span className="text-base">g</span></div>
                <div className="flex items-center text-xs">
                  <span className="text-muted-foreground">of </span>
                  <span className="font-medium ml-1">120g</span>
                  <span className="text-muted-foreground ml-1">goal</span>
                </div>
              </div>
              <div className="h-16 w-16">
                <CircularProgressbar 
                  value={70} 
                  text={`70%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: '#0088FE',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)'
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-3xl font-bold">210<span className="text-base">g</span></div>
                <div className="flex items-center text-xs">
                  <span className="text-muted-foreground">of </span>
                  <span className="font-medium ml-1">250g</span>
                  <span className="text-muted-foreground ml-1">goal</span>
                </div>
              </div>
              <div className="h-16 w-16">
                <CircularProgressbar 
                  value={84} 
                  text={`84%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: '#00C49F',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)'
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-3xl font-bold">65<span className="text-base">g</span></div>
                <div className="flex items-center text-xs">
                  <span className="text-muted-foreground">of </span>
                  <span className="font-medium ml-1">80g</span>
                  <span className="text-muted-foreground ml-1">goal</span>
                </div>
              </div>
              <div className="h-16 w-16">
                <CircularProgressbar 
                  value={81} 
                  text={`81%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: '#FFBB28',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)'
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI meal plan notification */}
      <Card className="mb-8">
        <div className="md:flex">
          <div className="w-full p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="font-normal gap-1 bg-primary/10">
                <UtensilsCrossed className="h-3.5 w-3.5" /> AI PERSONALIZED
              </Badge>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Custom Meal Plan Is Ready</h2>
            <p className="text-muted-foreground mb-6">
              Based on your fitness goals and dietary preferences, we've created a personalized meal plan to optimize your nutrition.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="gap-2" onClick={handleCalendarView}>
                View Meal Plan <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleSmartList}>
                <ShoppingCart className="h-4 w-4" /> Generate Shopping List
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="grocery">Grocery List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Macronutrient Breakdown</CardTitle>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Your daily macronutrient distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Weekly Calorie Intake</CardTitle>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Your calorie consumption over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={calorieData}>
                      <XAxis dataKey="day" />
                      <YAxis domain={[1800, 2800]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Nutrient Tracking</CardTitle>
              <CardDescription>
                Monitor your progress towards daily nutrient targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dynamicNutrientData.map((item) => (
                  <div key={item.nutrient} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="font-medium">{item.nutrient}</div>
                      <div>
                        <span className="font-medium">{item.current}</span>
                        <span className="text-muted-foreground">/{item.target}{item.unit}</span>
                      </div>
                    </div>
                    <Progress 
                      value={(item.current / item.target) * 100} 
                      className="h-2" 
                      indicatorColor={
                        item.nutrient === "Sugar" && item.current > item.target 
                          ? "bg-destructive" 
                          : undefined
                      }
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {item.nutrient === "Sugar" && item.current > item.target 
                        ? "Exceeding recommended limit" 
                        : `${Math.round((item.current / item.target) * 100)}% of daily target`
                      }
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={handleViewData}>
                  View Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meal-plan">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Today's Meal Plan</CardTitle>
                <CardDescription>
                  Your personalized nutrition for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={handleExportMealPlan}>
                  <FileText className="h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={handleCalendarView}>
                  <CalendarDays className="h-4 w-4" /> Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dataViewed ? (
                <div className="space-y-6">
                  {mealPlan.map((meal, index) => (
                    <div key={index} className="border rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UtensilsCrossed className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{meal.meal}</h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{meal.time}</span>
                              <span className="mx-2">•</span>
                              <span>{meal.calories} calories</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={handleLogMeal}>
                          <PlusCircle className="h-4 w-4" /> Log
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="grid gap-3">
                          {meal.foods.map((food, foodIndex) => (
                            <div key={foodIndex} className="flex justify-between items-center py-1">
                              <div>
                                <div className="font-medium">{food.name}</div>
                                <div className="text-xs text-muted-foreground">{food.amount} • {food.macros}</div>
                              </div>
                              <div className="text-sm">{food.calories} cal</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No meal plan data available</h3>
                  <p className="text-muted-foreground mb-4">
                    View your personalized meal plan and nutrition recommendations
                  </p>
                  <Button variant="outline" onClick={handleViewData}>
                    View Meal Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracking">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Food Journal</CardTitle>
                <CardDescription>
                  Track your daily food intake and nutrients
                </CardDescription>
              </div>
              <Button onClick={handleLogMeal}>
                <PlusCircle className="h-4 w-4 mr-2" /> Log Meal
              </Button>
            </CardHeader>
            <CardContent>
              {dataViewed ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 py-2 px-4 bg-muted/30 rounded-lg text-sm font-medium">
                    <div>Food</div>
                    <div>Amount</div>
                    <div>Macros</div>
                    <div className="text-right">Calories</div>
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {mealPlan.flatMap(meal => meal.foods).map((food, index) => (
                      <div key={index} className="grid grid-cols-4 py-3 px-4 border-b last:border-0 hover:bg-muted/20 rounded-lg transition-colors">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-muted-foreground">{food.amount}</div>
                        <div className="text-muted-foreground">{food.macros}</div>
                        <div className="text-right">{food.calories} cal</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 px-4">
                    <Button variant="outline" size="sm" onClick={handleExportMealPlan}>
                      <FileText className="h-4 w-4 mr-2" /> Export Journal
                    </Button>
                    <div className="text-sm font-medium">
                      Total: {mealPlan.flatMap(meal => meal.foods).reduce((acc, food) => acc + Number(food.calories), 0)} calories
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No meals logged yet today</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your nutrition by logging your meals or viewing your data
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button onClick={handleLogMeal}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Log Meal
                    </Button>
                    <Button variant="outline" onClick={handleViewData}>
                      View Data
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hydration Tracking</CardTitle>
                <CardDescription>
                  Monitor your daily water intake
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-3xl font-bold">{hydrationLevel}<span className="text-base ml-1">liters</span></div>
                    <div className="text-sm text-muted-foreground">of 2.5 liter goal</div>
                  </div>
                  <div className="h-20 w-20">
                    <CircularProgressbar 
                      value={(hydrationLevel / 2.5) * 100} 
                      text={`${Math.round((hydrationLevel / 2.5) * 100)}%`}
                      styles={buildStyles({
                        pathColor: '#3b82f6',
                        textColor: 'var(--foreground)',
                        trailColor: 'var(--muted)'
                      })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                    <div className="text-sm">
                      <span className="font-medium">Reminder:</span> Try to drink at least 2.5 liters of water daily
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleViewData}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Insights</CardTitle>
                <CardDescription>
                  AI-generated recommendations based on your eating habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-3">
                    <h4 className="font-medium mb-1">Increase Protein Intake</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your goals and current intake, try adding an extra 20g of protein daily.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-3">
                    <h4 className="font-medium mb-1">Optimize Meal Timing</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider eating your largest meal post-workout to maximize nutrient absorption.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-3">
                    <h4 className="font-medium mb-1">Reduce Added Sugars</h4>
                    <p className="text-sm text-muted-foreground">
                      Your sugar intake is slightly above recommended levels. Try replacing sugary snacks with fruit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="grocery">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Shopping List</CardTitle>
                  <CardDescription>
                    Grocery items based on your meal plan
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleExportList}>
                    <FileText className="h-4 w-4" /> Export List
                  </Button>
                  <Button size="sm" className="gap-1" onClick={handleSmartList}>
                    <ShoppingCart className="h-4 w-4" /> Smart List
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {groceryList.map((category, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 border-b font-medium">
                      {category.category}
                    </div>
                    <div className="p-4">
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {category.items.map((item, itemIndex) => (
                          <div 
                            key={itemIndex} 
                            className={`flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors grocery-item ${selectedGroceryItems[item] ? 'bg-muted/40 border border-primary/20' : ''}`}
                            onClick={() => handleGroceryItemClick(item)}
                            tabIndex={0}
                            role="checkbox"
                            aria-checked={!!selectedGroceryItems[item]}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleGroceryItemClick(item);
                              }
                            }}
                          >
                            <div className="h-5 w-5 rounded border flex items-center justify-center">
                              {selectedGroceryItems[item] ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <ListChecks className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 flex justify-between">
              <div className="text-sm text-muted-foreground">Based on your 7-day meal plan</div>
              <div className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{groceryList.reduce((acc, category) => acc + category.items.length, 0)} items</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Nutrition Assistant Chat UI */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${chatOpen ? 'w-80 h-96' : 'w-auto h-auto'}`}>
        {chatOpen ? (
          <div className="bg-card border rounded-lg shadow-lg flex flex-col h-full w-full overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Nutrition Assistant</div>
                  <div className="text-xs text-muted-foreground">AI Powered</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
              {chatMessages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground text-sm">
                    <UtensilsCrossed className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                    <p>Ask me anything about nutrition!</p>
                    <p className="text-xs mt-1">I can help with meal planning, recipes, and tracking your nutrition goals.</p>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`message ${msg.type === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[80%] animate-in slide-in-from-${msg.type === 'user' ? 'right' : 'left'}`}
                  >
                    <div className={`px-3 py-2 rounded-lg ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {msg.content}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {msg.type === 'user' ? 'You' : 'Assistant'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-3 border-t flex gap-2">
              <Input 
                placeholder="Ask about nutrition..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" className="shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="relative group">
            <Button 
              className="h-14 w-14 rounded-full shadow-lg"
              onClick={() => handleChatAssistant()}
            >
              <UtensilsCrossed className="h-6 w-6" />
            </Button>
            <span className="absolute -top-10 right-0 bg-card text-card-foreground px-3 py-1.5 rounded-lg shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Nutrition Assistant
            </span>
          </div>
        )}
      </div>

      {shoppingCart.length > 0 && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button 
            className="gap-2 shadow-lg"
            onClick={() => {
              toast({
                title: "Shopping Cart",
                description: `${shoppingCart.length} items added to your cart`,
                duration: 3000,
              })
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{shoppingCart.length} items</span>
          </Button>
        </div>
      )}

      {simulatedPremium && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300 text-center flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
            You're viewing premium nutrition features in simulation mode. <Button variant="link" className="h-auto p-0" onClick={() => router.push('/premium')}>Upgrade to Premium</Button> for real access.
          </p>
        </div>
      )}

      {/* Add CSS styles for animations */}
      <style jsx global>{`
        @keyframes highlight {
          0% { background-color: transparent; }
          50% { background-color: var(--primary-100); }
          100% { background-color: transparent; }
        }
        
        .grocery-highlight {
          animation: highlight 1.5s ease-in-out;
        }
        
        .slide-in-from-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        
        .slide-in-from-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }
        
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .message {
          transition: all 0.3s ease-out;
        }
        
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        
        /* Enhanced accessibility styles */
        .grocery-item:focus {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        
        .max-h-400 {
          max-height: 400px;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        /* Dynamic color transitions */
        .dynamic-color-shift {
          transition: background-color 2s ease;
          animation: colorShift 10s infinite alternate;
        }
        
        @keyframes colorShift {
          0% { background-color: rgba(var(--primary-rgb), 0.05); }
          50% { background-color: rgba(var(--secondary-rgb), 0.05); }
          100% { background-color: rgba(var(--accent-rgb), 0.05); }
        }
      `}</style>
    </div>
  )
} 