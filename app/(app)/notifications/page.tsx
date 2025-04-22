"use client"

import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Settings, CheckCircle, Clock, BellOff, Trash2, CheckCheck, Zap, BookOpen, MessageSquare, Award } from "lucide-react"
import { useNotifications } from "@/components/notifications/notification-provider"
import { useState } from "react"

// Define the allowed filter types
type NotificationFilter = "all" | "unread" | "workouts" | "nutrition" | "achievements";

// Metadata has been moved to layout.tsx

export default function NotificationsPage() {
  const { markAllAsRead, clearNotifications } = useNotifications()
  // Use the specific type for state
  const [activeTab, setActiveTab] = useState<NotificationFilter>("all")

  // Quick settings state (consider moving to a separate component)
  const [quickSettings, setQuickSettings] = useState({
    workoutPush: true,
    workoutEmail: true,
    nutritionPush: true,
    nutritionEmail: true,
    achievementPush: true,
    achievementEmail: true,
    socialPush: false,
    socialEmail: false,
  })

  const handleQuickSettingChange = (id: keyof typeof quickSettings, checked: boolean) => {
    setQuickSettings(prev => ({ ...prev, [id]: checked }))
    // In a real app, you would save these preferences to the user's profile
    console.log(`Setting ${id} changed to ${checked}`)
  }

  const handleSavePreferences = () => {
    // Logic to save the quickSettings state to the database
    console.log("Saving preferences:", quickSettings)
    // Show a toast message on success/error
  }

  // Type the value parameter explicitly in onValueChange
  const handleTabChange = (value: string) => {
     // Ensure the value is one of the allowed filter types before setting state
    if ([ "all", "unread", "workouts", "nutrition", "achievements"].includes(value)) {
      setActiveTab(value as NotificationFilter);
    } else {
      // Default to 'all' or handle unexpected values appropriately
      setActiveTab("all");
    }
  }

  return (
    <DashboardShell className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
      <div className="relative mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-xl shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.7,-57.2C59.5,-45.9,65.8,-29.4,68.9,-12.5C72,4.4,71.9,21.7,63.6,34.5C55.4,47.4,39,55.7,21.8,63.3C4.6,70.9,-13.4,77.8,-30.2,74C-47,70.2,-62.6,55.8,-70.9,38.2C-79.3,20.6,-80.4,-0.3,-74.6,-18.9C-68.9,-37.5,-56.2,-53.8,-41.3,-64.6C-26.4,-75.3,-9.4,-80.4,4.2,-85.4C17.8,-90.4,35.9,-95.3,47.7,-87.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold mb-2">Notifications Center</h1>
          <p className="text-lg opacity-90 max-w-2xl">Stay updated with your fitness progress, upcoming workouts, and achievements</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Card className="border-indigo-100 dark:border-indigo-900 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>View and manage your notifications</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-950 dark:hover:text-indigo-300">
                  <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
                </Button>
                <Button variant="outline" size="sm" onClick={clearNotifications} className="border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All
                </Button>
              </div>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6 pt-2">
                <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                    <div className="flex items-center">
                      Unread
                      <Badge className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white">3</Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="workouts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                    Workouts
                  </TabsTrigger>
                  <TabsTrigger value="nutrition" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                    Nutrition
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                    Achievements
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-4">
                <NotificationCenter filter={activeTab} />
              </CardContent>
            </Tabs>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Zap className="h-5 w-5" />
                  <CardTitle className="text-lg">Workout Reminders</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Never miss your scheduled exercise sessions</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workout-push" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Push Alerts</span>
                    </Label>
                    <Switch 
                      id="workout-push" 
                      checked={quickSettings.workoutPush}
                      onCheckedChange={(checked) => handleQuickSettingChange('workoutPush', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workout-email" className="flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Calendar</span>
                    </Label>
                    <Switch 
                      id="workout-email" 
                      checked={quickSettings.workoutEmail}
                      onCheckedChange={(checked) => handleQuickSettingChange('workoutEmail', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-100 dark:border-green-800 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle className="text-lg">Nutrition Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Stay on track with your nutrition goals</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="nutrition-push" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Push Alerts</span>
                    </Label>
                    <Switch 
                      id="nutrition-push" 
                      checked={quickSettings.nutritionPush}
                      onCheckedChange={(checked) => handleQuickSettingChange('nutritionPush', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="nutrition-email" className="flex items-center gap-2 cursor-pointer">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Meal Times</span>
                    </Label>
                    <Switch 
                      id="nutrition-email" 
                      checked={quickSettings.nutritionEmail}
                      onCheckedChange={(checked) => handleQuickSettingChange('nutritionEmail', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-100 dark:border-amber-800 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Award className="h-5 w-5" />
                  <CardTitle className="text-lg">Achievement Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Celebrate your fitness milestones</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="achievement-push" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Push Alerts</span>
                    </Label>
                    <Switch 
                      id="achievement-push" 
                      checked={quickSettings.achievementPush}
                      onCheckedChange={(checked) => handleQuickSettingChange('achievementPush', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="achievement-email" className="flex items-center gap-2 cursor-pointer">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Milestones</span>
                    </Label>
                    <Switch 
                      id="achievement-email" 
                      checked={quickSettings.achievementEmail}
                      onCheckedChange={(checked) => handleQuickSettingChange('achievementEmail', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
              <CardTitle>Quick Preferences</CardTitle>
              <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Social Interactions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="social-push" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Push Notifications</span>
                    </Label>
                    <Switch 
                      id="social-push" 
                      checked={quickSettings.socialPush}
                      onCheckedChange={(checked) => handleQuickSettingChange('socialPush', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="social-email" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Email Updates</span>
                    </Label>
                    <Switch 
                      id="social-email" 
                      checked={quickSettings.socialEmail}
                      onCheckedChange={(checked) => handleQuickSettingChange('socialEmail', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Quiet Hours</h3>
                  <Switch id="quiet-hours" />
                </div>
                <p className="text-xs text-muted-foreground">Silence notifications between 10 PM and 7 AM</p>
              </div>
              
              <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Mute All Notifications</h3>
                  <Switch id="mute-all" />
                </div>
                <p className="text-xs text-muted-foreground">Temporarily silence all notifications</p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 dark:bg-gray-900">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700" onClick={handleSavePreferences}>
                Save All Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-indigo-100 dark:border-indigo-900 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>How you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Mobile Push</p>
                      <p className="text-xs text-muted-foreground">Instant alerts on your phone</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">Daily or weekly digests</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">In-app</p>
                      <p className="text-xs text-muted-foreground">Notifications within the app</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 dark:bg-gray-900">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings/notifications">
                  <Settings className="mr-2 h-4 w-4" /> Advanced Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

