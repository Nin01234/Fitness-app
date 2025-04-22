import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Image, Camera, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Progress Photos - FitLife",
  description: "Track your physical transformation with progress photos",
}

export default async function ProgressPhotosPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Sample data - in a real app, this would come from the database
  const months = ["January", "February", "March", "April", "May", "June"]
  
  const mockPhotos = [
    { id: 1, date: "January 5, 2023", url: "/placeholder.svg", type: "front" },
    { id: 2, date: "January 5, 2023", url: "/placeholder.svg", type: "side" },
    { id: 3, date: "January 5, 2023", url: "/placeholder.svg", type: "back" },
    { id: 4, date: "February 7, 2023", url: "/placeholder.svg", type: "front" },
    { id: 5, date: "February 7, 2023", url: "/placeholder.svg", type: "side" },
    { id: 6, date: "February 7, 2023", url: "/placeholder.svg", type: "back" },
    { id: 7, date: "March 9, 2023", url: "/placeholder.svg", type: "front" },
    { id: 8, date: "March 9, 2023", url: "/placeholder.svg", type: "side" },
    { id: 9, date: "March 9, 2023", url: "/placeholder.svg", type: "back" },
    { id: 10, date: "April 12, 2023", url: "/placeholder.svg", type: "front" },
    { id: 11, date: "April 12, 2023", url: "/placeholder.svg", type: "side" },
    { id: 12, date: "April 12, 2023", url: "/placeholder.svg", type: "back" },
    { id: 13, date: "May 15, 2023", url: "/placeholder.svg", type: "front" },
    { id: 14, date: "May 15, 2023", url: "/placeholder.svg", type: "side" },
    { id: 15, date: "May 15, 2023", url: "/placeholder.svg", type: "back" },
    { id: 16, date: "June 18, 2023", url: "/placeholder.svg", type: "front" },
    { id: 17, date: "June 18, 2023", url: "/placeholder.svg", type: "side" },
    { id: 18, date: "June 18, 2023", url: "/placeholder.svg", type: "back" },
  ]

  // Group photos by month
  const photosByMonth = months.map(month => {
    return {
      month,
      photos: mockPhotos.filter(photo => photo.date.includes(month))
    }
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Progress Photos" text="Track your physical transformation over time">
        <Button asChild>
          <Link href="/progress/photos/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Photos
          </Link>
        </Button>
      </DashboardHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Photo Timeline
            </CardTitle>
            <CardDescription>
              View your transformation journey chronologically
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 w-0.5 bg-border"></div>
              {photosByMonth.map((monthData, index) => (
                <div key={index} className="relative mb-8 last:mb-0">
                  <div className="ml-4 flex items-center pl-8 pb-4">
                    <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-semibold">{monthData.month} 2023</h3>
                  </div>
                  
                  <div className="ml-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {monthData.photos.length > 0 ? (
                      <>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                          <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center p-4">
                              <span className="block text-sm text-muted-foreground mb-1">Front View</span>
                              <div className="w-24 h-32 mx-auto bg-gray-200 rounded-md flex items-center justify-center">
                                <Camera className="h-8 w-8 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                          <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center p-4">
                              <span className="block text-sm text-muted-foreground mb-1">Side View</span>
                              <div className="w-24 h-32 mx-auto bg-gray-200 rounded-md flex items-center justify-center">
                                <Camera className="h-8 w-8 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                          <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center p-4">
                              <span className="block text-sm text-muted-foreground mb-1">Back View</span>
                              <div className="w-24 h-32 mx-auto bg-gray-200 rounded-md flex items-center justify-center">
                                <Camera className="h-8 w-8 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-3 rounded-md border p-6 text-center">
                        <p className="text-muted-foreground">No photos added for this month</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare Progress</CardTitle>
            <CardDescription>
              Compare photos from different time periods to see your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="front" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="front">Front View</TabsTrigger>
                <TabsTrigger value="side">Side View</TabsTrigger>
                <TabsTrigger value="back">Back View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="front" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Select className="w-full">
                      {months.map((month, i) => (
                        <option key={i} value={month}>{month} 2023</option>
                      ))}
                    </Select>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Select className="w-full">
                      {months.map((month, i) => (
                        <option key={i} value={month} selected={i === months.length - 1}>{month} 2023</option>
                      ))}
                    </Select>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="side" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Select className="w-full">
                      {months.map((month, i) => (
                        <option key={i} value={month}>{month} 2023</option>
                      ))}
                    </Select>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Select className="w-full">
                      {months.map((month, i) => (
                        <option key={i} value={month} selected={i === months.length - 1}>{month} 2023</option>
                      ))}
                    </Select>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="back" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Select className="w-full">
                      {months.map((month, i) => (
                        <option key={i} value={month}>{month} 2023</option>
                      ))}
                    </Select>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Select className="w-full">
                      {months.map((month, i) => (
                        <option key={i} value={month} selected={i === months.length - 1}>{month} 2023</option>
                      ))}
                    </Select>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span className="flex-1">Previous</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo Tips</CardTitle>
            <CardDescription>
              Get the most accurate progress tracking with these tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Consistency is Key</h4>
              <p className="text-sm text-muted-foreground">
                Take photos at the same time of day, in the same lighting, wearing similar clothing, and in the same poses.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Multiple Angles</h4>
              <p className="text-sm text-muted-foreground">
                Always take front, side, and back photos to capture your full physique.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Proper Lighting</h4>
              <p className="text-sm text-muted-foreground">
                Use natural light when possible and avoid harsh shadows that might hide progress.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Regular Schedule</h4>
              <p className="text-sm text-muted-foreground">
                Take photos every 2-4 weeks to see meaningful changes over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

// Components needed for the compare section
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>
}

function Select({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <select className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}>
      {children}
    </select>
  )
} 