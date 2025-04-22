"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Download, Share2 } from "lucide-react"

export function QRCodeScanner() {
  const [activeTab, setActiveTab] = useState("ios")

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-blue-600" /> Get FitLife Mobile
        </CardTitle>
        <CardDescription>Scan the QR code to download our mobile app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="ios" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ios">iOS</TabsTrigger>
            <TabsTrigger value="android">Android</TabsTrigger>
          </TabsList>
          <TabsContent value="ios" className="pt-4">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                {/* This would be a real QR code in production */}
                <div className="w-48 h-48 bg-[url('/placeholder.svg?height=192&width=192')] bg-center bg-no-repeat bg-contain"></div>
              </div>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Scan with your iPhone camera to download from the App Store
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Download className="mr-2 h-4 w-4" /> Download for iOS
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="android" className="pt-4">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                {/* This would be a real QR code in production */}
                <div className="w-48 h-48 bg-[url('/placeholder.svg?height=192&width=192')] bg-center bg-no-repeat bg-contain"></div>
              </div>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Scan with your Android camera to download from Google Play
              </p>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Download className="mr-2 h-4 w-4" /> Download for Android
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" /> Share App Link
        </Button>
      </CardFooter>
    </Card>
  )
}

