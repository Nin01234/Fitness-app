"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Info, Check, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EmailPreference {
  id: string
  name: string
  description: string
  enabled: boolean
}

export function EmailSetup() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerificationAlert, setShowVerificationAlert] = useState(false)

  const [emailPreferences, setEmailPreferences] = useState<EmailPreference[]>([
    {
      id: "workout-reminders",
      name: "Workout Reminders",
      description: "Get notified about your scheduled workouts",
      enabled: true,
    },
    {
      id: "nutrition-reminders",
      name: "Nutrition Reminders",
      description: "Reminders for meal tracking and water intake",
      enabled: true,
    },
    {
      id: "progress-updates",
      name: "Progress Updates",
      description: "Weekly summaries of your fitness progress",
      enabled: true,
    },
    {
      id: "achievement-alerts",
      name: "Achievement Alerts",
      description: "Get notified when you earn new achievements",
      enabled: true,
    },
    {
      id: "tips-newsletter",
      name: "Tips & Newsletter",
      description: "Weekly fitness and nutrition tips",
      enabled: false,
    },
  ])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setIsVerified(false)
    setShowVerificationAlert(false)
  }

  const handleTogglePreference = (id: string) => {
    setEmailPreferences((prev) => prev.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref)))
  }

  const handleVerifyEmail = () => {
    if (!email || !isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowVerificationAlert(true)

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox to verify your email address.",
        variant: "default",
      })
    }, 1500)
  }

  const handleSavePreferences = () => {
    if (!isVerified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email before saving preferences.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "Preferences Saved",
        description: "Your email notification preferences have been updated.",
        variant: "default",
      })
    }, 1500)
  }

  const simulateVerification = () => {
    setIsVerified(true)
    setShowVerificationAlert(false)

    toast({
      title: "Email Verified",
      description: "Your email has been successfully verified.",
      variant: "default",
    })
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Notifications
        </CardTitle>
        <CardDescription>Configure how and when you receive email notifications</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={handleEmailChange}
              className="flex-1"
            />
            <Button
              onClick={handleVerifyEmail}
              disabled={isSubmitting || !email || isVerified}
              variant={isVerified ? "outline" : "default"}
            >
              {isVerified ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verified
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          {isVerified && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Email verified successfully
            </p>
          )}
        </div>

        {showVerificationAlert && (
          <Alert variant="default" className="bg-muted">
            <Info className="h-4 w-4" />
            <AlertTitle>Verification Email Sent</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link
                to verify your email.
              </p>
              <Button variant="outline" size="sm" onClick={simulateVerification}>
                Simulate Verification
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Email Notification Preferences</h3>
            {!isVerified && (
              <Alert variant="destructive" className="p-2 text-xs flex items-center gap-2 max-w-fit">
                <AlertTriangle className="h-3 w-3" />
                Verify email to enable
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            {emailPreferences.map((preference) => (
              <div key={preference.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={preference.id} className="text-sm">
                    {preference.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">{preference.description}</p>
                </div>
                <Switch
                  id={preference.id}
                  checked={preference.enabled}
                  onCheckedChange={() => handleTogglePreference(preference.id)}
                  disabled={!isVerified}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSavePreferences}
          disabled={isSubmitting || !isVerified}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Update Email Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}

