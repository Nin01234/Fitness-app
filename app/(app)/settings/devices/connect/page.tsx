import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Smartphone, Watch, Laptop, QrCode } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Connect Device - FitLife",
  description: "Connect a new device to your FitLife account",
}

export default function ConnectDevicePage() {
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

      <DashboardHeader heading="Connect a Device" text="Add a new device to your FitLife account" />

      <div className="grid gap-6">
        <Tabs defaultValue="mobile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> Mobile
            </TabsTrigger>
            <TabsTrigger value="wearable" className="flex items-center gap-2">
              <Watch className="h-4 w-4" /> Wearable
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" /> Desktop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect Mobile Device</CardTitle>
                <CardDescription>Link your smartphone or tablet to your FitLife account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-64 w-64 border-2 border-dashed border-gray-300 rounded-lg p-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <Image
                      src="/placeholder.svg?height=256&width=256"
                      alt="QR Code"
                      width={256}
                      height={256}
                      className="opacity-0"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Scan QR Code</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Open the FitLife app on your mobile device and scan this QR code to connect
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Enter Code Manually</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code displayed on your mobile device
                    </p>
                    <div className="flex gap-2">
                      <Input placeholder="Enter code" maxLength={6} className="text-center text-lg" />
                      <Button>Connect</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Need help?{" "}
                    <Link href="/help/connect-device" className="text-primary">
                      View connection guide
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="wearable" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect Wearable Device</CardTitle>
                <CardDescription>Link your fitness tracker or smartwatch to your FitLife account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=Apple"
                      alt="Apple Watch"
                      width={64}
                      height={64}
                      className="mb-4"
                    />
                    <h3 className="font-medium">Apple Watch</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">Connect with Apple Health</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=Fitbit"
                      alt="Fitbit"
                      width={64}
                      height={64}
                      className="mb-4"
                    />
                    <h3 className="font-medium">Fitbit</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">Connect with Fitbit account</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=Garmin"
                      alt="Garmin"
                      width={64}
                      height={64}
                      className="mb-4"
                    />
                    <h3 className="font-medium">Garmin</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">Connect with Garmin Connect</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Image
                      src="/placeholder.svg?height=64&width=64&text=Samsung"
                      alt="Samsung"
                      width={64}
                      height={64}
                      className="mb-4"
                    />
                    <h3 className="font-medium">Samsung Galaxy Watch</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">Connect with Samsung Health</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Don't see your device?</h3>
                  <Button variant="outline" className="w-full">
                    Browse All Compatible Devices
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Need help?{" "}
                    <Link href="/help/connect-wearable" className="text-primary">
                      View connection guide
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="desktop" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connect Desktop App</CardTitle>
                <CardDescription>Link the FitLife desktop application to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center h-32 w-full border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <Laptop className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Download the desktop app first</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline" className="w-full">
                      Download for macOS
                    </Button>
                    <Button variant="outline" className="w-full">
                      Download for Windows
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium">Already have the desktop app?</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Enter your login credentials in the desktop app to connect it to your account
                    </p>
                    <div className="flex gap-2">
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Password" type="password" />
                      <Button>Login</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Need help?{" "}
                    <Link href="/help/connect-desktop" className="text-primary">
                      View connection guide
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

