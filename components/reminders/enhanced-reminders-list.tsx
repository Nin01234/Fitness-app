"use client"

import { useState, useRef } from "react"
import { Calendar, Clock, Volume2, VolumeX, Plus, MoreHorizontal, Trash2, Edit, AlarmCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Reminder {
  id: string
  title: string
  description?: string
  date: Date
  time: string
  category: "workout" | "nutrition" | "progress" | "rest" | "general"
  enabled: boolean
  recurring?: "daily" | "weekly" | "monthly" | "none"
  sound?: "default" | "gentle" | "energetic" | "none"
}

export function EnhancedRemindersList() {
  const { toast } = useToast()
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Morning Workout",
      description: "Full body strength training",
      date: new Date(),
      time: "06:30",
      category: "workout",
      enabled: true,
      recurring: "daily",
      sound: "energetic",
    },
    {
      id: "2",
      title: "Protein Shake",
      description: "Post-workout nutrition",
      date: new Date(),
      time: "08:00",
      category: "nutrition",
      enabled: true,
      recurring: "daily",
      sound: "gentle",
    },
    {
      id: "3",
      title: "Weekly Weigh-In",
      date: new Date(),
      time: "07:00",
      category: "progress",
      enabled: true,
      recurring: "weekly",
      sound: "default",
    },
    {
      id: "4",
      title: "Meal Prep",
      description: "Prepare meals for the week",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "16:00",
      category: "nutrition",
      enabled: true,
      recurring: "weekly",
      sound: "default",
    },
    {
      id: "5",
      title: "Rest Day",
      description: "Focus on recovery and stretching",
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: "09:00",
      category: "rest",
      enabled: true,
      recurring: "weekly",
      sound: "gentle",
    },
  ])

  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "workout":
        return "bg-blue-500"
      case "nutrition":
        return "bg-green-500"
      case "progress":
        return "bg-purple-500"
      case "rest":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "workout":
        return "💪"
      case "nutrition":
        return "🥗"
      case "progress":
        return "📊"
      case "rest":
        return "😴"
      default:
        return "🔔"
    }
  }

  const getRecurringText = (recurring?: string) => {
    switch (recurring) {
      case "daily":
        return "Every day"
      case "weekly":
        return "Every week"
      case "monthly":
        return "Every month"
      default:
        return "One time"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const toggleReminderStatus = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder)),
    )

    const reminder = reminders.find((r) => r.id === id)
    if (reminder) {
      toast({
        title: reminder.enabled ? "Reminder Disabled" : "Reminder Enabled",
        description: `${reminder.title} has been ${reminder.enabled ? "disabled" : "enabled"}.`,
        variant: "default",
      })
    }

    if (!isMuted) {
      playSound("toggle")
    }
  }

  const deleteReminder = (id: string) => {
    const reminder = reminders.find((r) => r.id === id)

    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))

    if (reminder) {
      toast({
        title: "Reminder Deleted",
        description: `${reminder.title} has been deleted.`,
        variant: "default",
      })
    }

    if (!isMuted) {
      playSound("delete")
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const playSound = (type: "toggle" | "delete" | "test") => {
    if (isMuted && type !== "test") return

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      let soundUrl = ""
      switch (type) {
        case "toggle":
          soundUrl = "/sounds/reminder-toggle.mp3"
          break
        case "delete":
          soundUrl = "/sounds/reminder-delete.mp3"
          break
        case "test":
          soundUrl = "/sounds/reminder-alert.mp3"
          break
      }

      audioRef.current = new Audio(soundUrl)
      audioRef.current.volume = 0.5
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
    } catch (error) {
      console.error("Error playing sound:", error)
    }
  }

  const testReminderSound = (sound: string) => {
    if (isMuted) {
      toast({
        title: "Sound is muted",
        description: "Unmute to hear reminder sounds.",
        variant: "default",
      })
      return
    }

    playSound("test")

    toast({
      title: "Testing Reminder Sound",
      description: `Playing ${sound} reminder sound.`,
      variant: "default",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Reminders</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className={`overflow-hidden transition-all ${reminder.enabled ? "border-primary/50" : "opacity-70"}`}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${getCategoryColor(reminder.category)}`}
                  >
                    <span>{getCategoryIcon(reminder.category)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{reminder.title}</CardTitle>
                    {reminder.description && (
                      <CardDescription className="text-xs">{reminder.description}</CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={reminder.enabled} onCheckedChange={() => toggleReminderStatus(reminder.id)} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => testReminderSound(reminder.sound || "default")}
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>Test Sound</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(reminder.date)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{reminder.time}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getRecurringText(reminder.recurring)}
                </Badge>
                {reminder.sound && reminder.sound !== "none" && (
                  <Badge variant="outline" className="text-xs">
                    {reminder.sound} sound
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-2 border-t flex justify-between items-center bg-muted/50">
              <div className="flex items-center text-xs text-muted-foreground">
                <AlarmCheck className="h-3.5 w-3.5 mr-1" />
                <span>
                  {reminder.enabled
                    ? `Next alert: ${formatDate(reminder.date)} at ${reminder.time}`
                    : "Reminder disabled"}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

