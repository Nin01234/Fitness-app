"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bell, Mail, Smartphone, Activity, Calendar, Clock, CheckCircle, Battery, Vibrate, Volume2, MessageSquare } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useNotifications } from "@/components/notifications/notification-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"

export default function NotificationsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { addNotification } = useNotifications()
  const [isSaving, setIsSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    email: {
      workoutReminders: true,
      weeklyProgress: true,
      newFeatures: true,
      specialOffers: false,
    },
    push: {
      enabled: true,
      workoutReminders: true,
      goalAchievements: true,
      friendActivity: true,
      systemUpdates: true,
      inactivityAlerts: true,
    },
    inApp: {
      workoutSuggestions: true,
      streakNotifications: true,
      challengeUpdates: true,
      nutritionReminders: false,
    },
    sound: {
      enabled: true,
      workoutStart: true,
      workoutComplete: true,
      restTimers: true,
      achievements: true,
      volume: 70,
    },
    schedules: {
      quietHoursEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      weekdaysOnly: false,
    }
  })

  useEffect(() => {
    // In a real app, we would fetch the user's notification settings from the database
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Simulating a fetch from the database
          // In a real app, this would be a call to your API
          console.log("Fetched notification settings for user:", user.id)
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)
    
    try {
      // In a real app, we would send the settings to the server
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      })
      
      // Show a sample notification using the notification system
      addNotification({
        id: Date.now().toString(),
        title: "Settings Updated",
        message: "Your notification preferences have been saved successfully.",
        type: "success",
        read: false,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("Error saving notification settings:", error)
      toast({
        title: "Error",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "This browser does not support desktop notifications.",
        variant: "destructive",
      })
      return
    }
    
    if (Notification.permission === "granted") {
      toast({
        title: "Notifications already enabled",
        description: "Push notifications are already enabled for this site.",
      })
      return
    }
    
    try {
      const permission = await Notification.requestPermission()
      
      if (permission === "granted") {
        setSettings({
          ...settings,
          push: {
            ...settings.push,
            enabled: true,
          },
        })
        
        toast({
          title: "Notifications enabled",
          description: "You will now receive push notifications from FitLife.",
        })
        
        // Show a test notification
        const notification = new Notification("Notifications Enabled", {
          body: "You will now receive important updates from FitLife.",
          icon: "/logo.png",
        })
      } else {
        toast({
          title: "Permission denied",
          description: "You have denied permission for push notifications.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Error",
        description: "Could not request notification permission.",
        variant: "destructive",
      })
    }
  }

  const testNotification = (type) => {
    let title, message
    
    switch (type) {
      case 'workout':
        title = "Workout Reminder"
        message = "It's time for your scheduled HIIT workout."
        break
      case 'achievement':
        title = "Achievement Unlocked!"
        message = "You've completed 10 workouts this month! 🏆"
        break
      case 'streak':
        title = "Streak Milestone"
        message = "You're on a 7-day streak! Keep going strong! 🔥"
        break
      case 'nutrition':
        title = "Nutrition Reminder"
        message = "Don't forget to log your lunch for better tracking."
        break
      default:
        title = "Test Notification"
        message = "This is a test notification from FitLife."
    }
    
    addNotification({
      id: Date.now().toString(),
      title,
      message,
      type: type === 'achievement' ? 'success' : type === 'workout' ? 'info' : 'default',
      read: false,
      timestamp: new Date(),
    })
    
    if (settings.push.enabled && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: message,
        icon: "/logo.png",
      })
      
      if (settings.sound.enabled) {
        const audio = new Audio("/sounds/notification.mp3")
        audio.volume = settings.sound.volume / 100
        audio.play().catch(e => console.error("Could not play notification sound:", e))
      }
    }
    
    toast({
      title: "Test notification sent",
      description: "Check your notifications panel to see it.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Notification Settings" text="Manage how and when you receive notifications">
        <Button variant="outline" asChild>
          <Link href="/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </DashboardHeader>
      
      <Tabs defaultValue="push" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="push" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Push
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="inapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            In-App
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="push" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>
                    Receive notifications on your device even when the app is closed
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.push.enabled}
                    onCheckedChange={(checked) => {
                      if (checked && Notification.permission !== "granted") {
                        requestPushPermission()
                      } else {
                        setSettings({
                          ...settings,
                          push: {
                            ...settings.push,
                            enabled: checked,
                          },
                        })
                      }
                    }}
                  />
                  <Label>Enabled</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Workout Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Get reminded about scheduled workouts
                      </div>
                    </div>
                  </div>
                  <Switch
                    disabled={!settings.push.enabled}
                    checked={settings.push.workoutReminders}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        push: {
                          ...settings.push,
                          workoutReminders: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Goal Achievements</div>
                      <div className="text-sm text-muted-foreground">
                        Celebrate when you reach your fitness goals
                      </div>
                    </div>
                  </div>
                  <Switch
                    disabled={!settings.push.enabled}
                    checked={settings.push.goalAchievements}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        push: {
                          ...settings.push,
                          goalAchievements: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Inactivity Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Get reminded when you haven't logged a workout
                      </div>
                    </div>
                  </div>
                  <Switch
                    disabled={!settings.push.enabled}
                    checked={settings.push.inactivityAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        push: {
                          ...settings.push,
                          inactivityAlerts: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Push notifications may affect battery life and data usage.
              </div>
              <Button onClick={() => testNotification('workout')} variant="outline">
                Send Test Notification
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Sounds</CardTitle>
              <CardDescription>
                Configure audio alerts for notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Notification Sounds</div>
                    <div className="text-sm text-muted-foreground">
                      Play sounds when you receive notifications
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.sound.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      sound: {
                        ...settings.sound,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="volume">Sound Volume</Label>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sound.volume}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sound: {
                          ...settings.sound,
                          volume: parseInt(e.target.value),
                        },
                      })
                    }
                    disabled={!settings.sound.enabled}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm">{settings.sound.volume}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which emails you receive from FitLife
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Workout Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Get email reminders for scheduled workouts
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.email.workoutReminders}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        email: {
                          ...settings.email,
                          workoutReminders: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Weekly Progress Reports</div>
                      <div className="text-sm text-muted-foreground">
                        Receive a summary of your weekly fitness activity
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.email.weeklyProgress}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        email: {
                          ...settings.email,
                          weeklyProgress: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">New Features & Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Stay informed about new app features and updates
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.email.newFeatures}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        email: {
                          ...settings.email,
                          newFeatures: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Promotional Emails</div>
                      <div className="text-sm text-muted-foreground">
                        Receive special offers and promotions
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.email.specialOffers}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        email: {
                          ...settings.email,
                          specialOffers: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast({ title: "Email preferences updated", description: "Your email notification settings have been saved." })} variant="outline">
                Update Email Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Configure notifications you receive while using the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Workout Suggestions</div>
                      <div className="text-sm text-muted-foreground">
                        Receive personalized workout recommendations
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.inApp.workoutSuggestions}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        inApp: {
                          ...settings.inApp,
                          workoutSuggestions: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Streak Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified about your workout streaks and milestones
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.inApp.streakNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        inApp: {
                          ...settings.inApp,
                          streakNotifications: checked,
                        },
                      })
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Challenge Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Get updates on fitness challenges you're participating in
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.inApp.challengeUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        inApp: {
                          ...settings.inApp,
                          challengeUpdates: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button onClick={() => testNotification('achievement')} variant="outline" size="sm">
                  Test Achievement
                </Button>
                <Button onClick={() => testNotification('streak')} variant="outline" size="sm">
                  Test Streak
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>
                Set times when you don't want to be disturbed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Enable Quiet Hours</div>
                    <div className="text-sm text-muted-foreground">
                      Pause notifications during specified hours
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.schedules.quietHoursEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      schedules: {
                        ...settings.schedules,
                        quietHoursEnabled: checked,
                      },
                    })
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <input
                    id="quiet-start"
                    type="time"
                    value={settings.schedules.quietHoursStart}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        schedules: {
                          ...settings.schedules,
                          quietHoursStart: e.target.value,
                        },
                      })
                    }
                    disabled={!settings.schedules.quietHoursEnabled}
                    className="w-full h-10 px-3 py-2 bg-background text-foreground rounded-md border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <input
                    id="quiet-end"
                    type="time"
                    value={settings.schedules.quietHoursEnd}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        schedules: {
                          ...settings.schedules,
                          quietHoursEnd: e.target.value,
                        },
                      })
                    }
                    disabled={!settings.schedules.quietHoursEnabled}
                    className="w-full h-10 px-3 py-2 bg-background text-foreground rounded-md border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="weekdays-only"
                  type="checkbox"
                  checked={settings.schedules.weekdaysOnly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      schedules: {
                        ...settings.schedules,
                        weekdaysOnly: e.target.checked,
                      },
                    })
                  }
                  disabled={!settings.schedules.quietHoursEnabled}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="weekdays-only">
                  Apply quiet hours on weekdays only
                </Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Settings</CardTitle>
              <CardDescription>
                Configure how notifications work on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Battery Optimization</div>
                    <div className="text-sm text-muted-foreground">
                      Reduce notification frequency when battery is low
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Vibration</div>
                    <div className="text-sm text-muted-foreground">
                      Enable vibration for notifications
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Mobile Data Usage</div>
                    <div className="text-sm text-muted-foreground">
                      Download notification content on mobile data
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </DashboardShell>
  )
} 