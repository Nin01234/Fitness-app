import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Smartphone, Bell, Battery, Wifi, Shield, ArrowLeft, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Mobile Device Settings - FitLife",
  description: "Manage your mobile device settings for FitLife",
}

export default function MobileDeviceSettingsPage() {
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

      <DashboardHeader heading="Mobile Device Settings" text="Manage how FitLife works on your mobile device" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>iPhone 13 Pro</CardTitle>
                <CardDescription>Last active: Today at 2:45 PM</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Device Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Device Model</p>
                  <p className="font-medium">iPhone 13 Pro</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operating System</p>
                  <p className="font-medium">iOS 16.5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">App Version</p>
                  <p className="font-medium">FitLife 2.4.1</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Device ID</p>
                  <p className="font-medium">FLM-1234567890</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Push Notifications</span>
                  </Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="workout-reminders" className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Workout Reminders</span>
                  </Label>
                  <Switch id="workout-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="nutrition-reminders" className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Nutrition Reminders</span>
                  </Label>
                  <Switch id="nutrition-reminders" defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data & Storage</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="offline-mode" className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span>Offline Mode</span>
                  </Label>
                  <Switch id="offline-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="background-sync" className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span>Background Sync</span>
                  </Label>
                  <Switch id="background-sync" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="battery-saver" className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-muted-foreground" />
                    <span>Battery Saver Mode</span>
                  </Label>
                  <Switch id="battery-saver" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Privacy & Security</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="biometric-login" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Biometric Login (Face ID)</span>
                  </Label>
                  <Switch id="biometric-login" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="location-services" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Location Services</span>
                  </Label>
                  <Switch id="location-services" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Share Analytics</span>
                  </Label>
                  <Switch id="analytics" defaultChecked />
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

