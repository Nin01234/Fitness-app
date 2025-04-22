"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useNotifications } from "@/components/notifications/notification-provider"
import { Bell, Info, CheckCircle, AlertTriangle, AlertCircle, Dumbbell, Utensils, Award, MessageSquare } from "lucide-react"
import { Label } from "@/components/ui/label"

// Sample notifications for testing with proper types
const sampleNotifications = [
  {
    title: "Workout Complete",
    message: "Congratulations! You've completed your strength training workout.",
    type: "success" as const,
    action: {
      text: "View Progress",
      url: "/progress"
    }
  },
  {
    title: "New Achievement",
    message: "You've earned the '10 Workouts Completed' badge!",
    type: "success" as const,
    action: {
      text: "View Achievements",
      url: "/achievements"
    }
  },
  {
    title: "Nutrition Reminder",
    message: "Don't forget to log your lunch for today.",
    type: "warning" as const,
    action: {
      text: "Add Meal",
      url: "/nutrition"
    }
  },
  {
    title: "Upcoming Workout",
    message: "You have a scheduled HIIT workout tomorrow at 7:00 AM.",
    type: "info" as const,
    action: {
      text: "View Workout",
      url: "/workouts"
    }
  },
  {
    title: "Weekly Goal Update",
    message: "You're 80% of the way to your weekly workout goal. Keep it up!",
    type: "info" as const
  },
  {
    title: "Friend Request",
    message: "John Smith wants to connect with you on FitLife.",
    type: "info" as const,
    action: {
      text: "Accept",
      url: "/connections"
    }
  },
  {
    title: "Premium Trial Ending",
    message: "Your premium trial will end in 3 days. Upgrade to continue enjoying premium features.",
    type: "warning" as const,
    action: {
      text: "Upgrade Now",
      url: "/premium"
    }
  },
  {
    title: "New Feature Available",
    message: "Try out our new AI-powered workout recommendations!",
    type: "info" as const,
    action: {
      text: "Explore",
      url: "/dashboard"
    }
  }
]

export function NotificationDemo() {
  const { addNotification, requestPermission, hasPermission, markAllAsRead, clearNotifications } = useNotifications()
  const [title, setTitle] = useState("Workout Reminder")
  const [message, setMessage] = useState("Don't forget your scheduled workout today!")
  const [type, setType] = useState<"info" | "success" | "warning" | "error">("info")
  const [notificationIndex, setNotificationIndex] = useState(0)

  const handleSendNotification = () => {
    addNotification({
      title,
      message,
      type,
    })
  }

  const handleRequestPermission = () => {
    if (!hasPermission) {
      requestPermission()
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const addRandomNotification = () => {
    const notification = sampleNotifications[notificationIndex % sampleNotifications.length]
    addNotification(notification)
    setNotificationIndex(prev => prev + 1)
  }

  const addAllSampleNotifications = () => {
    sampleNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification)
      }, index * 300) // Stagger notifications
    })
    setNotificationIndex(sampleNotifications.length)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Custom Notification Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <div className="mt-1">
              <input
                id="title"
                name="title"
                type="text"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <div className="mt-1">
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <div className="mt-1">
              <Select value={type} onValueChange={(value: "info" | "success" | "warning" | "error") => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span>Info</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="success">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Success</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Warning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="error">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Error</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={handleSendNotification} variant="default">
              Send Notification
            </Button>
            {!hasPermission && (
              <Button onClick={handleRequestPermission} variant="outline">
                Request Permission
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={addRandomNotification} variant="outline" size="sm">
              Add Random Notification
            </Button>
            <Button onClick={addAllSampleNotifications} variant="outline" size="sm">
              Add All Notifications
            </Button>
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              Mark All As Read
            </Button>
            <Button onClick={clearNotifications} variant="outline" size="sm">
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sampleNotifications.map((notification, index) => (
              <Button 
                key={index}
                variant="ghost" 
                size="sm"
                className="h-auto py-2 flex flex-col items-center justify-center text-center border rounded-lg"
                onClick={() => addNotification(notification)}
              >
                {notification.type === "success" ? (
                  <Award className="h-4 w-4 mb-1" />
                ) : notification.type === "warning" ? (
                  <Bell className="h-4 w-4 mb-1" />
                ) : notification.type === "info" && notification.title.includes("Workout") ? (
                  <Dumbbell className="h-4 w-4 mb-1" />
                ) : notification.type === "info" && notification.title.includes("Nutrition") ? (
                  <Utensils className="h-4 w-4 mb-1" />
                ) : notification.title.includes("Friend") ? (
                  <MessageSquare className="h-4 w-4 mb-1" />
                ) : (
                  <Info className="h-4 w-4 mb-1" />
                )}
                <span className="text-xs font-medium line-clamp-1">{notification.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

