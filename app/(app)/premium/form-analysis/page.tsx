import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Upload, History, FileVideo, PlusCircle, Cog, Info, AlertTriangle } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Form Analysis - FitLife Premium",
  description: "AI-powered exercise form analysis and feedback",
}

export default function FormAnalysisPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Video Form Analysis"
        text="Upload videos of your exercises and receive AI-powered form feedback and suggestions."
      />
      
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Cog className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload a Video</CardTitle>
              <CardDescription>
                Upload a video of your exercise to receive form analysis and feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border-2 border-dashed border-primary/40 p-10 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileVideo className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drag and drop or click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP4, MOV, or AVI. Maximum 100MB.
                    </p>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Select Video
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="exercise-type">Exercise</Label>
                <Input id="exercise-type" placeholder="Select or type the exercise (e.g., Squat, Deadlift)" />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input id="notes" placeholder="Add any relevant details about the exercise or specific concerns" />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Recording Tips</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                    <li>Record from the side view for most exercises</li>
                    <li>Ensure your full body is visible throughout the movement</li>
                    <li>Record in a well-lit area with minimal background distractions</li>
                    <li>Perform 3-5 repetitions of the exercise</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                Submit for Analysis
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Form Analysis Examples</CardTitle>
              <CardDescription>
                See examples of our AI-powered form analysis on different exercises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                      <Image
                        src="/placeholder.svg?height=200&width=400&text=Squat+Analysis"
                        alt="Squat form analysis example"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">Squat Form Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-detected knee position issues and provided correction suggestions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                      <Image
                        src="/placeholder.svg?height=200&width=400&text=Deadlift+Analysis"
                        alt="Deadlift form analysis example"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">Deadlift Form Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Feedback on back position and hip hinge technique with visual annotations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Analysis History</CardTitle>
              <CardDescription>
                View your previously analyzed videos and track your form improvements over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-8 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <FileVideo className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No videos analyzed yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload your first exercise video to receive AI-powered form analysis and feedback.
                  </p>
                  <Button className="mt-4" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
              <CardDescription>
                Customize your form analysis preferences and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Analysis Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analysis-detail">Analysis Detail Level</Label>
                    <select className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm">
                      <option>Detailed</option>
                      <option>Standard</option>
                      <option>Basic</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analysis-detail">Feedback Style</Label>
                    <select className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm">
                      <option>Technical</option>
                      <option>Beginner-friendly</option>
                      <option>Coach-style</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Motion Tracking</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="skeletal-overlay">Skeletal Overlay</Label>
                    <select className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm">
                      <option>Always</option>
                      <option>Only Errors</option>
                      <option>Off</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="angle-measurements">Angle Measurements</Label>
                    <select className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm">
                      <option>On</option>
                      <option>Off</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Important Note</p>
                  <p className="mt-1 text-amber-800 dark:text-amber-300/80">
                    Form analysis is provided for informational purposes only and should not replace professional coaching or medical advice, especially for injury rehabilitation.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
} 