"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bot, Send, Mic, Video, Calendar, X, Maximize2, Minimize2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Workout {
  id: number
  title: string
  duration: string
  level: string
  type: string
}

export function AiTrainer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTrainer, setActiveTrainer] = useState("max")
  const [isLoading, setIsLoading] = useState(false)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()

  const trainers = [
    {
      id: "max",
      name: "Max",
      specialty: "Strength & HIIT",
      avatar: "https://source.unsplash.com/7YVZYZeITc8/100x100",
      description: "Specializes in strength training and high-intensity workouts",
    },
    {
      id: "sophia",
      name: "Sophia",
      specialty: "Yoga & Flexibility",
      avatar: "https://source.unsplash.com/IF9TK5Uy-KI/100x100",
      description: "Expert in yoga, mobility, and mindfulness practices",
    },
    {
      id: "james",
      name: "James",
      specialty: "Nutrition & Diet",
      avatar: "https://source.unsplash.com/HOrhCnQsxnQ/100x100",
      description: "Nutrition coach focused on balanced meal planning",
    },
  ]

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          setUserProfile(data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    const fetchSampleWorkouts = async () => {
      try {
        const { data } = await supabase
          .from('workout_templates')
          .select('*')
          .limit(5)
        
        if (data) {
          setWorkouts(data)
        } else {
          // Fallback sample data
          setWorkouts([
            { id: 1, title: "Full Body HIIT", duration: "30 min", level: "Intermediate", type: "Strength" },
            { id: 2, title: "Morning Yoga Flow", duration: "20 min", level: "Beginner", type: "Yoga" },
            { id: 3, title: "Core & Abs Blast", duration: "15 min", level: "All Levels", type: "Core" },
            { id: 4, title: "Upper Body Power", duration: "45 min", level: "Advanced", type: "Strength" },
            { id: 5, title: "Recovery Stretch", duration: "25 min", level: "All Levels", type: "Recovery" },
          ])
        }
      } catch (error) {
        console.error('Error fetching workouts:', error)
        // Set fallback data
        setWorkouts([
          { id: 1, title: "Full Body HIIT", duration: "30 min", level: "Intermediate", type: "Strength" },
          { id: 2, title: "Morning Yoga Flow", duration: "20 min", level: "Beginner", type: "Yoga" },
          { id: 3, title: "Core & Abs Blast", duration: "15 min", level: "All Levels", type: "Core" },
          { id: 4, title: "Upper Body Power", duration: "45 min", level: "Advanced", type: "Strength" },
          { id: 5, title: "Recovery Stretch", duration: "25 min", level: "All Levels", type: "Recovery" },
        ])
      }
    }

    fetchUserProfile()
    fetchSampleWorkouts()
  }, [supabase])

  useEffect(() => {
    const activeTrainerData = trainers.find((t) => t.id === activeTrainer) || trainers[0]
    
    setMessages([
      {
        id: 1,
        content: `👋 Hi${userProfile ? ' ' + userProfile.first_name : ''}! I'm ${activeTrainerData.name}, your AI fitness trainer specializing in ${activeTrainerData.specialty}. How can I help you today?`,
        sender: "ai",
        timestamp: new Date(),
      },
    ])
  }, [activeTrainer, userProfile])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = async () => {
    if (message.trim() === "") return
    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const queryText = message
    setMessage("")

    try {
      // In a real app, this would be an API call to your AI service
      // For demonstration, we're using simulated responses
      const responses = [
        "Based on your goals, I recommend focusing on compound exercises like squats, deadlifts, and bench press.",
        "For your current fitness level, try 3-4 workout sessions per week with a mix of strength and cardio.",
        "Remember to stay hydrated and get enough protein to support muscle recovery.",
        "Your progress looks great! Let's increase the intensity of your workouts this week.",
        "For weight loss, focus on creating a calorie deficit through both diet and exercise.",
        "Let's schedule a HIIT session for tomorrow to boost your metabolism.",
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const aiMessage: Message = {
        id: messages.length + 2,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const changeTrainer = (trainerId: string) => {
    setActiveTrainer(trainerId)
  }

  const activeTrainerData = trainers.find((t) => t.id === activeTrainer) || trainers[0]

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-lg transition-all duration-300 md:w-96 ${isMinimized ? "h-14" : "h-[500px]"}`}>
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src={activeTrainerData.avatar} alt={activeTrainerData.name} />
                <AvatarFallback>{activeTrainerData.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{activeTrainerData.name}</CardTitle>
                <p className="text-xs opacity-90">{activeTrainerData.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimize}
                className="h-7 w-7 text-primary-foreground hover:bg-white/10"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-7 w-7 text-primary-foreground hover:bg-white/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <Tabs defaultValue="chat" className="flex flex-col h-[calc(100%-56px)]">
              <TabsList className="mx-3 mt-2 grid w-auto grid-cols-3">
                <TabsTrigger value="chat" className="text-xs">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="trainers" className="text-xs">
                  Trainers
                </TabsTrigger>
                <TabsTrigger value="workouts" className="text-xs">
                  Workouts
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="chat"
                className="flex-1 overflow-hidden flex flex-col m-0 p-0 data-[state=inactive]:hidden"
              >
                <CardContent className="overflow-y-auto p-3 flex-1">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                          msg.sender === "user" 
                            ? "ml-auto bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.sender === "ai" ? (
                            <Bot className="h-4 w-4 mt-0.5" />
                          ) : (
                            <User className="h-4 w-4 mt-0.5" />
                          )}
                          <div>
                            {msg.content}
                            <div className="mt-1 text-xs opacity-50">
                              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-150"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-300"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="border-t p-3">
                  <div className="flex w-full items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Voice input</span>
                    </Button>
                    <Input
                      placeholder="Ask your AI trainer..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      size="icon" 
                      className="h-8 w-8 shrink-0" 
                      onClick={handleSendMessage}
                      disabled={isLoading || message.trim() === ""}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>

              <TabsContent value="trainers" className="flex-1 overflow-auto m-0 p-3 data-[state=inactive]:hidden">
                <div className="space-y-3">
                  {trainers.map((trainer) => (
                    <Card
                      key={trainer.id}
                      className={`cursor-pointer transition-all hover:bg-muted/50 ${
                        activeTrainer === trainer.id ? "border-primary ring-1 ring-primary" : ""
                      }`}
                      onClick={() => changeTrainer(trainer.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={trainer.avatar} alt={trainer.name} />
                          <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{trainer.name}</h4>
                          <p className="text-xs text-muted-foreground">{trainer.specialty}</p>
                          <p className="text-xs mt-1">{trainer.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="workouts" className="flex-1 overflow-auto m-0 p-3 data-[state=inactive]:hidden">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Recommended Workouts</h3>
                  <div className="space-y-2">
                    {workouts.length > 0 ? (
                      workouts.map((workout) => (
                        <Card key={workout.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-sm">{workout.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{workout.duration}</Badge>
                                  <Badge variant="outline" className="text-xs">{workout.level}</Badge>
                                </div>
                              </div>
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">{workout.type}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="space-y-2">
                        <Skeleton className="h-[72px] w-full rounded-md" />
                        <Skeleton className="h-[72px] w-full rounded-md" />
                        <Skeleton className="h-[72px] w-full rounded-md" />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  )
}

