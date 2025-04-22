"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Send, Mic, MicOff, Volume2, VolumeX, Dumbbell, SpaceIcon as Yoga, Salad, Heart } from "lucide-react"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
  trainer: string
}

interface Trainer {
  id: string
  name: string
  specialty: string
  avatar: string
  description: string
  icon: React.ReactNode
}

export function WorkoutAiTrainer() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTrainer, setActiveTrainer] = useState<string>("strength")
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const trainers: Trainer[] = [
    {
      id: "strength",
      name: "Max Power",
      specialty: "Strength Training",
      avatar: "/placeholder.svg?height=40&width=40",
      description: "Specializes in strength training, weightlifting, and muscle building programs.",
      icon: <Dumbbell className="h-4 w-4" />,
    },
    {
      id: "yoga",
      name: "Serena Flow",
      specialty: "Yoga & Flexibility",
      avatar: "/placeholder.svg?height=40&width=40",
      description: "Expert in yoga, flexibility, and mindfulness practices for all levels.",
      icon: <Yoga className="h-4 w-4" />,
    },
    {
      id: "nutrition",
      name: "Dr. Nora Nutrient",
      specialty: "Nutrition Coach",
      avatar: "/placeholder.svg?height=40&width=40",
      description: "Provides personalized nutrition advice to complement your workout routine.",
      icon: <Salad className="h-4 w-4" />,
    },
    {
      id: "cardio",
      name: "Chris Cardio",
      specialty: "Cardio & HIIT",
      avatar: "/placeholder.svg?height=40&width=40",
      description: "Specializes in cardio workouts, HIIT, and endurance training programs.",
      icon: <Heart className="h-4 w-4" />,
    },
  ]

  // Initial greeting messages
  useEffect(() => {
    const initialMessages: Record<string, string> = {
      strength:
        "👋 Hi there! I'm Max, your strength training coach. Looking to build muscle or increase your strength? I'm here to help with workout plans, form tips, and motivation. What are your strength goals?",
      yoga: "✨ Namaste! I'm Serena, your yoga and flexibility guide. Whether you're a beginner or advanced practitioner, I can help you improve flexibility, balance, and mindfulness. How can I assist your practice today?",
      nutrition:
        "🥗 Hello! I'm Dr. Nora, your nutrition coach. I can help you optimize your diet to support your fitness goals, whether that's muscle gain, weight loss, or improved performance. What nutrition questions do you have?",
      cardio:
        "🏃‍♂️ Hey there! I'm Chris, your cardio and HIIT specialist. Ready to boost your endurance, burn calories, and improve your cardiovascular health? Let me know what you're looking for!",
    }

    setMessages([
      {
        id: 1,
        content: initialMessages[activeTrainer],
        sender: "ai",
        timestamp: new Date(),
        trainer: activeTrainer,
      },
    ])
  }, [activeTrainer])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
      trainer: activeTrainer,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    if (!isMuted) {
      playSound("send")
    }

    // Generate AI response based on active trainer
    setTimeout(() => {
      const aiResponse = generateAiResponse(message, activeTrainer)

      const aiMessage: Message = {
        id: messages.length + 2,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        trainer: activeTrainer,
      }

      setMessages((prev) => [...prev, aiMessage])

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

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate speech recognition
      setTimeout(() => {
        setMessage("Can you recommend a workout for today?")
        setIsRecording(false)
      }, 2000)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const playSound = (type: "send" | "receive") => {
    if (isMuted) return

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      let soundUrl = ""
      switch (type) {
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

  const generateAiResponse = (userMessage: string, trainer: string): string => {
    const userQuery = userMessage.toLowerCase()

    // Responses based on trainer type
    const responses: Record<string, string[]> = {
      strength: [
        "For building muscle, I recommend focusing on compound exercises like squats, deadlifts, bench press, and rows. Aim for 3-4 sets of 8-12 reps with progressive overload.",
        "Make sure you're getting enough protein to support muscle growth. Aim for 1.6-2.2g per kg of bodyweight daily, spread across your meals.",
        "Rest days are crucial for muscle growth! Ensure you're getting 48-72 hours of recovery between training the same muscle groups.",
        "For a beginner strength program, try a full-body workout 3 times per week focusing on the main compound lifts with proper form.",
        "To break through a plateau, try changing your rep ranges, adding drop sets, or incorporating techniques like rest-pause or supersets.",
      ],
      yoga: [
        "For better flexibility, practice consistently rather than pushing too hard in a single session. Hold each pose for 30-60 seconds and focus on breathing.",
        "If you're experiencing back pain during forward folds, try bending your knees slightly to release tension in your hamstrings.",
        "For beginners, I recommend starting with a gentle flow focusing on fundamental poses like mountain, warrior I & II, and downward dog.",
        "Meditation and breathwork are essential components of yoga. Try incorporating 5-10 minutes of mindful breathing before your practice.",
        "For stress relief, try a gentle yin yoga sequence holding restorative poses for 3-5 minutes each while focusing on deep breathing.",
      ],
      nutrition: [
        "Pre-workout nutrition should include carbs for energy and a moderate amount of protein. Try a banana with Greek yogurt about 1-2 hours before training.",
        "For muscle recovery, aim to consume 20-30g of protein within 30 minutes after your workout, along with some carbohydrates to replenish glycogen.",
        "Staying hydrated is crucial for performance. Drink about 500ml of water 2 hours before exercise and sip water throughout your workout.",
        "If you're looking to lose fat while maintaining muscle, create a moderate calorie deficit (300-500 calories) while keeping protein high (1.8-2.2g per kg).",
        "For a plant-based diet, focus on complete protein combinations like rice with beans, and consider supplementing with B12 and possibly iron.",
      ],
      cardio: [
        "For fat loss, HIIT (High-Intensity Interval Training) can be more time-efficient than steady-state cardio. Try 20-30 second all-out efforts followed by 40-60 seconds of recovery.",
        "To improve running endurance, incorporate a mix of interval training, tempo runs, and one weekly long, slow run at a conversational pace.",
        "For beginners, start with a walk-run program: alternate 1 minute of jogging with 2 minutes of walking, gradually increasing the jogging intervals over time.",
        "Cross-training with different cardio modalities (cycling, swimming, rowing) can help prevent overuse injuries and provide a more balanced fitness profile.",
        "For heart health, aim for at least 150 minutes of moderate-intensity cardio per week, spread across multiple days.",
      ],
    }

    // Check for specific keywords
    if (userQuery.includes("workout") || userQuery.includes("exercise") || userQuery.includes("routine")) {
      if (trainer === "strength") {
        return "Here's a strength workout for today:\n\n1. Barbell Squats: 4 sets of 8 reps\n2. Bench Press: 4 sets of 8 reps\n3. Bent-Over Rows: 3 sets of 10 reps\n4. Overhead Press: 3 sets of 10 reps\n5. Romanian Deadlifts: 3 sets of 10 reps\n\nRest 2-3 minutes between sets for compound movements. Focus on proper form and progressive overload!"
      } else if (trainer === "yoga") {
        return "Here's a yoga flow for today:\n\n1. Start with 5 minutes of mindful breathing\n2. Sun Salutations A & B (3 rounds each)\n3. Warrior I, II, and Reverse Warrior sequence\n4. Balance practice: Tree pose and Eagle pose\n5. Seated forward folds and gentle twists\n6. End with 5 minutes in Savasana\n\nRemember to move with your breath and honor your body's limits today."
      } else if (trainer === "nutrition") {
        return "While I focus on nutrition, here's how to fuel your workout today:\n\nPre-workout (1-2 hours before):\n- Oatmeal with banana and honey\n- 8oz water\n\nDuring workout:\n- Sip water throughout\n\nPost-workout (within 30 min):\n- Protein shake with 25g protein\n- Piece of fruit\n\nRemember to stay hydrated throughout the day!"
      } else if (trainer === "cardio") {
        return "Here's a cardio workout for today:\n\n1. Warm-up: 5 min light jog or jump rope\n2. HIIT Circuit (4 rounds):\n   - 30 sec mountain climbers\n   - 30 sec burpees\n   - 30 sec high knees\n   - 30 sec rest\n3. 15 min tempo run at 70-80% effort\n4. Cool down: 5 min walk + stretching\n\nAdjust intensity based on your fitness level and listen to your body!"
      }
    }

    // Default responses if no specific keywords are found
    return responses[trainer][Math.floor(Math.random() * responses[trainer].length)]
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Workout Trainer</CardTitle>
          <Badge variant="outline">Beta</Badge>
        </div>
        <CardDescription>Get personalized workout advice and guidance</CardDescription>
      </CardHeader>

      <Tabs defaultValue="strength" value={activeTrainer} onValueChange={setActiveTrainer}>
        <TabsList className="grid grid-cols-4 mx-4">
          {trainers.map((trainer) => (
            <TabsTrigger key={trainer.id} value={trainer.id} className="flex items-center gap-1">
              {trainer.icon}
              <span className="hidden sm:inline">{trainer.specialty.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {trainers.map((trainer) => (
          <TabsContent key={trainer.id} value={trainer.id} className="m-0 space-y-4">
            <div className="px-4 pt-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={trainer.avatar} />
                  <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{trainer.name}</h3>
                  <p className="text-xs text-muted-foreground">{trainer.specialty}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{trainer.description}</p>
            </div>

            <CardContent className="border-t p-4 h-60 overflow-y-auto">
              <div className="space-y-4">
                {messages
                  .filter((msg) => msg.trainer === trainer.id || msg.sender === "user")
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                        msg.sender === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                      <p className="text-xs opacity-50">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="border-t p-3">
              <div className="flex w-full items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleRecording}>
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>
                <Input
                  placeholder={`Ask ${trainers.find((t) => t.id === activeTrainer)?.name} a question...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardFooter>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

