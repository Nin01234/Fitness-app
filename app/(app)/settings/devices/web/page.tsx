import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Bell, Shield, ArrowLeft, Trash2, Monitor } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Web Device Settings - FitLife",
  description: "Manage your web device settings for FitLife",
}

export default function WebDeviceSettingsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </Button>
      </div>

      <DashboardHeader heading="Web Device Settings" text="Manage how FitLife works on your web browser" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Monitor className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Chrome on MacBook Pro</CardTitle>
                <CardDescription>Last active: Today at 3:15 PM</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Device Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Browser</p>
                  <p className="font-medium">Google Chrome 112.0.5615.49</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operating System</p>
                  <p className="font-medium">macOS 13.3.1</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Screen Resolution</p>
                  <p className="font-medium">2560 x 1600</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Device ID</p>
                  <p className="font-medium">FLW-9876543210</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="browser-notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Browser Notifications</span>
                  </Label>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-alerts" className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Sound Alerts</span>
                  </Label>
                  <Switch id="sound-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="tab-notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Tab Notifications</span>
                  </Label>
                  <Switch id="tab-notifications" defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Browser Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remember-login" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Remember Login</span>
                  </Label>
                  <Switch id="remember-login" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cache-workouts" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Cache Workout Data</span>
                  </Label>
                  <Switch id="cache-workouts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-performance" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>High Performance Mode</span>
                  </Label>
                  <Switch id="high-performance" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Privacy & Security</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cookies" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Allow Cookies</span>
                  </Label>
                  <Switch id="cookies" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="local-storage" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Use Local Storage</span>
                  </Label>
                  <Switch id="local-storage" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="web-analytics" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Share Web Analytics</span>
                  </Label>
                  <Switch id="web-analytics" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="text-red-500" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Device
            </Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}

