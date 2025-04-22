"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageSquare, Paperclip, Info, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  id: number
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface AppTip {
  id: number
  title: string
  content: string
  category: "workouts" | "nutrition" | "progress" | "general"
}

export function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "�� Hi there! I'm your Support Assistant. How can I help with your fitness journey today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const appTips: AppTip[] = [
    {
      id: 1,
      title: "Getting Started",
      content:
        "Welcome to FitLife! Start by setting up your profile with your fitness goals, current measurements, and preferences to get personalized recommendations.",
      category: "general",
    },
    {
      id: 2,
      title: "Tracking Workouts",
      content:
        "Tap the '+' button on the Workouts page to log a new workout. You can select from templates or create your own custom routine.",
      category: "workouts",
    },
    {
      id: 3,
      title: "Nutrition Logging",
      content:
        "Use the barcode scanner in the Nutrition section to quickly log packaged foods, or search our database of over 1 million food items.",
      category: "nutrition",
    },
    {
      id: 4,
      title: "Progress Photos",
      content: "Take weekly progress photos in the Progress section to visually track your transformation over time.",
      category: "progress",
    },
    {
      id: 5,
      title: "Setting Reminders",
      content: "Set custom reminders for workouts, meals, and water intake to stay on track with your fitness routine.",
      category: "general",
    },
    {
      id: 6,
      title: "Using AI Trainers",
      content:
        "Our AI trainers can provide form guidance, workout suggestions, and motivation. Access them from the Workouts page.",
      category: "workouts",
    },
    {
      id: 7,
      title: "Earning Achievements",
      content:
        "Complete challenges and maintain consistency to earn achievements and rewards that track your fitness journey.",
      category: "general",
    },
    {
      id: 8,
      title: "Meal Planning",
      content:
        "Use the meal planner to prepare your nutrition for the week, making it easier to stay on track with your diet goals.",
      category: "nutrition",
    },
    {
      id: 9,
      title: "Connecting Devices",
      content:
        "Connect your fitness wearables and smart scales in Settings to automatically sync your activity and measurements.",
      category: "general",
    },
    {
      id: 10,
      title: "Workout Timer",
      content:
        "Use the built-in workout timer for interval training, rest periods, and to track your total workout duration.",
      category: "workouts",
    },
  ]

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && !isMuted) {
      playSound("open")
    }
  }

  const handleSendMessage = () => {
    if (message.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    if (!isMuted) {
      playSound("send")
    }

    // Process user query to find relevant tips or generate response
    const userQuery = message.toLowerCase()
    let botResponse = ""

    // Check for specific keywords to provide targeted help
    if (userQuery.includes("workout") || userQuery.includes("exercise")) {
      botResponse =
        "To log a workout, go to the Workouts tab and click the '+' button. You can choose from templates or create your own. Don't forget to use the timer feature for rest periods!"
    } else if (userQuery.includes("food") || userQuery.includes("nutrition") || userQuery.includes("diet")) {
      botResponse =
        "Track your nutrition by logging meals in the Nutrition section. You can use our barcode scanner for packaged foods or search our database. The meal planner can help you prepare for the week ahead."
    } else if (userQuery.includes("progress") || userQuery.includes("weight") || userQuery.includes("measurement")) {
      botResponse =
        "Track your progress in the Progress section. You can log measurements, weight, and upload progress photos. Graphs will visualize your journey over time."
    } else if (userQuery.includes("achievement") || userQuery.includes("reward") || userQuery.includes("challenge")) {
      botResponse =
        "Complete fitness challenges to earn achievements and rewards! Check the Achievements section to see available challenges and your current progress."
    } else if (userQuery.includes("reminder") || userQuery.includes("notification")) {
      botResponse =
        "Set up reminders in the Reminders section. You can create alerts for workouts, meals, water intake, and more to stay on track."
    } else if (userQuery.includes("ai") || userQuery.includes("trainer")) {
      botResponse =
        "Our AI trainers can provide personalized workout guidance. Access them from the Workouts page and choose a trainer that matches your fitness goals."
    } else if (userQuery.includes("help") || userQuery.includes("guide") || userQuery.includes("how to")) {
      botResponse =
        "Check out our Tips section for guides on using all FitLife features. You can also visit the Support page for video tutorials and FAQs."
    } else {
      // Generic responses if no specific keywords are found
      const responses = [
        "I can help you track your nutrition goals and suggest meal plans!",
        "Need workout recommendations? I can suggest exercises based on your fitness level.",
        "Staying consistent is key to reaching your fitness goals. How can I help you stay on track?",
        "Remember to stay hydrated throughout the day, especially during workouts!",
        "Make sure you're getting enough protein to support muscle recovery after workouts.",
        "Have you checked out our recipe collection? There are some great post-workout meals there.",
        "Try setting small, achievable goals to build momentum in your fitness journey.",
        "Don't forget to track your progress regularly - it's a great motivation booster!",
        "Rest days are just as important as workout days for overall fitness progress.",
        "Is there a specific feature of the app you'd like to learn more about?",
      ]
      botResponse = responses[Math.floor(Math.random() * responses.length)]
    }

    // Simulate bot response (would be replaced with actual AI integration)
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        content: botResponse,
        timestamp: new Date(),
        sender: "bot",
      }

      setMessages((prev) => [...prev, botMessage])
      if (!isMuted) {
        playSound("receive")
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const playSound = (type: "open" | "send" | "receive") => {
    if (isMuted) return

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      let soundUrl = ""
      switch (type) {
        case "open":
          soundUrl = "/sounds/chat-open.mp3"
          break
        case "send":
          soundUrl = "/sounds/message-sent.mp3"
          break
        case "receive":
          soundUrl = "/sounds/message-received.mp3"
          break
      }

      audioRef.current = new Audio(soundUrl)
      audioRef.current.volume = 0.5
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
    } catch (error) {
      console.error("Error playing sound:", error)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const filteredTips = (category: string) => {
    return category === "all" ? appTips : appTips.filter((tip) => tip.category === category)
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] md:w-[400px] shadow-xl border-primary/10 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground py-4 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary-foreground">
                  <AvatarFallback className="text-primary-foreground font-bold bg-primary-foreground/20">
                    SA
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-base">Support Assistant</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8" onClick={toggleChat}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-1">
              <TabsList className="bg-transparent gap-1 h-10">
                <TabsTrigger
                  value="chat"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg text-sm h-8 px-3"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="tips"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg text-sm h-8 px-3"
                >
                  Tips & Help
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="space-y-0 mt-0 border-0 p-0">
              <CardContent className="p-0 h-[320px] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="text-sm">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-3 px-3 border-t">
                <div className="flex w-full gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 bg-muted h-9 w-9">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Attach file</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Input
                    placeholder="Ask for help..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full"
                  />

                  <Button variant="default" size="icon" onClick={handleSendMessage} className="shrink-0 h-9 w-9">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>

            <TabsContent value="tips" className="m-0">
              <div className="p-2">
                <Tabs defaultValue="all">
                  <TabsList className="w-full mb-2">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="workouts" className="text-xs">
                      Workouts
                    </TabsTrigger>
                    <TabsTrigger value="nutrition" className="text-xs">
                      Nutrition
                    </TabsTrigger>
                    <TabsTrigger value="progress" className="text-xs">
                      Progress
                    </TabsTrigger>
                    <TabsTrigger value="general" className="text-xs">
                      General
                    </TabsTrigger>
                  </TabsList>

                  {["all", "workouts", "nutrition", "progress", "general"].map((category) => (
                    <TabsContent key={category} value={category} className="m-0 h-80 overflow-y-auto">
                      <div className="space-y-3">
                        {filteredTips(category).map((tip) => (
                          <Card key={tip.id} className="overflow-hidden">
                            <CardHeader className="p-3 pb-1">
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-medium">{tip.title}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-1">
                              <p className="text-xs text-muted-foreground">{tip.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Open Support Assistant</span>
        </Button>
      )}
    </div>
  )
}

