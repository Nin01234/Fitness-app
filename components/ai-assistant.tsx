"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Mic, MicOff, Maximize2, Minimize2, RefreshCw, VolumeX, Volume2, Calculator, Brain, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FitnessCalculator } from "@/components/fitness-calculator"
import { format } from "date-fns"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

// Expanded sample questions for more diverse AI capabilities
const sampleQuestions = [
  "How do I create a custom workout?",
  "What's the best way to track my nutrition?",
  "How do I connect my fitness tracker?",
  "Can you suggest a meal plan for weight loss?",
  "How do I set up workout reminders?",
  "What exercises target the core muscles?",
  "How can I track my progress over time?",
  "What should I eat before a workout?",
  "How much protein do I need daily?",
  "What's a good cardio routine for beginners?",
  "How can I improve my flexibility?",
  "What's the best time of day to exercise?",
]

// Define theme options for dynamic styling
const themes = [
  {
    name: "default",
    primaryColor: "rgb(var(--primary))",
    backgroundColor: "rgb(var(--background))",
    secondaryColor: "rgb(var(--muted))",
    accent: "rgb(var(--accent))",
    textColor: "rgb(var(--foreground))"
  },
  {
    name: "energetic",
    primaryColor: "#FF5722",
    backgroundColor: "#FAFAFA",
    secondaryColor: "#EEEEEE",
    accent: "#FF9800",
    textColor: "#212121"
  },
  {
    name: "calm",
    primaryColor: "#00897B",
    backgroundColor: "#F5F7FA",
    secondaryColor: "#E4E9F0",
    accent: "#4DB6AC",
    textColor: "#263238"
  },
  {
    name: "focused",
    primaryColor: "#5C6BC0",
    backgroundColor: "#FAFAFA",
    secondaryColor: "#ECEFF1",
    accent: "#7986CB",
    textColor: "#263238"
  },
  {
    name: "powerful",
    primaryColor: "#D81B60",
    backgroundColor: "#FAFAFA", 
    secondaryColor: "#F3E5F5",
    accent: "#EC407A",
    textColor: "#37474F"
  }
]

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your FitLife AI assistant. How can I help you with your fitness journey today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const [speechVoice, setSpeechVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentTab, setCurrentTab] = useState<"chat" | "calculator">("chat")
  const [activeTheme, setActiveTheme] = useState<number>(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const themeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Dynamic styling state
  const [aiStyle, setAiStyle] = useState({
    backgroundColor: themes[0].backgroundColor,
    primaryColor: themes[0].primaryColor,
    secondaryColor: themes[0].secondaryColor,
    accentColor: themes[0].accent,
    textColor: themes[0].textColor,
    avatarGlow: "0 0 0px rgb(var(--primary))",
    messageTransition: "all 0.3s ease",
    scale: 1,
    borderRadius: "0.75rem"
  })

  // Set dynamic theme change
  useEffect(() => {
    // Change theme every 5 minutes (300000ms) to keep UI fresh
    themeIntervalRef.current = setInterval(() => {
      setActiveTheme(prev => (prev + 1) % themes.length)
    }, 300000)
    
    return () => {
      if (themeIntervalRef.current) {
        clearInterval(themeIntervalRef.current)
      }
    }
  }, [])
  
  // Apply theme changes
  useEffect(() => {
    const theme = themes[activeTheme]
    setAiStyle({
      backgroundColor: theme.backgroundColor,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accent,
      textColor: theme.textColor,
      avatarGlow: `0 0 10px ${theme.primaryColor}`,
      messageTransition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      scale: 1,
      borderRadius: activeTheme === 0 ? "0.75rem" : "1rem"
    })
  }, [activeTheme])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech synthesis with better voice selection
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)
        
        // Look for specific high-quality voices first
        const preferredVoiceNames = [
          'Google UK English Female', 
          'Microsoft Zira Desktop',
          'Samantha',
          'Karen'
        ]
        
        // Try to find one of our preferred voices
        let selectedVoice = null
        for (const name of preferredVoiceNames) {
          const voice = voices.find(v => v.name === name)
          if (voice) {
            selectedVoice = voice
            break
          }
        }
        
        // Fallback to any English female voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
          )
        }
        
        // Final fallback to any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.includes('en'))
        }
        
        // Last resort, just use the first voice
        setSpeechVoice(selectedVoice || voices[0])
      }
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices
      }
      
      updateVoices()
      
      // Ensure voices are loaded
      setTimeout(updateVoices, 1000)
    }

    // Request microphone permissions
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log("Microphone permission granted")
        })
        .catch(err => {
          console.error("Error accessing microphone:", err)
        })
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Add more comprehensive fitness information and responses
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simple keyword-based response system - in a real app this would call an API
    const userInput = userMessage.toLowerCase()
    
    // More detailed fitness knowledge base
    const fitnessResponses = {
      workout: [
        "Based on the latest exercise science research, an effective full-body workout should include compound exercises targeting major muscle groups. I recommend starting with squats (3 sets, 8-12 reps), followed by bench press or push-ups (3 sets, 8-12 reps), bent-over rows or pull-ups (3 sets, 8-12 reps), overhead press (3 sets, 8-12 reps), and finishing with a core exercise like planks (3 sets, 30-60 seconds). Rest 60-90 seconds between sets, and ensure proper form throughout.",
        "For an effective high-intensity interval training (HIIT) workout, try this: Warm up for 5 minutes, then alternate between 30 seconds of maximum effort exercise (like burpees, mountain climbers, or jump squats) and 30 seconds of rest. Complete 8-10 rounds total. This workout maximizes calorie burn while being time-efficient, taking only 20-25 minutes total.",
        "If you're looking to build muscle, focus on progressive overload - gradually increasing the weight, frequency, or reps in your strength training routine. A split routine might work well, such as: Monday (Chest/Triceps), Tuesday (Back/Biceps), Wednesday (Rest), Thursday (Legs/Core), Friday (Shoulders/Arms), Weekend (Active Recovery). Aim for 8-12 reps per set for hypertrophy, with 3-4 sets per exercise.",
      ],
      nutrition: [
        "For optimal fitness results, nutrition is just as important as exercise. Focus on whole foods with a good balance of macronutrients: 1.6-2.2g of protein per kg of bodyweight for muscle building, moderate carbohydrates (3-5g/kg) focusing on complex sources like whole grains, fruits and vegetables, and healthy fats (0.5-1.5g/kg) from sources like avocados, nuts, and olive oil. Stay hydrated with at least 3-4 liters of water daily, especially around workout times.",
        "If weight loss is your goal, create a moderate calorie deficit of about 500 calories per day by combining increased physical activity with dietary changes. Focus on nutrient-dense, high-volume foods like vegetables, lean proteins, and whole grains that keep you feeling full. Consider tracking your food intake for a few weeks to understand your eating patterns. Remember that sustainable weight loss is typically 0.5-1kg per week.",
        "For pre-workout nutrition, consume a meal with carbohydrates and moderate protein about 2-3 hours before exercise (e.g., oatmeal with protein powder and fruit). If you're exercising within an hour, opt for something easily digestible like a banana. Post-workout, aim to consume 20-30g of protein and some carbohydrates within 45 minutes to optimize recovery and muscle protein synthesis.",
      ],
      recovery: [
        "Recovery is a crucial and often overlooked component of fitness. Ensure you're getting 7-9 hours of quality sleep nightly, as sleep is when most physical recovery and muscle building occurs. Consider adding active recovery days with light activities like walking or yoga. Proper hydration, nutrition, and possibly techniques like foam rolling can also enhance recovery between intense workout sessions.",
        "To reduce delayed onset muscle soreness (DOMS), ensure proper warm-up before workouts, gradual progression in exercise intensity, adequate protein intake (1.6-2.2g/kg daily), and potentially light activity on rest days to promote blood flow to sore muscles. Cold therapy (like ice baths) or contrast therapy may provide temporary relief for some individuals.",
        "Proper stretching techniques can improve recovery and flexibility. Dynamic stretches (like leg swings or arm circles) are best before workouts to prepare muscles for activity. Static stretches (holding a position for 15-30 seconds) are more effective post-workout when muscles are warm. Consider adding a dedicated mobility session 1-2 times weekly focusing on joint range of motion and muscle flexibility.",
      ],
      motivation: [
        "Staying motivated with fitness requires finding your 'why' - the deeper reason behind your goals. Try setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) like 'complete three 30-minute workouts per week for the next month.' Track your progress, celebrate small wins, and consider finding a workout buddy or community for accountability.",
        "If you're experiencing a motivation slump, try changing your routine completely. If you usually lift weights, try a dance class or swimming. Sometimes novelty itself can reinvigorate your motivation. Also consider how you can make workouts more enjoyable - maybe listen to podcasts, create energizing playlists, or exercise outdoors in nature.",
        "Building lasting fitness habits is about consistency, not perfection. The '2-day rule' can be helpful - never miss more than two days in a row. This provides flexibility while maintaining consistency. Start with manageable changes and gradually build up. Remember that motivation follows action - sometimes you need to start the workout to find the motivation, not vice versa.",
      ],
      goals: [
        "When setting fitness goals, consider focusing on performance rather than aesthetics alone. Targets like 'perform 10 push-ups with perfect form' or 'run 5km without stopping' give you concrete milestones to work toward. Break larger goals into smaller stepping stones, and track your progress objectively with a workout journal or fitness app.",
        "For balanced fitness development, consider setting goals across different dimensions: strength (e.g., increase your squat by 20%), endurance (run for 30 minutes without stopping), flexibility (touch your toes or achieve a specific yoga pose), and skill acquisition (learn to swim or master a handstand). This comprehensive approach develops overall fitness rather than just one aspect.",
        "Long-term fitness success comes from alignment between your goals and your lifestyle. Set goals that fit into your daily routine and that you genuinely enjoy pursuing. Remember that 'slow and steady' progress that you can maintain for years is far more effective than extreme approaches that last only weeks or months.",
      ]
    }
    
    // Check for fitness-related keywords and provide detailed responses
    for (const [category, responses] of Object.entries(fitnessResponses)) {
      if (userInput.includes(category)) {
        return responses[Math.floor(Math.random() * responses.length)]
      }
    }
    
    // Generic responses for other queries
    const genericResponses = [
      "I'm here to help with your fitness journey! Feel free to ask me about workouts, nutrition, recovery strategies, or setting effective fitness goals.",
      "As your fitness assistant, I can provide information on exercise techniques, meal planning, workout schedules, and motivation strategies. What specific area are you interested in exploring?",
      "I'd be happy to assist with your fitness questions. I can help with creating workout plans, nutritional advice, recovery techniques, or fitness tracking. What would you like to know more about?",
      "Thank you for your question. I can provide guidance on strength training, cardio workouts, flexibility exercises, sports nutrition, and establishing healthy habits. Could you specify which area you'd like help with?"
    ]
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!input.trim()) {
      return
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get AI response
      const response = await getAIResponse(input)
      
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, newAIMessage])
      
      // Read message aloud if speech is enabled
      if (isSpeechEnabled && speechVoice) {
        speakText(response)
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I had trouble processing your request. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      }
      
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceInput = async () => {
    // Toggle voice input state
    setIsListening(!isListening)

    if (!isListening) {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media devices not supported in this browser")
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: BlobPart[] = []
        
        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data)
        })
        
        mediaRecorder.addEventListener("stop", () => {
          // In a real application, you would send this audio to a speech-to-text service
          // For this demo, we'll simulate speech recognition with a random sample question
          const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
          setInput(randomQuestion)
          
          // Stop all tracks to release the microphone
          stream.getTracks().forEach(track => track.stop())
        })
        
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        
        // Auto-stop recording after 5 seconds
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
            setIsListening(false)
          }
        }, 5000)
      } catch (error) {
        console.error("Error starting voice recording:", error)
        setIsListening(false)
      }
    } else if (mediaRecorderRef.current) {
      // Stop recording
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
  }

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      if (speechVoice) {
        utterance.voice = speechVoice
      }
      
      // Improved speech settings
      utterance.rate = 1.0
      utterance.pitch = 1.05
      utterance.volume = 1.0
      
      // Add event listeners to track speech status
      utterance.onstart = () => {
        console.log("Speech started")
      }
      
      utterance.onend = () => {
        console.log("Speech ended")
      }
      
      utterance.onerror = (event) => {
        console.error("Speech error:", event)
      }
      
      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled)
    
    if (isSpeechEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const clearChat = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    
    setMessages([
      {
        id: "1",
        content: "Hi there! I'm your FitLife AI assistant. How can I help you with your fitness journey today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  // Get the current theme's message style
  const getMessageStyle = (sender: string) => {
    if (sender === "assistant") {
      return {
        backgroundColor: aiStyle.secondaryColor,
        color: aiStyle.textColor,
        borderRadius: aiStyle.borderRadius,
        transition: aiStyle.messageTransition,
        transform: `scale(${aiStyle.scale})`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }
    } else {
      return {
        backgroundColor: aiStyle.primaryColor,
        color: "#ffffff",
        borderRadius: aiStyle.borderRadius,
        transition: aiStyle.messageTransition,
        transform: `scale(${aiStyle.scale})`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }
    }
  }

  // Smooth component animation styles
  const cardStyle = {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isExpanded 
      ? "0 10px 25px rgba(0, 0, 0, 0.2)" 
      : "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderRadius: "1rem",
    maxWidth: "100vw",
    overflow: "hidden",
  }

  return (
    <Card 
      className={`w-full transition-all ${isExpanded ? "fixed inset-0 md:inset-4 z-50 h-[100vh] md:h-[calc(100vh-32px)]" : "h-[500px] max-h-[85vh]"}`}
      style={cardStyle}
    >
      <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
            style={{ 
              background: `${aiStyle.primaryColor}20`, 
              boxShadow: aiStyle.avatarGlow
            }}
          >
            <Bot className="h-5 w-5" style={{ color: aiStyle.primaryColor }} />
          </div>
          <div>
            <CardTitle className="text-lg">FitLife Assistant</CardTitle>
            <CardDescription>Powered by AI</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="chat" className="w-[200px]" onValueChange={(value) => setCurrentTab(value as "chat" | "calculator")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="ml-auto">
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {currentTab === "chat" ? (
            <>
              <div className="flex-1 overflow-y-auto p-4" ref={messagesEndRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start max-w-[90%] md:max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar 
                          className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}
                          style={{
                            boxShadow: message.sender === "assistant" ? aiStyle.avatarGlow : "none",
                            transition: "box-shadow 0.5s ease"
                          }}
                        >
                          {message.sender === "assistant" ? (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback style={{ background: `${aiStyle.primaryColor}20` }}>
                                <Sparkles className="h-4 w-4" style={{ color: aiStyle.primaryColor }} />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>You</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className="rounded-lg px-3 py-2 text-sm"
                          style={getMessageStyle(message.sender)}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="mt-1 text-xs opacity-70">
                            {format(message.timestamp, "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start max-w-[80%]">
                        <Avatar 
                          className="h-8 w-8 mr-2"
                          style={{
                            boxShadow: aiStyle.avatarGlow,
                            transition: "box-shadow 0.5s ease"
                          }}
                        >
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback style={{ background: `${aiStyle.primaryColor}20` }}>
                            <Sparkles className="h-4 w-4" style={{ color: aiStyle.primaryColor }} />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="rounded-lg px-3 py-2 text-sm"
                          style={getMessageStyle("assistant")}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="typing-indicator">
                              <span className="dot"></span>
                              <span className="dot"></span>
                              <span className="dot"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about fitness..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    className="flex-1"
                    disabled={isLoading}
                    style={{
                      borderColor: aiStyle.primaryColor + "40",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                  <Button
                    variant="default"
                    size="icon"
                    className="transition-colors"
                    style={{
                      background: isListening ? "#f43f5e" : aiStyle.primaryColor,
                      color: "white"
                    }}
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={handleSendMessage} 
                    disabled={!input.trim() || isLoading}
                    style={{
                      background: aiStyle.primaryColor,
                      color: "white",
                      opacity: !input.trim() || isLoading ? 0.7 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <Switch id="ai-voice" checked={isSpeechEnabled} onCheckedChange={toggleSpeech} />
                    <Label htmlFor="ai-voice">Enable voice responses</Label>
                  </div>
                  {isListening && <span className="text-red-500 animate-pulse">Listening...</span>}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4">
              <FitnessCalculator />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

