"use client"

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { User, Trophy, Sun, Sunrise, Sunset, Moon, Coffee, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface WelcomeGreetingProps {
  userName?: string
}

export function WelcomeGreeting({ userName }: WelcomeGreetingProps) {
  const [greeting, setGreeting] = useState("")
  const [icon, setIcon] = useState<React.ReactNode>(<User className="h-5 w-5" />)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    // Get current hour
    const currentHour = new Date().getHours()
    
    // Determine time of day and appropriate greeting
    let timeGreeting = ""
    if (currentHour >= 5 && currentHour < 12) {
      timeGreeting = "Good morning"
      setIcon(<Sunrise className="h-5 w-5 text-amber-500" />)
    } else if (currentHour >= 12 && currentHour < 17) {
      timeGreeting = "Good afternoon"
      setIcon(<Sun className="h-5 w-5 text-amber-500" />)
    } else if (currentHour >= 17 && currentHour < 21) {
      timeGreeting = "Good evening"
      setIcon(<Sunset className="h-5 w-5 text-orange-500" />)
    } else {
      timeGreeting = "Good night"
      setIcon(<Moon className="h-5 w-5 text-indigo-400" />)
    }

    // Check if this is the first visit of the day
    const lastVisit = localStorage.getItem('lastVisit')
    const today = format(new Date(), 'yyyy-MM-dd')
    
    if (!lastVisit || lastVisit !== today) {
      setIsFirstVisit(true)
      localStorage.setItem('lastVisit', today)
    }

    // Set appropriate greeting
    if (userName) {
      if (isFirstVisit) {
        setGreeting(`${timeGreeting}, ${userName}! 👋 Welcome to a new day of progress!`)
      } else {
        // Choose random welcome back message
        const welcomeBackMessages = [
          `${timeGreeting}, ${userName}! 👋 Welcome back!`,
          `${timeGreeting}, ${userName}! Ready for another productive session?`,
          `${timeGreeting}, ${userName}! Great to see you again!`,
          `${timeGreeting}, ${userName}! Let's crush some goals today!`
        ]
        const randomIndex = Math.floor(Math.random() * welcomeBackMessages.length)
        setGreeting(welcomeBackMessages[randomIndex])
      }
    } else {
      setGreeting(`${timeGreeting}! 👋 Welcome to FitLife!`)
    }
  }, [userName, isFirstVisit])

  return (
    <Card className="border-none shadow-sm bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="flex items-center gap-2 p-4">
        <span className="flex items-center justify-center rounded-full bg-primary/10 p-2">
          {icon}
        </span>
        <p className="text-lg font-medium">{greeting}</p>
      </CardContent>
    </Card>
  )
} 