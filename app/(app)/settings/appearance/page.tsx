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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Moon, Sun, Monitor, Palette, Check, CircleOff, Eye, Zap, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function AppearancePage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    theme: "system",
    colorScheme: "default",
    fontSize: 1,
    reducedMotion: false,
    highContrast: false,
    focusMode: false,
    compactMode: false,
    enableAnimations: true,
    customAccentColor: "#0ea5e9",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/appearance')
        if (response.ok) {
          const data = await response.json()
          if (data.settings) {
            setSettings({
              ...settings,
              ...data.settings,
              // Convert fontSize from string to number if needed
              fontSize: typeof data.settings.fontSize === 'string' ? 
                (data.settings.fontSize === 'small' ? 0 : data.settings.fontSize === 'medium' ? 1 : 2) : 
                data.settings.fontSize,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching appearance settings:", error)
      }
    }

    fetchSettings()
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/settings/appearance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          // Convert fontSize from number to string if API expects it
          fontSize: settings.fontSize === 0 ? 'small' : settings.fontSize === 1 ? 'medium' : 'large',
        }),
      })
      
      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Your appearance settings have been updated.",
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error("Error saving appearance settings:", error)
      toast({
        title: "Error",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Appearance" text="Customize your app theme and display settings">
        <Button variant="outline" asChild>
          <Link href="/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-8">
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="theme">
              <Palette className="mr-2 h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Eye className="mr-2 h-4 w-4" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Zap className="mr-2 h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Sparkles className="mr-2 h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Preference</CardTitle>
                <CardDescription>Adjust the app theme and appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="font-medium">Color Theme</div>
                  <RadioGroup 
                    defaultValue={settings.theme}
                    value={settings.theme}
                    onValueChange={(value) => setSettings({...settings, theme: value})}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="light" 
                        id="theme-light" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="mb-3 h-6 w-6" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="dark" 
                        id="theme-dark" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="system" 
                        id="theme-system" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Monitor className="mb-3 h-6 w-6" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="font-medium">Color Scheme</div>
                  <RadioGroup 
                    defaultValue={settings.colorScheme} 
                    value={settings.colorScheme}
                    onValueChange={(value) => setSettings({...settings, colorScheme: value})}
                    className="grid grid-cols-4 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="default" 
                        id="color-default" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="color-default"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="mb-3 h-6 w-6 rounded-full bg-blue-500" />
                        Default
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="purple" 
                        id="color-purple" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="color-purple"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="mb-3 h-6 w-6 rounded-full bg-purple-500" />
                        Purple
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="green" 
                        id="color-green" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="color-green"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="mb-3 h-6 w-6 rounded-full bg-green-500" />
                        Green
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="orange" 
                        id="color-orange" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="color-orange"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="mb-3 h-6 w-6 rounded-full bg-orange-500" />
                        Orange
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="font-medium">Custom Accent Color</div>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.customAccentColor}
                      onChange={(e) => setSettings({...settings, customAccentColor: e.target.value})}
                      className="h-10 w-10 cursor-pointer rounded-md border-0"
                    />
                    <div className="text-sm text-muted-foreground">
                      {settings.customAccentColor.toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>Make the app easier to use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="font-medium">Font Size</div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label htmlFor="font-size">Adjust text size</Label>
                      <span className="text-sm text-muted-foreground">
                        {settings.fontSize === 0 ? "Small" : settings.fontSize === 1 ? "Medium" : "Large"}
                      </span>
                    </div>
                    <Slider 
                      id="font-size" 
                      min={0} 
                      max={2} 
                      step={1} 
                      value={[settings.fontSize]} 
                      onValueChange={(value) => setSettings({...settings, fontSize: value[0]})}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Large</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Reduced Motion</div>
                      <div className="text-sm text-muted-foreground">
                        Minimize animations and transitions
                      </div>
                    </div>
                    <Switch 
                      checked={settings.reducedMotion} 
                      onCheckedChange={(checked) => setSettings({...settings, reducedMotion: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">High Contrast</div>
                      <div className="text-sm text-muted-foreground">
                        Increase contrast for better readability
                      </div>
                    </div>
                    <Switch 
                      checked={settings.highContrast} 
                      onCheckedChange={(checked) => setSettings({...settings, highContrast: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Preferences</CardTitle>
                <CardDescription>Customize your app layout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Focus Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Hide non-essential elements for distraction-free experience
                      </div>
                    </div>
                    <Switch 
                      checked={settings.focusMode} 
                      onCheckedChange={(checked) => setSettings({...settings, focusMode: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Compact Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Reduce spacing to fit more content on screen
                      </div>
                    </div>
                    <Switch 
                      checked={settings.compactMode} 
                      onCheckedChange={(checked) => setSettings({...settings, compactMode: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Animations</div>
                      <div className="text-sm text-muted-foreground">
                        Enable smooth transitions and effects
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableAnimations} 
                      onCheckedChange={(checked) => setSettings({...settings, enableAnimations: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Additional customization options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4">
                  <div className="font-medium">Reset to Defaults</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Reset all appearance settings to default values
                  </p>
                  <Button 
                    variant="destructive" 
                    className="mt-4"
                    onClick={() => {
                      setSettings({
                        theme: "system",
                        colorScheme: "default",
                        fontSize: 1,
                        reducedMotion: false,
                        highContrast: false,
                        focusMode: false,
                        compactMode: false,
                        enableAnimations: true,
                        customAccentColor: "#0ea5e9",
                      })
                      toast({
                        title: "Settings reset",
                        description: "Your appearance settings have been reset to default values.",
                      })
                    }}
                  >
                    Reset Settings
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <div className="font-medium">Export Settings</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Export your appearance settings for backup or sharing
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings))
                      const downloadAnchorNode = document.createElement('a')
                      downloadAnchorNode.setAttribute("href", dataStr)
                      downloadAnchorNode.setAttribute("download", "fitlife-appearance-settings.json")
                      document.body.appendChild(downloadAnchorNode)
                      downloadAnchorNode.click()
                      downloadAnchorNode.remove()
                      toast({
                        title: "Settings exported",
                        description: "Your appearance settings have been exported to a file.",
                      })
                    }}
                  >
                    Export Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your settings will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`rounded-lg border p-6 ${settings.highContrast ? 'contrast-[1.25]' : ''}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`font-semibold ${settings.fontSize === 0 ? 'text-sm' : settings.fontSize === 2 ? 'text-xl' : 'text-base'}`}>
                  Sample Dashboard Card
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className={`${settings.fontSize === 0 ? 'text-xs' : settings.fontSize === 2 ? 'text-base' : 'text-sm'}`}>Active</span>
                </div>
              </div>
              <p className={`mb-4 text-muted-foreground ${settings.fontSize === 0 ? 'text-xs' : settings.fontSize === 2 ? 'text-base' : 'text-sm'}`}>
                This is a preview of how your content will appear with your selected settings.
              </p>
              <div className={`mb-4 h-2 w-full rounded-full bg-muted`}>
                <div 
                  className={`h-2 rounded-full`}
                  style={{ width: '65%', backgroundColor: settings.customAccentColor }}
                ></div>
              </div>
              <Button 
                className={`${settings.enableAnimations ? 'transition-all duration-300 hover:scale-105' : ''}`}
                style={{ backgroundColor: settings.colorScheme === 'default' ? settings.customAccentColor : 
                        settings.colorScheme === 'purple' ? '#a855f7' : 
                        settings.colorScheme === 'green' ? '#22c55e' : 
                        '#f97316' }}
              >
                Sample Button
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full md:w-auto md:self-end"
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </DashboardShell>
  )
} 