"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, User, CornerDownLeft, Sparkles, Dumbbell, Salad, Brain } from "lucide-react"
import { Bot } from "lucide-react"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface EnhancedAiTrainerProps {
  mode: "support" | "fitness" | "nutrition" | "wellness"
}

export function EnhancedAiTrainer({ mode = "support" }: EnhancedAiTrainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: getWelcomeMessage(mode),
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function getWelcomeMessage(mode: string): string {
    switch (mode) {
      case "fitness":
        return "Hi there! I'm your AI Fitness Coach. I can help you with workout plans, exercise techniques, and training advice. What would you like to know about today?"
      case "nutrition":
        return "Hello! I'm your AI Nutrition Expert. I can provide meal planning tips, dietary advice, and help you understand macronutrients. How can I assist with your nutrition goals?"
      case "wellness":
        return "Welcome! I'm your AI Wellness Advisor. I can offer guidance on mental health, recovery, sleep, and overall well-being. What aspect of wellness would you like to discuss?"
      case "support":
      default:
        return "Hello! I'm your FitLife Support Assistant. I can help you navigate the app, explain features, or troubleshoot issues. What can I help you with today?"
    }
  }

  function getModeIcon(trainerMode: string) {
    switch (trainerMode) {
      case "fitness":
        return <Dumbbell className="h-5 w-5" />
      case "nutrition":
        return <Salad className="h-5 w-5" />
      case "wellness":
        return <Brain className="h-5 w-5" />
      case "support":
      default:
        return <Bot className="h-5 w-5" />
    }
  }

  function handleSendMessage() {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(input, mode),
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  function generateAIResponse(userInput: string, trainerMode: string): string {
    const userQuestion = userInput.toLowerCase()
    
    // Generic responses if no specific matches
    const defaultResponses = [
      "I understand your question about that. Let me try to help you with this.",
      "That's a great question! Here's what I can tell you.",
      "I'd be happy to help with that. Here's some information that might be useful.",
      "Thanks for asking. I have some insights that might help you.",
    ]
    
    // Mode-specific pattern matching for responses
    if (trainerMode === "fitness") {
      if (userQuestion.includes("workout plan") || userQuestion.includes("training plan")) {
        return "I can help you create a personalized workout plan! To get started, I need to know a few things: your fitness goals (muscle building, weight loss, endurance, etc.), how many days per week you can train (2-6), any equipment you have access to (home gym, full gym, minimal equipment), and any physical limitations or injuries. Once you provide this info, I can recommend a suitable training program tailored specifically to your needs and experience level."
      } else if (userQuestion.includes("build muscle") || userQuestion.includes("gain strength")) {
        return "For muscle building, focus on progressive overload with compound movements like squats, deadlifts, bench press, rows, and overhead presses. Aim for 3-5 sets of 6-12 reps per exercise with 60-90 seconds rest between sets, training each muscle group 2-3 times per week. Prioritize a slight caloric surplus (200-300 calories above maintenance) with adequate protein (1.6-2.2g per kg of bodyweight). Include a mix of compound and isolation exercises for complete development. Get 7-9 hours of quality sleep nightly, as muscle growth primarily occurs during sleep. A sample split could be: Day 1: Push (chest, shoulders, triceps), Day 2: Pull (back, biceps), Day 3: Legs, then repeat with a rest day as needed."
      } else if (userQuestion.includes("lose weight") || userQuestion.includes("fat loss")) {
        return "Weight loss comes down to being in a caloric deficit - burning more calories than you consume. Calculate your maintenance calories and aim for a moderate deficit of 300-500 calories per day for sustainable fat loss (about 0.5-1% of bodyweight weekly). Combine resistance training (3-4 sessions weekly) with both HIIT and steady-state cardio (2-3 sessions weekly). The resistance training preserves muscle mass while the cardio increases your caloric burn. Prioritize protein intake (1.8-2.2g per kg) and fiber-rich foods to stay satiated. Track your food intake initially to understand portion sizes, and focus on nutrient-dense whole foods. Stay hydrated (3-4 liters daily) and manage stress levels, as high cortisol can hinder fat loss efforts."
      } else if (userQuestion.includes("beginner") || userQuestion.includes("just starting")) {
        return "Welcome to your fitness journey! As a beginner, consistency is far more important than perfection. Start with 2-3 full-body workouts per week focusing on proper form for basic movement patterns: squats, hinges (deadlifts), pushing (push-ups/presses), pulling (rows/pull-ups), and core work. Begin with bodyweight exercises or light weights until you master proper technique. Allow 48 hours between sessions for recovery. Aim for 2-3 sets of 10-15 reps per exercise. Start with a 5-10 minute dynamic warm-up and end with light stretching. Focus on progressive overload by adding a little weight or a few more reps each week. Track your workouts to see progress. Don't be intimidated in the gym - everyone started somewhere, and most people are focused on their own workouts rather than watching others."
      } else if (userQuestion.includes("cardio") || userQuestion.includes("running") || userQuestion.includes("endurance")) {
        return "For cardiovascular fitness, mix different types of cardio training for optimal results. Include: 1) LISS (Low-Intensity Steady State): 30-60 minutes at a conversational pace, 2-3 times weekly. Great for recovery and building aerobic base. 2) HIIT (High-Intensity Interval Training): 15-30 minutes of work/rest intervals (e.g., 30 seconds hard effort, 90 seconds recovery), 1-2 times weekly. Excellent for improving VO2 max and time efficiency. 3) Threshold Training: 20-40 minutes at a challenging but sustainable pace (about 80-85% max heart rate), 1-2 times weekly. For runners, follow the 10% rule - don't increase weekly mileage by more than 10% to prevent injury. Incorporate proper running shoes, hydration strategies, and recovery protocols including foam rolling tight areas post-run."
      }
    } else if (trainerMode === "nutrition") {
      if (userQuestion.includes("meal plan") || userQuestion.includes("diet plan")) {
        return "Creating a balanced meal plan starts with determining your caloric needs based on your goals, activity level, age, weight, height, and gender. For general health, focus on getting 80% of calories from nutrient-dense whole foods with balanced macronutrients. A good starting template is 4-5 meals daily with each containing: a palm-sized protein source (25-40g), a cupped handful of complex carbs, a thumb-sized portion of healthy fats, and a fist-sized portion of vegetables. Meal timing matters too - try eating within 2 hours of waking and every 3-5 hours thereafter. Plan for pre/post-workout nutrition (carbs + protein) if you exercise intensely. Batch cooking on weekends can save time and keep you consistent during busy weekdays. Would you like me to provide a specific sample meal plan based on your calorie target and dietary preferences?"
      } else if (userQuestion.includes("protein") || userQuestion.includes("protein intake")) {
        return "Protein is essential for muscle repair, growth, and overall health. For active individuals, aim for 1.6-2.2g of protein per kg of bodyweight daily (or 0.7-1g per pound). Athletes and those in caloric deficits may benefit from the higher end of this range. Quality protein sources include: lean meats (chicken, turkey, lean beef), fish (salmon, tuna), eggs and egg whites, dairy (Greek yogurt, cottage cheese, whey protein), legumes (lentils, chickpeas), and plant-based options (tofu, tempeh, seitan). For optimal muscle protein synthesis, spread intake across 4-5 meals with at least 20-40g per meal (0.25-0.4g/kg per meal). Post-workout is an especially important time to consume protein (along with some carbs), ideally within 30-60 minutes of training when your muscles are most receptive to nutrients."
      } else if (userQuestion.includes("carbs") || userQuestion.includes("carbohydrates")) {
        return "Carbohydrates are your body's preferred energy source, particularly for high-intensity exercise and brain function. They're not inherently fattening - quality and quantity matter. Focus on complex, minimally processed carbs like whole grains (oats, brown rice, quinoa), fruits, starchy vegetables (sweet potatoes, squash), and legumes. These provide sustained energy, fiber, vitamins, and minerals. For athletes, carb requirements typically range from 3-10g/kg of bodyweight depending on training volume and intensity. Strategic carb timing can enhance performance: consume 1-4g/kg 1-4 hours pre-workout for fuel, and 0.8-1.2g/kg/hour during prolonged (>60min) high-intensity sessions. Post-workout, 0.5-0.7g/kg with protein accelerates recovery. If fat loss is your goal, prioritize carbs around workouts and reduce them slightly on rest days, but avoid very low-carb approaches if you train intensely as this may compromise performance."
      } else if (userQuestion.includes("fats") || userQuestion.includes("healthy fats")) {
        return "Healthy fats are crucial for hormone production, brain health, vitamin absorption, and cellular integrity. Aim for 0.5-1g/kg of bodyweight daily (about 25-35% of total calories). Prioritize unsaturated fats from sources like: avocados, olive oil, nuts and seeds (walnuts, almonds, flaxseeds, chia seeds), fatty fish (salmon, mackerel), and nut butters. Limit saturated fats from animal products and coconut oil to moderate amounts. Avoid trans fats completely (found in processed foods with 'partially hydrogenated oils'). Omega-3 fatty acids are particularly beneficial - aim for 1-3g daily through fatty fish or supplements if you don't consume fish. Don't fear dietary fat - low-fat diets can impair hormone production and actually hinder fat loss efforts. Include some fat in most meals for satiety and to help absorb fat-soluble vitamins (A, D, E, K)."
      } else if (userQuestion.includes("calories") || userQuestion.includes("caloric")) {
        return "Caloric balance ultimately determines weight changes: surplus for weight gain, deficit for weight loss, maintenance for stability. To estimate your daily caloric needs, calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation, then multiply by an activity factor (1.2-1.9 based on activity level). For fat loss, create a moderate deficit of 300-500 calories daily for 0.5-1% bodyweight loss per week. For muscle gain, add 200-300 calories above maintenance. Tracking food intake initially using an app like MyFitnessPal helps establish portion awareness. Weigh yourself 2-3 times weekly under similar conditions and take the average to monitor trends. If weight isn't moving as expected after 2-3 weeks, adjust calories by about 10%. Remember that metabolic adaptation occurs during prolonged deficits, so periodic diet breaks at maintenance can help. Focus on food quality too - nutrient-dense foods provide more satiety per calorie than processed options."
      }
    } else if (trainerMode === "wellness") {
      if (userQuestion.includes("stress") || userQuestion.includes("anxiety")) {
        return "Managing stress is crucial for overall wellness, mental health, and even fitness progress. Chronic stress elevates cortisol, which can impact sleep, recovery, fat loss, and muscle gain. Implement these evidence-based strategies: 1) Practice daily mindfulness meditation starting with just 5-10 minutes (apps like Headspace or Calm can guide you). 2) Try box breathing during acute stress (inhale 4 counts, hold 4, exhale 4, hold 4). 3) Regular exercise naturally reduces stress hormones - even a 20-minute walk can help. 4) Optimize sleep quality with a consistent schedule and bedtime routine. 5) Consider adaptogenic herbs like ashwagandha (shown to reduce cortisol). 6) Set boundaries with technology - try designated phone-free times. 7) Connect socially - quality relationships buffer against stress. 8) Spend time in nature - even brief exposure to green spaces reduces stress markers. 9) Journal to identify stress triggers and solutions. Remember that some stress is normal and even beneficial - it's chronic, unmanaged stress that's problematic."
      } else if (userQuestion.includes("sleep") || userQuestion.includes("rest")) {
        return "Quality sleep is the foundation of recovery, performance, and overall health. During deep sleep, your body releases growth hormone, repairs tissue, and consolidates memory. Aim for 7-9 consistent hours nightly with these strategies: 1) Maintain consistent sleep/wake times (even weekends) to regulate your circadian rhythm. 2) Create an optimal sleep environment: cool (65-68°F/18-20°C), completely dark, and quiet. 3) Establish a wind-down routine 30-60 minutes before bed (dim lights, avoid screens or use blue light blockers, light reading, gentle stretching). 4) Limit caffeine after noon and alcohol within 3 hours of bedtime (alcohol disrupts REM sleep). 5) Exercise regularly, but not within 1-2 hours of bedtime for most people. 6) Consider supplements if needed: magnesium (200-400mg), theanine (200mg), or melatonin (0.5-3mg) occasionally. 7) Manage evening stress with meditation or journaling. 8) If you wake during the night, avoid checking the time as this increases sleep anxiety. Track your sleep quality with a wearable device or app to identify improvement areas."
      } else if (userQuestion.includes("recovery") || userQuestion.includes("soreness")) {
        return "Effective recovery strategies are as important as your workouts themselves. For muscle soreness (DOMS), try: 1) Active recovery - light movement like walking, swimming or cycling increases blood flow without adding stress. 2) Proper nutrition - protein intake of 0.25-0.4g/kg every 3-5 hours throughout the day supports tissue repair. 3) Hydration - aim for clear or light yellow urine. 4) Contrast therapy - alternating 2 minutes hot water with 30 seconds cold water ends with cold. 5) Self-myofascial release with foam rollers or massage tools for 5-10 minutes on tight areas. 6) Compression garments can reduce inflammation and perceived soreness. 7) Sleep optimization as mentioned earlier. 8) Anti-inflammatory foods like fatty fish, berries, and turmeric. 9) Strategic deload weeks every 4-8 weeks (reduce volume/intensity by ~40%). 10) Manage overall stress load, as mental stress impacts physical recovery. Remember that some soreness is normal, but persistent fatigue, declining performance, or increased resting heart rate may indicate inadequate recovery or overtraining."
      } else if (userQuestion.includes("meditation") || userQuestion.includes("mindfulness")) {
        return "Mindfulness meditation offers substantial benefits for mental and physical wellness, with just 10-20 minutes daily showing measurable brain changes in studies. To start: 1) Find a quiet spot and comfortable seated position. 2) Focus on your natural breath without trying to change it. 3) When your mind wanders (which is normal and expected), gently bring attention back to your breath without judgment. 4) Start with just 5 minutes and gradually increase duration. 5) Try guided meditation apps (Headspace, Calm, Insight Timer) if you prefer structure. 6) Consistency matters more than duration - daily practice yields better results than occasional longer sessions. 7) Body scan meditation (systematically bringing awareness to each body part) is particularly effective for physical tension. 8) Walking meditation combines movement with mindfulness for those who find sitting difficult. 9) Mindful moments can be integrated throughout your day - bring full attention to routine activities like eating or showering. Regular practice has been shown to reduce anxiety, improve focus, enhance recovery, and even increase gray matter in brain regions associated with emotional regulation."
      } else if (userQuestion.includes("work life balance") || userQuestion.includes("burnout")) {
        return "Work-life balance is essential for sustainable wellness and preventing burnout. Implement these strategies: 1) Set clear boundaries - define work hours and stick to them. 2) Create transition rituals between work and personal time (e.g., a short walk, meditation, or changing clothes). 3) Practice time-blocking in your schedule, including dedicated slots for exercise, meal preparation, and leisure. 4) Learn to say no - be selective about additional commitments. 5) Take regular breaks during work using techniques like the Pomodoro method (25 minutes of focused work, 5-minute break). 6) Use technology intentionally - consider app time limits and notification settings. 7) Prioritize sleep quality as discussed earlier. 8) Schedule recovery activities with the same importance as work meetings. 9) Incorporate daily movement - even short walks boost mood and energy. 10) Practice gratitude journaling to maintain perspective. 11) Connect socially with people who energize you. If you're experiencing burnout symptoms (chronic fatigue, cynicism, reduced performance), consider speaking with a healthcare provider as more structured intervention may be helpful."
      }
    } else {
      // Support mode responses
      if (userQuestion.includes("account") || userQuestion.includes("profile")) {
        return "You can manage your account settings by navigating to the Profile page from the sidebar menu. There you can update your personal information (name, email, profile picture), adjust your privacy settings, change your password, connect fitness devices, and manage your subscription details. If you need to delete your account, you'll find that option under the 'Advanced Settings' section at the bottom of the profile page. All your data will be permanently removed, so please consider downloading your information first using the 'Export Data' option. If you're encountering any specific issues with your account, please provide more details, and I'll guide you through resolving them."
      } else if (userQuestion.includes("payment") || userQuestion.includes("subscription")) {
        return "All subscription and payment options can be managed from the Premium section of the app. We offer flexible plans including monthly ($9.99/month), quarterly ($24.99, save 17%), and annual ($89.99, save 25%) payment options. All plans include full access to workout libraries, nutrition tracking, progress analytics, and personalized recommendations. To change or cancel your subscription, go to Premium > Manage Subscription, where you can update your payment method, switch plans, or cancel auto-renewal. Refunds are handled according to our refund policy (available in the Terms of Service). If you're experiencing specific billing issues such as double charges or failed payments, please provide your account email, and I can help troubleshoot or escalate to our billing department."
      } else if (userQuestion.includes("feature") || userQuestion.includes("how to use")) {
        return "FitLife offers a comprehensive suite of features to support your fitness journey. The main components include: 1) Workout Tracking: Create custom workouts or use templates, track sets/reps/weights, and view progress over time. 2) Nutrition Planning: Log meals, track macros, scan barcodes, create meal plans. 3) Progress Analytics: Body measurements, performance metrics, progress photos, and detailed charts. 4) Community: Join challenges, share achievements, and find workout partners. 5) AI Coach: Personalized recommendations based on your goals and progress. To learn how to use any specific feature, you can access our guided tutorials from the Help section or tap the '?' icon within each feature area. Which particular feature would you like to learn more about?"
      } else if (userQuestion.includes("data") || userQuestion.includes("privacy")) {
        return "FitLife takes your data privacy seriously. All personal and fitness data is encrypted in transit and at rest. We never sell your personal information to third parties. Your data is used only to provide the service and generate personalized recommendations. You can manage privacy settings in Profile > Privacy Settings, where you can control: what information is visible to other users, whether your workouts appear in community feeds, and data sharing preferences with connected apps/devices. You can export your complete data anytime from Profile > Export Data, and request permanent deletion through Profile > Advanced Settings > Delete Account. Our full privacy policy is available at fitlife.com/privacy. If you have specific data privacy concerns, please let me know."
      } else if (userQuestion.includes("sync") || userQuestion.includes("connect") || userQuestion.includes("device")) {
        return "FitLife connects with most popular fitness devices and apps. To set up a connection: 1) Go to Profile > Connected Devices & Apps. 2) Select your device manufacturer (Apple, Fitbit, Garmin, etc.) or app (Strava, MyFitnessPal, etc.). 3) Follow the authentication prompts to authorize the connection. 4) Choose which data to sync bidirectionally. For best results, ensure both FitLife and your device apps are updated to the latest versions. Data typically syncs automatically every 2-3 hours, but you can manually sync anytime by pulling down to refresh on the Dashboard. If you're experiencing sync issues, try: disconnecting and reconnecting the device, checking your internet connection, or ensuring your device firmware is updated. Which specific device or app are you trying to connect?"
      }
    }
    
    // If no specific match is found, return a random default response
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    
    if (trainerMode === "fitness") {
      return `${randomResponse} As your fitness coach, I recommend focusing on consistent training, proper form, progressive overload, and adequate recovery. Training styles should match your specific goals - whether that's strength, hypertrophy, endurance, or a combination. Would you like specific advice about a particular exercise, training method, or fitness goal?`
    } else if (trainerMode === "nutrition") {
      return `${randomResponse} When it comes to nutrition, balanced meals with adequate protein, complex carbs, healthy fats, and plenty of vegetables form the foundation of a good diet. Remember that sustainability is key - the best diet is one you can maintain long-term. Can I help with any specific nutritional questions about meal planning, macronutrients, or nutrition timing?`
    } else if (trainerMode === "wellness") {
      return `${randomResponse} Remember that wellness is holistic - physical activity, nutrition, sleep, stress management, and mental health all work together. Small, consistent habits often make more difference than occasional large efforts. Is there a specific aspect of wellness you'd like to focus on such as sleep optimization, stress management, or recovery techniques?`
    } else {
      return `${randomResponse} If you have any other questions about using FitLife or need help with troubleshooting, I'm here to assist you. Feel free to ask anything specific about the app's features, account management, subscription options, or technical issues you might be experiencing.`
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getModeIcon(mode)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">AI {mode === "support" ? "Support Assistant" : mode === "fitness" ? "Fitness Coach" : mode === "nutrition" ? "Nutrition Expert" : "Wellness Advisor"}</p>
            <p className="text-xs text-muted-foreground">Powered by FitLife AI</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Enhanced
        </Badge>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="mt-0.5 h-6 w-6">
                  <AvatarFallback className="bg-primary/20 text-foreground">
                    {getModeIcon(mode)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1">
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="mt-0.5 h-6 w-6">
                  <AvatarFallback className="bg-background text-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-muted p-3">
              <Avatar className="mt-0.5 h-6 w-6">
                <AvatarFallback className="bg-primary/20 text-foreground">
                  {getModeIcon(mode)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="h-10 resize-none"
            maxLength={500}
            aria-label="Your message to the AI trainer"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            {isTyping ? (
              <span className="animate-spin" aria-hidden="true">
                <CornerDownLeft className="h-4 w-4" />
              </span>
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to send</span>
          <span aria-label={`Character count: ${input.length} out of 500 maximum`}>{input.length}/500</span>
        </div>
      </div>
    </div>
  )
} 