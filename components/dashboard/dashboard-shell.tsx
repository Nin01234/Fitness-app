"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Brain, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
  showAiAssistant?: boolean
}

// Array of dynamic fitness tips and recommendations that will change over time
const aiAssistantTips = [
  {
    title: "Workout Intensity Tip",
    content: "Try to vary your workout intensity throughout the week. Mix high-intensity days with low-intensity recovery sessions for optimal results.",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />
  },
  {
    title: "Nutrition Reminder",
    content: "Remember to stay hydrated! Aim to drink at least 8 glasses of water daily, especially before and after workouts.",
    icon: <Sparkles className="h-5 w-5 text-blue-500" />
  },
  {
    title: "Recovery Suggestion",
    content: "Allow 48 hours of recovery time for muscle groups you've trained intensely before working them again.",
    icon: <Sparkles className="h-5 w-5 text-green-500" />
  },
  {
    title: "Sleep Optimization",
    content: "Quality sleep enhances workout recovery. Aim for 7-9 hours of sleep and maintain a consistent sleep schedule.",
    icon: <Sparkles className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Protein Intake",
    content: "For muscle recovery, try to consume 20-30g of protein within 30 minutes after your workout.",
    icon: <Sparkles className="h-5 w-5 text-yellow-500" />
  },
  {
    title: "Cardio Balance",
    content: "Balance your cardio with strength training. Excessive cardio can hinder muscle growth if not properly managed.",
    icon: <Sparkles className="h-5 w-5 text-red-500" />
  },
  {
    title: "Goal Adjustment",
    content: "Review and adjust your fitness goals every 4-6 weeks to keep challenging yourself and maintain motivation.",
    icon: <Sparkles className="h-5 w-5 text-teal-500" />
  },
  {
    title: "Stress Management",
    content: "High stress levels can impact your fitness progress. Try incorporating meditation or yoga into your routine.",
    icon: <Sparkles className="h-5 w-5 text-pink-500" />
  }
];

export function DashboardShell({ 
  children, 
  className,
  showAiAssistant = false
}: DashboardShellProps) {
  const [tipIndex, setTipIndex] = useState(0);
  
  // Change the tip every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTipIndex(current => (current + 1) % aiAssistantTips.length);
    }, 30000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const currentTip = aiAssistantTips[tipIndex];

  return (
    <div className={cn("bg-background min-h-screen relative", className)}>
      <div className="container space-y-8 p-4 sm:p-6 lg:p-8 pt-6 animate-in relative z-10">
        {showAiAssistant && (
          <Card className="border-primary/10 bg-primary/5 shadow-sm overflow-hidden mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                
                <div className="ai-assistant-content flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">Your Personal Fitness Assistant</h3>
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  </div>
                  
                  <div className="bg-background rounded-lg p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      {currentTip.icon}
                      <h4 className="font-medium">{currentTip.title}</h4>
                    </div>
                    <p className="text-sm">{currentTip.content}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {children}
      </div>
    </div>
  )
}

