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

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const response = generateResponse(input)
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
      
      // Speak the response if speech is enabled
      if (isSpeechEnabled) {
        speakText(response)
      }
    }, 1500)
  }

  const generateResponse = (query: string) => {
    let response = "I'm processing your request..."

    // Expanded pattern matching for more comprehensive AI responses
    const lowerQuery = query.toLowerCase()

    // Workout creation and tracking
    if (lowerQuery.includes("workout") && lowerQuery.includes("create")) {
      response =
        "To create a custom workout in FitLife, go to the Workouts tab and tap the '+' button. You can then name your workout, select the type, difficulty, and add exercises with sets, reps, and weights. Don't forget to save it to your library when you're done!"
    } 
    // Nutrition tracking
    else if (lowerQuery.includes("nutrition") || (lowerQuery.includes("track") && lowerQuery.includes("food"))) {
      response =
        "Tracking nutrition in FitLife is easy! Go to the Nutrition tab, where you can log meals, scan barcodes for packaged foods, and monitor your macros. You can also create meal plans and set nutrition goals based on your fitness objectives."
    }
    // Device connectivity
    else if (lowerQuery.includes("connect") && (lowerQuery.includes("device") || lowerQuery.includes("tracker"))) {
      response =
        "To connect a fitness tracker or smartwatch, go to Settings > Devices > Connect Device. You can pair via Bluetooth or use the QR code to download the mobile app and sync your devices. FitLife supports most major fitness trackers including Fitbit, Garmin, and Apple Watch."
    }
    // Reminders and alerts
    else if (lowerQuery.includes("reminder") || lowerQuery.includes("alert")) {
      response =
        "You can set up reminders in the Settings > Notifications section. Create custom alerts for workouts, meals, hydration, and more. You can choose specific days, times, and even custom sounds for each reminder to help you stay on track."
    }
    // Progress tracking
    else if (lowerQuery.includes("progress") || (lowerQuery.includes("track") && lowerQuery.includes("improvement"))) {
      response =
        "FitLife offers comprehensive progress tracking! Check the Dashboard for an overview, or go to the Progress section to see detailed charts of your workouts, nutrition, body measurements, and more over time. You can also take progress photos and compare them side by side."
    }
    // Specific muscle group targeting
    else if (lowerQuery.includes("core") || lowerQuery.includes("ab") || lowerQuery.includes("abdominal")) {
      response = 
        "Great core exercises include planks, Russian twists, bicycle crunches, and leg raises. For a complete core workout, try combining 3-4 of these exercises for 3 sets each, 2-3 times per week. Remember that compound movements like squats and deadlifts also engage your core significantly. Would you like me to suggest a specific core workout routine?"
    }
    // Pre-workout nutrition
    else if (lowerQuery.includes("eat") && lowerQuery.includes("before") && lowerQuery.includes("workout")) {
      response = 
        "For optimal energy during your workout, eat a meal with carbs and some protein 2-3 hours before, or a small snack 30-60 minutes before. Good options include a banana with peanut butter, Greek yogurt with berries, or oatmeal with protein powder. Avoid heavy, fatty, or fiber-rich foods that might cause digestive discomfort during exercise."
    }
    // Protein recommendations
    else if (lowerQuery.includes("protein") && (lowerQuery.includes("need") || lowerQuery.includes("much"))) {
      response = 
        "Your daily protein needs depend on your activity level and goals. For the average person, 0.8g per kg of bodyweight is sufficient. If you're active, aim for 1.2-1.7g/kg. For muscle building, target 1.6-2.2g/kg. For a 70kg person trying to build muscle, that's about 112-154g of protein daily. Try our calculator to get a personalized recommendation based on your specific details."
    }
    // Cardio for beginners
    else if (lowerQuery.includes("cardio") && lowerQuery.includes("beginner")) {
      response = 
        "For beginners, start with walking 30 minutes, 3-5 times per week. Gradually introduce jogging intervals (walk 2 minutes, jog 1 minute). Swimming and cycling are also excellent low-impact options. Aim to build up to 150 minutes of moderate activity weekly. Listen to your body and progress gradually to avoid injury and burnout. Would you like a specific beginner cardio plan?"
    }
    // Flexibility improvement
    else if (lowerQuery.includes("flexibility") || lowerQuery.includes("stretch")) {
      response = 
        "To improve flexibility, dedicate 10-15 minutes daily to stretching. Focus on major muscle groups like hamstrings, quads, hips, back, and shoulders. Hold static stretches for 30-60 seconds. Consider adding yoga or Pilates to your routine 2-3 times weekly. Dynamic stretching before workouts and static stretching after is ideal. Consistency is key - daily practice will yield better results than occasional longer sessions."
    }
    // Best time to exercise
    else if (lowerQuery.includes("time") && lowerQuery.includes("exercise")) {
      response = 
        "The best time to exercise is whenever you can do it consistently. Morning workouts may help establish a routine and boost metabolism all day. Afternoon workouts (2-6pm) might offer performance benefits as your body temperature peaks. Evening workouts can help relieve stress but avoid intense exercise within 1-2 hours of bedtime. The most important factor is choosing a time you can maintain consistently."
    }
    // Weight loss meal plan
    else if (lowerQuery.includes("meal plan") && lowerQuery.includes("weight loss")) {
      response = 
        "A balanced weight loss meal plan should create a moderate calorie deficit while providing adequate nutrition. Focus on protein (lean meats, fish, legumes), fiber-rich carbs (vegetables, fruits, whole grains), and healthy fats (avocado, nuts, olive oil). Aim for 3 moderate meals plus 1-2 small snacks. Portion control is key - use smaller plates and measure portions initially. Would you like me to suggest a sample day of eating?"
    }
    // Default response
    else {
      response =
        "I'm here to help with your fitness journey! You can ask about workouts, nutrition, tracking progress, device connectivity, and more. I can also help calculate your BMI, daily calorie needs, protein requirements, and water intake in our calculator tab. What specific aspect of your fitness journey can I assist with today?"
    }

    return response
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
      className={`w-full ${isExpanded ? "fixed inset-4 z-50 h-[calc(100vh-32px)]" : "h-[500px] max-h-[85vh]"}`}
      style={cardStyle}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
            <Tabs value={currentTab} className="hidden sm:block">
              <TabsList>
                <TabsTrigger value="chat" onClick={() => setCurrentTab("chat")}>
                  <Brain className="h-4 w-4 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="calculator" onClick={() => setCurrentTab("calculator")}>
                  <Calculator className="h-4 w-4 mr-1" />
                  Calculator
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1 sm:flex-none flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSpeech} 
                title={isSpeechEnabled ? "Disable voice" : "Enable voice"}
                className={cn("transition-colors", isSpeechEnabled ? "text-primary" : "")}
              >
                {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={clearChat}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex sm:hidden mt-2">
          <Tabs value={currentTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="chat" onClick={() => setCurrentTab("chat")} className="flex-1">
                <Brain className="h-4 w-4 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="calculator" onClick={() => setCurrentTab("calculator")} className="flex-1">
                <Calculator className="h-4 w-4 mr-1" />
                Calculator
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          {currentTab === "chat" ? (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
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
                        <div>
                          <div
                            className="p-3"
                            style={getMessageStyle(message.sender)}
                          >
                            {message.content}
                            {message.sender === "assistant" && isSpeechEnabled && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="ml-2 h-6 w-6 opacity-70 hover:opacity-100"
                                onClick={() => speakText(message.content)}
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                        <div>
                          <div 
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: aiStyle.secondaryColor,
                              color: aiStyle.textColor,
                              borderRadius: aiStyle.borderRadius,
                              transition: aiStyle.messageTransition,
                            }}
                          >
                            <div className="flex space-x-2">
                              <div className="h-2 w-2 rounded-full animate-bounce" style={{ background: aiStyle.primaryColor }}></div>
                              <div
                                className="h-2 w-2 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s", background: aiStyle.primaryColor }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s", background: aiStyle.primaryColor }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {messages.length === 1 && (
                <div className="px-4 pb-4">
                  <h4 className="font-medium text-sm mb-2">Suggested questions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((question, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer hover:bg-muted/80 transition-colors"
                        style={{ 
                          background: `${aiStyle.secondaryColor}`, 
                          color: aiStyle.textColor,
                          borderRadius: "999px" 
                        }}
                        onClick={() => handleSampleQuestion(question)}
                      >
                        {question}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
                    className={isListening ? "transition-colors" : "transition-colors"}
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
                {(isExpanded || !isLoading) && (
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Switch id="ai-voice" checked={isSpeechEnabled} onCheckedChange={toggleSpeech} />
                      <Label htmlFor="ai-voice">Enable voice responses</Label>
                    </div>
                    {isListening && <span className="text-red-500 animate-pulse">Listening...</span>}
                  </div>
                )}
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

