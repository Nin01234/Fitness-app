"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Smartphone, RefreshCw, Copy, ArrowRight, Apple, SmartphoneIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function MobileDeviceConnection() {
  const [activeTab, setActiveTab] = useState("qrcode")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isCodeGenerated, setIsCodeGenerated] = useState(false)
  const [isSendingLink, setIsSendingLink] = useState(false)
  const [connectionCode, setConnectionCode] = useState("")

  const handleGenerateCode = () => {
    setIsGeneratingCode(true)

    // Simulate API call to generate a connection code
    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
      setConnectionCode(randomCode)
      setIsGeneratingCode(false)
      setIsCodeGenerated(true)

      toast({
        title: "Connection code generated",
        description: `Your code is ${randomCode}. It will expire in 15 minutes.`,
      })
    }, 1500)
  }

  const handleRefreshCode = () => {
    setIsGeneratingCode(true)
    setIsCodeGenerated(false)

    // Simulate API call to refresh the connection code
    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
      setConnectionCode(randomCode)
      setIsGeneratingCode(false)
      setIsCodeGenerated(true)

      toast({
        title: "Connection code refreshed",
        description: `Your new code is ${randomCode}. It will expire in 15 minutes.`,
      })
    }, 1500)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(connectionCode)

    toast({
      title: "Code copied",
      description: "Connection code copied to clipboard",
    })
  }

  const handleSendLink = () => {
    if (!email && !phone) {
      toast({
        title: "Input required",
        description: "Please enter an email or phone number",
        variant: "destructive",
      })
      return
    }

    setIsSendingLink(true)

    // Simulate API call to send link
    setTimeout(() => {
      setIsSendingLink(false)

      toast({
        title: "Link sent",
        description: email ? `Download link sent to ${email}` : `Download link sent to ${phone}`,
      })
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="mr-2 h-5 w-5" />
          Connect Mobile Device
        </CardTitle>
        <CardDescription>Link your iOS or Android device to sync your fitness data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="code">Connection Code</TabsTrigger>
            <TabsTrigger value="link">Send Link</TabsTrigger>
          </TabsList>

          <TabsContent value="qrcode" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="bg-white p-4 rounded-lg mb-4">
                <QrCode className="h-48 w-48 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Scan with your mobile device</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                Open your device's camera and point it at the QR code to download the FitLife app and connect to your
                account.
              </p>

              <div className="flex items-center justify-center space-x-4 mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Apple className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm">iOS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <SmartphoneIcon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm">Android</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4">
              {isCodeGenerated ? (
                <>
                  <div className="text-4xl font-bold tracking-wider mb-4 bg-primary/10 py-4 px-8 rounded-lg">
                    {connectionCode}
                  </div>
                  <div className="flex space-x-2 mb-6">
                    <Button variant="outline" size="sm" onClick={handleCopyCode}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefreshCode} disabled={isGeneratingCode}>
                      {isGeneratingCode ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={handleGenerateCode} disabled={isGeneratingCode} className="mb-6">
                  {isGeneratingCode ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate Connection Code
                    </>
                  )}
                </Button>
              )}

              <h3 className="font-medium text-lg">How to use the connection code</h3>
              <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm w-full max-w-md">
                <li>Download the FitLife app on your mobile device</li>
                <li>Open the app and tap "Connect to Existing Account"</li>
                <li>Select "Enter Connection Code"</li>
                <li>Enter the 6-digit code shown above</li>
                <li>Once verified, your devices will be connected automatically</li>
              </ol>

              <p className="text-sm text-muted-foreground text-center max-w-md mt-4">
                The connection code expires after 15 minutes for security purposes.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">We'll send a download link to this email address</p>
              </div>

              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-muted"></div>
                <span className="mx-4 text-muted-foreground text-sm">OR</span>
                <div className="flex-grow border-t border-muted"></div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">We'll send a download link via SMS to this number</p>
              </div>

              <Button className="w-full mt-2" onClick={handleSendLink} disabled={isSendingLink}>
                {isSendingLink ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Send Download Link
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <h4 className="font-medium">Already have the app?</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Open the FitLife app on your device, go to Settings → Connect Devices → Connect to Web Account
        </p>
      </CardFooter>
    </Card>
  )
}

