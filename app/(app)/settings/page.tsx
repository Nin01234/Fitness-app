import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Settings,
  Bell,
  Smartphone,
  Moon,
  Palette,
  Lock,
  Shield,
  HelpCircle,
  Search,
  Watch,
  Laptop,
  Bluetooth,
  Loader2,
  Wifi,
  Activity,
  FileText,
  Users,
} from "lucide-react"
import { AppCreators } from "@/components/app-creators"
import { BluetoothDeviceList } from "@/components/bluetooth-device-list"

export const metadata: Metadata = {
  title: "Settings - FitLife",
  description: "Manage your app settings and preferences",
}

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <DashboardShell className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
      <div className="relative mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-xl shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.7,-57.2C59.5,-45.9,65.8,-29.4,68.9,-12.5C72,4.4,71.9,21.7,63.6,34.5C55.4,47.4,39,55.7,21.8,63.3C4.6,70.9,-13.4,77.8,-30.2,74C-47,70.2,-62.6,55.8,-70.9,38.2C-79.3,20.6,-80.4,-0.3,-74.6,-18.9C-68.9,-37.5,-56.2,-53.8,-41.3,-64.6C-26.4,-75.3,-9.4,-80.4,4.2,-85.4C17.8,-90.4,35.9,-95.3,47.7,-87.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold mb-2">App Settings</h1>
          <p className="text-lg opacity-90 max-w-2xl">Customize your FitLife experience to match your preferences and needs</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> General
            </div>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Display
            </div>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </div>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Privacy
            </div>
          </TabsTrigger>
          <TabsTrigger value="help" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> Support
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Customize how the app works for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form action="/api/settings/general" method="POST" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="units">Measurement Units</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred measurement system</p>
                      </div>
                      <select id="units" name="units" className="rounded-md border p-2 text-sm">
                        <option>Metric (kg, cm)</option>
                        <option>Imperial (lb, in)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="language">Language</Label>
                        <p className="text-sm text-muted-foreground">Set your preferred language</p>
                      </div>
                      <select id="language" name="language" className="rounded-md border p-2 text-sm">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <p className="text-sm text-muted-foreground">Set your local time zone</p>
                      </div>
                      <select id="timezone" name="timezone" className="rounded-md border p-2 text-sm">
                        <option>UTC-08:00 (Pacific Time)</option>
                        <option>UTC-05:00 (Eastern Time)</option>
                        <option>UTC+00:00 (GMT)</option>
                        <option>UTC+01:00 (Central European Time)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">App Behavior</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-track">Auto-track workouts</Label>
                        <Switch id="auto-track" name="auto_track" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-sync">Sync with fitness devices</Label>
                        <Switch id="auto-sync" name="auto_sync" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-backup">Auto backup data</Label>
                        <Switch id="auto-backup" name="auto_backup" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Save Preferences
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Connections</CardTitle>
                <CardDescription>Connect your fitness devices for real-time tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">iPhone 13 Pro • Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/settings/devices/mobile">Manage</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Watch className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Fitness Watch</p>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">Apple Watch Ultra • </span>
                          <span className="flex items-center text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            Live
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Activity className="h-3 w-3 mr-1 text-green-500" />
                            <span>HR: 72 bpm</span>
                          </div>
                          <div className="flex items-center">
                            <Wifi className="h-3 w-3 mr-1 text-green-500" />
                            <span>Steps: 8,432</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/settings/devices/watch">Manage</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Web App</p>
                        <p className="text-sm text-muted-foreground">Chrome on MacBook Pro • Active</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/settings/devices/web">Manage</Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Connect a New Device</h3>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 blur-sm animate-pulse"></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-full p-3">
                          <Bluetooth className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium">Scan for Nearby Devices</h4>
                        <p className="text-sm text-muted-foreground mb-4">Make sure your device is in pairing mode</p>
                        <BluetoothDeviceList />
                      </div>
                      <div className="text-center mt-2 w-full">
                        <div className="flex items-center justify-center mb-3">
                          <div className="h-px bg-gray-200 dark:bg-gray-700 w-full"></div>
                          <span className="px-2 text-xs text-muted-foreground">OR</span>
                          <div className="h-px bg-gray-200 dark:bg-gray-700 w-full"></div>
                        </div>
                        <p className="text-sm font-medium mb-2">Enter code manually:</p>
                        <div className="flex gap-2 justify-center">
                          <Input className="w-12 h-12 text-center text-lg font-bold" maxLength={1} />
                          <Input className="w-12 h-12 text-center text-lg font-bold" maxLength={1} />
                          <Input className="w-12 h-12 text-center text-lg font-bold" maxLength={1} />
                          <Input className="w-12 h-12 text-center text-lg font-bold" maxLength={1} />
                          <Input className="w-12 h-12 text-center text-lg font-bold" maxLength={1} />
                          <Input className="w-12 h-12 text-center text-lg font-bold" maxLength={1} />
                        </div>
                      </div>
                      <Button className="w-full mt-2 relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 group">
                        <div className="absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 transform translate-y-full group-hover:translate-y-0 ease">
                          <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Scanning...</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 transform group-hover:-translate-y-full ease">
                          <div className="flex items-center">
                            <Bluetooth className="mr-2 h-4 w-4" />
                            <span>Start Device Scan</span>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Data Synchronization</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="offline-mode">Offline Mode</Label>
                      <Switch id="offline-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-saver">Data Saver</Label>
                      <Switch id="data-saver" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="background-sync">Background Sync</Label>
                      <Switch id="background-sync" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/settings/devices">Manage All Devices</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action="/api/settings/appearance" method="POST" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-background">
                        <input type="radio" name="theme" value="light" className="sr-only" defaultChecked />
                        <Moon className="h-6 w-6" />
                      </label>
                      <Label className="text-center">Light</Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-background dark:bg-gray-950">
                        <input type="radio" name="theme" value="dark" className="sr-only" />
                        <Moon className="h-6 w-6" />
                      </label>
                      <Label className="text-center">Dark</Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-gradient-to-br from-gray-100 to-gray-900">
                        <input type="radio" name="theme" value="system" className="sr-only" />
                        <Moon className="h-6 w-6" />
                      </label>
                      <Label className="text-center">System</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Color Scheme</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500">
                        <input type="radio" name="color_scheme" value="green" className="sr-only" defaultChecked />
                      </label>
                      <Label className="text-center">Green</Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-500">
                        <input type="radio" name="color_scheme" value="blue" className="sr-only" />
                      </label>
                      <Label className="text-center">Blue</Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-purple-500">
                        <input type="radio" name="color_scheme" value="purple" className="sr-only" />
                      </label>
                      <Label className="text-center">Purple</Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-orange-500">
                        <input type="radio" name="color_scheme" value="orange" className="sr-only" />
                      </label>
                      <Label className="text-center">Orange</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Font Size</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Small</Label>
                      <input type="radio" name="font_size" value="small" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Medium</Label>
                      <input type="radio" name="font_size" value="medium" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Large</Label>
                      <input type="radio" name="font_size" value="large" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Layout Density</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Compact</Label>
                      <input type="radio" name="layout_density" value="compact" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Comfortable</Label>
                      <input type="radio" name="layout_density" value="comfortable" defaultChecked />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Apply Theme Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action="/api/settings/notifications" method="POST" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-workout">Workout Reminders</Label>
                      <Switch id="email-workout" name="email_workout" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-nutrition">Nutrition Reminders</Label>
                      <Switch id="email-nutrition" name="email_nutrition" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-goals">Goal Updates</Label>
                      <Switch id="email-goals" name="email_goals" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-achievements">Achievement Alerts</Label>
                      <Switch id="email-achievements" name="email_achievements" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-newsletter">Weekly Newsletter</Label>
                      <Switch id="email-newsletter" name="email_newsletter" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-workout">Workout Reminders</Label>
                      <Switch id="push-workout" name="push_workout" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-nutrition">Nutrition Reminders</Label>
                      <Switch id="push-nutrition" name="push_nutrition" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-goals">Goal Updates</Label>
                      <Switch id="push-goals" name="push_goals" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-achievements">Achievement Alerts</Label>
                      <Switch id="push-achievements" name="push_achievements" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-social">Social Interactions</Label>
                      <Switch id="push-social" name="push_social" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Schedule</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                        <Input
                          type="time"
                          id="quiet-start"
                          name="quiet_start"
                          className="mt-1 w-full"
                          defaultValue="22:00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quiet-end">Quiet Hours End</Label>
                        <Input
                          type="time"
                          id="quiet-end"
                          name="quiet_end"
                          className="mt-1 w-full"
                          defaultValue="07:00"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="weekend-different"
                        name="weekend_different"
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="weekend-different" className="text-sm">
                        Use different schedule on weekends
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Update Notification Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action="/api/settings/privacy" method="POST" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Profile Visibility</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="profile-visibility">Who can see your profile</Label>
                      <select
                        id="profile-visibility"
                        name="profile_visibility"
                        className="rounded-md border p-2 text-sm"
                      >
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="activity-visibility">Who can see your activity</Label>
                      <select
                        id="activity-visibility"
                        name="activity_visibility"
                        className="rounded-md border p-2 text-sm"
                      >
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="progress-visibility">Who can see your progress</Label>
                      <select
                        id="progress-visibility"
                        name="progress_visibility"
                        className="rounded-md border p-2 text-sm"
                      >
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Data Usage</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="analytics"
                        name="analytics"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="analytics" className="text-sm">
                        Allow anonymous usage analytics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="personalization"
                        name="personalization"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="personalization" className="text-sm">
                        Allow personalized recommendations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="marketing" name="marketing" className="rounded border-gray-300" />
                      <Label htmlFor="marketing" className="text-sm">
                        Receive marketing communications
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Account Security</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2" asChild>
                      <Link href="/settings/security/password">
                        <Lock className="h-4 w-4" /> Change Password
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2" asChild>
                      <Link href="/settings/security/2fa">
                        <Shield className="h-4 w-4" /> Two-Factor Authentication
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Legal & Acknowledgments</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2" asChild>
                      <Link href="/terms">
                        <FileText className="h-4 w-4" /> Terms & Conditions
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2" asChild>
                      <Link href="/about/acknowledgments">
                        <Users className="h-4 w-4" /> Team Acknowledgments
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Data Management</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/settings/data/export">Download My Data</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-red-500 hover:text-red-600" asChild>
                      <Link href="/settings/data/delete">Delete My Account</Link>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Privacy Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Support Center</CardTitle>
              <CardDescription>Get help with your fitness journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search help articles..." className="pl-8" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Quick Help</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/help/getting-started">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full p-1 mr-2">
                          1
                        </span>
                        Getting Started Guide
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/help/workout-tracking">
                        <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full p-1 mr-2">
                          2
                        </span>
                        Workout Tracking Tutorial
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/help/nutrition-tracking">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full p-1 mr-2">
                          3
                        </span>
                        Nutrition Tracking Guide
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link href="/help/progress-tracking">
                        <span className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full p-1 mr-2">
                          4
                        </span>
                        Progress Tracking Tips
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contact Support</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium mb-2">Live Chat Support</h4>
                      <p className="text-sm text-muted-foreground mb-3">Available Monday-Friday, 9am-5pm EST</p>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Start Live Chat</Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium mb-2">Email Support</h4>
                      <p className="text-sm text-muted-foreground mb-3">Response within 24 hours</p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/help/contact">Send Email</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Troubleshooting</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/help/report-bug">Report a Bug</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/help/feature-request">Feature Request</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/help/faq">Frequently Asked Questions</Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">About</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/help/about">About FitLife</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/terms">Terms of Service</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/help/privacy">Privacy Policy</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/about/acknowledgments">Team Acknowledgments</Link>
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <AppCreators />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

