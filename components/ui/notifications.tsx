"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  Bell, Award, Dumbbell, Apple, TrendingUp, 
  Flame, X, Heart, BarChart2, CheckCircle, Calendar
} from 'lucide-react'

type NotificationType = 'workout' | 'nutrition' | 'progress' | 'achievement' | 'reminder' | 'info'

interface NotificationMessage {
  id: number
  type: NotificationType
  title: string
  description: string
  icon: React.ReactNode
}

// Database of dynamic notification messages
const notificationMessages: Record<NotificationType, string[]> = {
  workout: [
    "Time for your scheduled workout!",
    "Don't forget your leg day today!",
    "You've missed your workout for 2 days. Let's get back on track!",
    "Great job with your consistency this week!",
    "Ready to crush another workout today?",
    "Your training plan has been updated with new exercises.",
    "Try the new HIIT workout just added to your plan!"
  ],
  nutrition: [
    "Remember to log your meals today!",
    "You're below your protein goal today.",
    "Great job staying within your calorie target!",
    "You've hit your water intake goal!",
    "Try adding more vegetables to your next meal.",
    "Time to prepare your post-workout meal.",
    "You've maintained a healthy eating streak for 5 days!"
  ],
  progress: [
    "You're making great progress toward your goal!",
    "You've lost 2 pounds this week!",
    "Your strength has increased by 5% this month.",
    "Your consistency has improved by 15% compared to last month.",
    "You're halfway to your target weight goal!",
    "Your endurance metrics are improving steadily.",
    "Your body measurements show positive changes!"
  ],
  achievement: [
    "You've earned the '7-Day Streak' badge!",
    "Congratulations on your first marathon!",
    "You've hit a new personal record on bench press!",
    "You've completed 100 workouts with FitLife!",
    "You've reached your monthly goal ahead of schedule!",
    "Perfect week! You've completed all planned activities.",
    "Nutrition master! You've hit all macro goals this week."
  ],
  reminder: [
    "Remember to stretch after your workout.",
    "Time to check in with your fitness goals.",
    "Don't forget to schedule your workouts for next week.",
    "It's time for your weekly weigh-in and measurements.",
    "Remember to get 7-8 hours of sleep tonight.",
    "Schedule your rest day this week.",
    "Time to restock your supplements."
  ],
  info: [
    "New workout programs are available!",
    "Check out the new nutrition calculator.",
    "We've updated our app with new features.",
    "Your subscription will renew in 7 days.",
    "New blog post: '10 Tips for Better Recovery'",
    "Limited-time challenge starting next week!",
    "Connect with a fitness coach for personalized guidance."
  ]
}

// Icons for each notification type
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  workout: <Dumbbell className="h-5 w-5" />,
  nutrition: <Apple className="h-5 w-5" />,
  progress: <TrendingUp className="h-5 w-5" />,
  achievement: <Award className="h-5 w-5" />,
  reminder: <Calendar className="h-5 w-5" />,
  info: <Bell className="h-5 w-5" />
}

export function useNotifications() {
  // Generate a random notification for testing purposes
  const generateRandomNotification = (): NotificationMessage => {
    const types = Object.keys(notificationMessages) as NotificationType[]
    const randomType = types[Math.floor(Math.random() * types.length)]
    const messages = notificationMessages[randomType]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    return {
      id: Date.now(),
      type: randomType,
      title: getNotificationTitle(randomType),
      description: randomMessage,
      icon: notificationIcons[randomType]
    }
  }

  const getNotificationTitle = (type: NotificationType): string => {
    switch (type) {
      case 'workout': return 'Workout'
      case 'nutrition': return 'Nutrition'
      case 'progress': return 'Progress'
      case 'achievement': return 'Achievement'
      case 'reminder': return 'Reminder'
      case 'info': return 'Information'
    }
  }

  const showNotification = (notification: NotificationMessage) => {
    toast(
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${getNotificationColor(notification.type)}`}>
          {notification.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
        </div>
      </div>,
      {
        duration: 5000,
        position: 'top-right',
      }
    )
  }

  const showRandomNotification = () => {
    const notification = generateRandomNotification()
    showNotification(notification)
  }

  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case 'workout': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
      case 'nutrition': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
      case 'progress': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
      case 'achievement': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200'
      case 'reminder': return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200'
      case 'info': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return {
    showNotification,
    showRandomNotification,
  }
}

// Component to demo notifications in dashboard
export function NotificationDemo() {
  const { showRandomNotification } = useNotifications()
  
  useEffect(() => {
    // Show a notification when the component mounts
    const timer = setTimeout(() => {
      showRandomNotification()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <button 
      onClick={showRandomNotification}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
    >
      Show Random Notification
    </button>
  )
} 