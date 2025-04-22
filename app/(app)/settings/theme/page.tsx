import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Moon, Sun, Monitor, Palette, Check, CircleOff, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export const metadata: Metadata = {
  title: "Theme & Display Settings - FitLife",
  description: "Customize the appearance of your FitLife application",
}

export default async function ThemeSettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <DashboardShell className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Theme & Display</h1>
          <p className="text-muted-foreground">Customize the appearance of your fitness app</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Theme Settings
            </CardTitle>
            <CardDescription>Choose your preferred theme and appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Color Mode</h3>
              <RadioGroup defaultValue="system" className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <span>Light</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                    <Moon className="h-4 w-4 text-indigo-400" />
                    <span>Dark</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                    <Monitor className="h-4 w-4 text-blue-500" />
                    <span>System</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Accent Color</h3>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { name: "Default", color: "bg-blue-600" },
                  { name: "Purple", color: "bg-purple-600" },
                  { name: "Green", color: "bg-green-600" },
                  { name: "Orange", color: "bg-orange-600" },
                  { name: "Red", color: "bg-red-600" },
                  { name: "Teal", color: "bg-teal-600" },
                ].map((accent) => (
                  <div key={accent.name} className="text-center">
                    <button
                      className={`h-8 w-8 rounded-full ${accent.color} hover:ring-2 hover:ring-offset-2 mx-auto flex items-center justify-center`}
                      aria-label={`${accent.name} theme`}
                      title={accent.name}
                      onClick={() => toast({ title: "Accent color changed", description: `Theme set to ${accent.name}` })}
                    >
                      {accent.name === "Default" && <Check className="h-4 w-4 text-white" />}
                    </button>
                    <span className="text-xs mt-1 block">{accent.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Contrast</h3>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Default</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => toast({ title: "Theme settings saved", description: "Your theme preferences have been updated" })}
            >
              Save Theme Settings
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>Customize your display preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations throughout the app</p>
                </div>
                <Switch id="reduced-motion" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-xs text-muted-foreground">Increase contrast for better readability</p>
                </div>
                <Switch id="high-contrast" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="larger-text">Larger Text</Label>
                  <p className="text-xs text-muted-foreground">Increase the font size throughout the app</p>
                </div>
                <Switch id="larger-text" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-view">Compact View</Label>
                  <p className="text-xs text-muted-foreground">Reduce spacing to fit more content on screen</p>
                </div>
                <Switch id="compact-view" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => toast({ title: "Display settings saved", description: "Your display preferences have been updated" })}
              >
                Save Display Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleOff className="h-5 w-5 text-primary" />
                Focus Mode
              </CardTitle>
              <CardDescription>Reduce distractions while you work out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-focus">Enable Focus Mode</Label>
                  <p className="text-xs text-muted-foreground">Automatically during workouts</p>
                </div>
                <Switch id="enable-focus" />
              </div>
              
              <div className="space-y-2">
                <Label>Focus Mode Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="hide-notifications" className="mr-2" />
                    <Label htmlFor="hide-notifications" className="text-sm">Hide notifications</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="simplify-ui" className="mr-2" />
                    <Label htmlFor="simplify-ui" className="text-sm">Simplify user interface</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="dark-mode" className="mr-2" />
                    <Label htmlFor="dark-mode" className="text-sm">Force dark mode</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="disable-social" className="mr-2" />
                    <Label htmlFor="disable-social" className="text-sm">Hide social features</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: "Focus mode activated", description: "Focus mode will activate during your next workout" })}
              >
                Try Focus Mode Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
} 