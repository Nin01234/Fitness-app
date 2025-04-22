"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Bell, Clock, Plus, Trash2, Volume2, VolumeX, Droplets, Dumbbell, Apple, Scale, Moon, Edit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Reminder {
  id: string
  title: string
  type: "workout" | "meal" | "water" | "weight" | "sleep" | "custom"
  time: string
  days: string[]
  sound: string
  enabled: boolean
}

const defaultReminders: Reminder[] = [
  {
    id: "1",
    title: "Morning Workout",
    type: "workout",
    time: "07:00",
    days: ["mon", "wed", "fri"],
    sound: "chime",
    enabled: true,
  },
  {
    id: "2",
    title: "Drink Water",
    type: "water",
    time: "10:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    sound: "droplet",
    enabled: true,
  },
  {
    id: "3",
    title: "Lunch Time",
    type: "meal",
    time: "12:30",
    days: ["mon", "tue", "wed", "thu", "fri"],
    sound: "bell",
    enabled: true,
  },
  {
    id: "4",
    title: "Evening Weigh-in",
    type: "weight",
    time: "19:00",
    days: ["mon", "thu"],
    sound: "beep",
    enabled: false,
  },
]

const reminderSounds = [
  { id: "chime", name: "Chime", url: "/sounds/chime.mp3" },
  { id: "bell", name: "Bell", url: "/sounds/bell.mp3" },
  { id: "droplet", name: "Droplet", url: "/sounds/droplet.mp3" },
  { id: "beep", name: "Beep", url: "/sounds/beep.mp3" },
  { id: "alert", name: "Alert", url: "/sounds/alert.mp3" },
  { id: "success", name: "Success", url: "/sounds/success.mp3" },
]

const daysOfWeek = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
]

export function RemindersSystem() {
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null)
  const [newReminder, setNewReminder] = useState<Omit<Reminder, "id">>({
    title: "",
    type: "custom",
    time: "12:00",
    days: ["mon", "tue", "wed", "thu", "fri"],
    sound: "chime",
    enabled: true,
  })
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const getReminderIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-5 w-5" />
      case "meal":
        return <Apple className="h-5 w-5" />
      case "water":
        return <Droplets className="h-5 w-5" />
      case "weight":
        return <Scale className="h-5 w-5" />
      case "sleep":
        return <Moon className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const handleAddReminder = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const reminder: Reminder = {
      id,
      ...newReminder,
    }

    setReminders([...reminders, reminder])
    setIsAddDialogOpen(false)
    setNewReminder({
      title: "",
      type: "custom",
      time: "12:00",
      days: ["mon", "tue", "wed", "thu", "fri"],
      sound: "chime",
      enabled: true,
    })

    toast({
      title: "Reminder created",
      description: `${reminder.title} has been scheduled`,
    })

    // Simulate a notification to demonstrate the sound
    setTimeout(() => {
      playSound(reminder.sound)

      toast({
        title: "Reminder Sound Preview",
        description: `This is how your "${reminder.title}" reminder will sound`,
      })
    }, 1500)
  }

  const handleEditReminder = () => {
    if (!currentReminder) return

    setReminders(reminders.map((r) => (r.id === currentReminder.id ? currentReminder : r)))

    setIsEditDialogOpen(false)
    setCurrentReminder(null)

    toast({
      title: "Reminder updated",
      description: `Changes to "${currentReminder.title}" have been saved`,
    })
  }

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id))

    toast({
      title: "Reminder deleted",
      description: "The reminder has been removed from your schedule",
    })
  }

  const handleToggleReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  const playSound = (soundId: string) => {
    if (isMuted) return

    const sound = reminderSounds.find((s) => s.id === soundId)
    if (!sound) return

    // Use Web Audio API for better browser compatibility
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create oscillator for a simple tone
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      // Configure based on sound type
      switch (soundId) {
        case "gentle":
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4 note
          gainNode.gain.setValueAtTime(volume / 100 * 0.3, audioContext.currentTime)
          break
        case "chime":
          oscillator.type = 'triangle'
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5 note
          gainNode.gain.setValueAtTime(volume / 100 * 0.3, audioContext.currentTime)
          // Sweep down for chime effect
          oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5)
          break
        case "alert":
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5 note
          gainNode.gain.setValueAtTime(volume / 100 * 0.2, audioContext.currentTime)
          // Pulsing effect
          gainNode.gain.exponentialRampToValueAtTime(volume / 100 * 0.01, audioContext.currentTime + 0.1)
          gainNode.gain.exponentialRampToValueAtTime(volume / 100 * 0.2, audioContext.currentTime + 0.2)
          gainNode.gain.exponentialRampToValueAtTime(volume / 100 * 0.01, audioContext.currentTime + 0.3)
          break
        case "bell":
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime) // G5 note
          gainNode.gain.setValueAtTime(volume / 100 * 0.3, audioContext.currentTime)
          // Bell fade out
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5)
          break
      }
      
      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Play sound
      oscillator.start()
      
      // Stop after a short duration
      setTimeout(() => {
        oscillator.stop()
        // Clean up
        setTimeout(() => {
          oscillator.disconnect()
          gainNode.disconnect()
        }, 100)
      }, 1000)

      // Show toast notification
      toast({
        title: "Sound played",
        description: `Played ${sound.name} sound at ${volume}% volume`,
        duration: 2000,
      })
    } catch (error) {
      console.error("Error playing sound:", error)
      toast({
        title: "Sound playback failed",
        description: "Unable to play sound. Please check your browser settings.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const filteredReminders = activeTab === "all" ? reminders : reminders.filter((r) => r.type === activeTab)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Reminders & Alerts
            </CardTitle>
            <CardDescription>Schedule notifications to stay on track with your fitness goals</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Sound Settings</h4>
                  <div className="flex items-center space-x-2">
                    <Switch checked={!isMuted} onCheckedChange={(checked) => setIsMuted(!checked)} />
                    <Label>Enable Sounds</Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm text-muted-foreground">{volume}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                      disabled={isMuted}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Test Sounds</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {reminderSounds.map((sound) => (
                        <Button
                          key={sound.id}
                          variant="outline"
                          size="sm"
                          onClick={() => playSound(sound.id)}
                          disabled={isMuted}
                        >
                          {sound.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Reminder</DialogTitle>
                  <DialogDescription>Set up a new reminder to help you stay on track</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Reminder Title</Label>
                    <Input
                      id="title"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      placeholder="e.g., Afternoon Workout"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Reminder Type</Label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value: Reminder["type"]) => setNewReminder({ ...newReminder, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workout">Workout</SelectItem>
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="weight">Weight</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Repeat on days</Label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <div key={day.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.id}`}
                            checked={newReminder.days.includes(day.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewReminder({
                                  ...newReminder,
                                  days: [...newReminder.days, day.id],
                                })
                              } else {
                                setNewReminder({
                                  ...newReminder,
                                  days: newReminder.days.filter((d) => d !== day.id),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sound">Alert Sound</Label>
                    <Select
                      value={newReminder.sound}
                      onValueChange={(value) => {
                        setNewReminder({ ...newReminder, sound: value })
                        playSound(value)
                      }}
                    >
                      <SelectTrigger id="sound">
                        <SelectValue placeholder="Select sound" />
                      </SelectTrigger>
                      <SelectContent>
                        {reminderSounds.map((sound) => (
                          <SelectItem key={sound.id} value={sound.id}>
                            {sound.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      checked={newReminder.enabled}
                      onCheckedChange={(checked) => setNewReminder({ ...newReminder, enabled: checked })}
                    />
                    <Label htmlFor="enabled">Enable reminder</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddReminder} disabled={!newReminder.title}>
                    Create Reminder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="meal">Meal</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <div className="space-y-2">
            {filteredReminders.length > 0 ? (
              filteredReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    reminder.enabled ? "bg-card" : "bg-muted/40"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        reminder.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getReminderIcon(reminder.type)}
                    </div>
                    <div>
                      <h3 className={`font-medium ${!reminder.enabled && "text-muted-foreground"}`}>
                        {reminder.title}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{reminder.time}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {reminder.days.length === 7
                            ? "Every day"
                            : reminder.days.map((d) => daysOfWeek.find((day) => day.id === d)?.label).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={reminder.enabled} onCheckedChange={() => handleToggleReminder(reminder.id)} />

                    <Dialog
                      open={isEditDialogOpen && currentReminder?.id === reminder.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setCurrentReminder(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentReminder(reminder)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Reminder</DialogTitle>
                          <DialogDescription>Make changes to your reminder</DialogDescription>
                        </DialogHeader>
                        {currentReminder && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">Reminder Title</Label>
                              <Input
                                id="edit-title"
                                value={currentReminder.title}
                                onChange={(e) => setCurrentReminder({ ...currentReminder, title: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-type">Reminder Type</Label>
                              <Select
                                value={currentReminder.type}
                                onValueChange={(value: Reminder["type"]) =>
                                  setCurrentReminder({ ...currentReminder, type: value })
                                }
                              >
                                <SelectTrigger id="edit-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="workout">Workout</SelectItem>
                                  <SelectItem value="meal">Meal</SelectItem>
                                  <SelectItem value="water">Water</SelectItem>
                                  <SelectItem value="weight">Weight</SelectItem>
                                  <SelectItem value="sleep">Sleep</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-time">Time</Label>
                              <Input
                                id="edit-time"
                                type="time"
                                value={currentReminder.time}
                                onChange={(e) => setCurrentReminder({ ...currentReminder, time: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Repeat on days</Label>
                              <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day) => (
                                  <div key={day.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-day-${day.id}`}
                                      checked={currentReminder.days.includes(day.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setCurrentReminder({
                                            ...currentReminder,
                                            days: [...currentReminder.days, day.id],
                                          })
                                        } else {
                                          setCurrentReminder({
                                            ...currentReminder,
                                            days: currentReminder.days.filter((d) => d !== day.id),
                                          })
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`edit-day-${day.id}`}>{day.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-sound">Alert Sound</Label>
                              <Select
                                value={currentReminder.sound}
                                onValueChange={(value) => {
                                  setCurrentReminder({ ...currentReminder, sound: value })
                                  playSound(value)
                                }}
                              >
                                <SelectTrigger id="edit-sound">
                                  <SelectValue placeholder="Select sound" />
                                </SelectTrigger>
                                <SelectContent>
                                  {reminderSounds.map((sound) => (
                                    <SelectItem key={sound.id} value={sound.id}>
                                      {sound.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                id="edit-enabled"
                                checked={currentReminder.enabled}
                                onCheckedChange={(checked) =>
                                  setCurrentReminder({ ...currentReminder, enabled: checked })
                                }
                              />
                              <Label htmlFor="edit-enabled">Enable reminder</Label>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (currentReminder) {
                                handleDeleteReminder(currentReminder.id)
                                setIsEditDialogOpen(false)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditReminder}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(reminder.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No reminders found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  {activeTab === "all"
                    ? "You haven't created any reminders yet. Click 'Add Reminder' to get started."
                    : `You don't have any ${activeTab} reminders. Try creating one or switching to a different category.`}
                </p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <h4 className="font-medium">About Reminders</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Reminders will appear as notifications on your device. Make sure notifications are enabled in your device
          settings for the FitLife app.
        </p>
      </CardFooter>
    </Card>
  )
}

