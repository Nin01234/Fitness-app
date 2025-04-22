"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ProgressPhotoUpload } from "@/components/progress/progress-photo-upload"
import { Slider } from "@/components/ui/slider"
import { Scale, Ruler, Percent, Heart, Camera, Save } from "lucide-react"

const progressFormSchema = z.object({
  weight: z.string().optional(),
  body_fat: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  arms: z.string().optional(),
  thighs: z.string().optional(),
  resting_heart_rate: z.string().optional(),
  notes: z.string().optional(),
  mood: z.number().min(1).max(5).default(3),
  energy: z.number().min(1).max(5).default(3),
  sleep_quality: z.number().min(1).max(5).default(3),
  stress_level: z.number().min(1).max(5).default(3),
})

type ProgressFormValues = z.infer<typeof progressFormSchema>

const defaultValues: Partial<ProgressFormValues> = {
  weight: "",
  body_fat: "",
  chest: "",
  waist: "",
  hips: "",
  arms: "",
  thighs: "",
  resting_heart_rate: "",
  notes: "",
  mood: 3,
  energy: 3,
  sleep_quality: 3,
  stress_level: 3,
}

export function EnhancedProgressForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<{ front?: File; side?: File; back?: File }>({})

  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProgressFormValues) {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to log progress",
          variant: "destructive",
        })
        return
      }

      // Convert string values to numbers where appropriate
      const numericData = {
        weight: data.weight ? Number.parseFloat(data.weight) : null,
        body_fat: data.body_fat ? Number.parseFloat(data.body_fat) : null,
        chest: data.chest ? Number.parseFloat(data.chest) : null,
        waist: data.waist ? Number.parseFloat(data.waist) : null,
        hips: data.hips ? Number.parseFloat(data.hips) : null,
        arms: data.arms ? Number.parseFloat(data.arms) : null,
        thighs: data.thighs ? Number.parseFloat(data.thighs) : null,
        resting_heart_rate: data.resting_heart_rate ? Number.parseInt(data.resting_heart_rate) : null,
      }

      // Save progress entry to database
      const { data: progress, error } = await supabase
        .from("progress")
        .insert({
          user_id: user.id,
          date: new Date().toISOString(),
          ...numericData,
          notes: data.notes,
          mood: data.mood,
          energy: data.energy,
          sleep_quality: data.sleep_quality,
          stress_level: data.stress_level,
        })
        .select()

      if (error) throw error

      // Upload photos if any
      if (progress && progress[0]?.id && (photos.front || photos.side || photos.back)) {
        const progressId = progress[0].id
        const photoUrls: Record<string, string> = {}

        for (const [position, file] of Object.entries(photos)) {
          if (!file) continue

          const fileExt = file.name.split(".").pop()
          const fileName = `${user.id}/${progressId}/${position}.${fileExt}`

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from("progress-photos")
            .upload(fileName, file)

          if (uploadError) {
            console.error(`Error uploading ${position} photo:`, uploadError)
            continue
          }

          const { data: urlData } = supabase.storage.from("progress-photos").getPublicUrl(fileName)

          if (urlData) {
            photoUrls[`${position}_photo_url`] = urlData.publicUrl
          }
        }

        // Update progress entry with photo URLs
        if (Object.keys(photoUrls).length > 0) {
          await supabase.from("progress").update(photoUrls).eq("id", progressId)
        }
      }

      toast({
        title: "Progress Logged",
        description: "Your progress has been successfully recorded",
      })

      router.push("/progress")
      router.refresh()
    } catch (error) {
      console.error("Error logging progress:", error)
      toast({
        title: "Error",
        description: "There was an error logging your progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="measurements" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="measurements" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Body Composition</CardTitle>
                  <CardDescription>Track your body composition metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Scale className="mr-2 h-4 w-4" /> Weight (kg)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 70.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body_fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Percent className="mr-2 h-4 w-4" /> Body Fat %
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 15.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resting_heart_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Heart className="mr-2 h-4 w-4" /> Resting Heart Rate (bpm)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 65" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Body Measurements</CardTitle>
                  <CardDescription>Track your body measurements in centimeters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="chest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Ruler className="mr-2 h-4 w-4" /> Chest (cm)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 95.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Ruler className="mr-2 h-4 w-4" /> Waist (cm)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 80.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hips"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Ruler className="mr-2 h-4 w-4" /> Hips (cm)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="e.g., 90.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="arms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Ruler className="mr-2 h-4 w-4" /> Arms (cm)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g., 35.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="thighs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Ruler className="mr-2 h-4 w-4" /> Thighs (cm)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g., 55.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress Photos</CardTitle>
                <CardDescription>Upload photos to visually track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <h3 className="mb-2 font-medium flex items-center">
                      <Camera className="mr-2 h-4 w-4" /> Front View
                    </h3>
                    <ProgressPhotoUpload onPhotoSelected={(file) => setPhotos((prev) => ({ ...prev, front: file }))} />
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium flex items-center">
                      <Camera className="mr-2 h-4 w-4" /> Side View
                    </h3>
                    <ProgressPhotoUpload onPhotoSelected={(file) => setPhotos((prev) => ({ ...prev, side: file }))} />
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium flex items-center">
                      <Camera className="mr-2 h-4 w-4" /> Back View
                    </h3>
                    <ProgressPhotoUpload onPhotoSelected={(file) => setPhotos((prev) => ({ ...prev, back: file }))} />
                  </div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Tips for consistent progress photos:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Use the same lighting and background</li>
                    <li>Wear similar clothing each time</li>
                    <li>Take photos from the same distance and angle</li>
                    <li>Use a timer or have someone else take the photo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Metrics</CardTitle>
                <CardDescription>Track how you're feeling overall</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Mood (1-5)</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                              onClick={() => onChange(num)}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energy"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Energy Level (1-5)</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                              onClick={() => onChange(num)}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sleep_quality"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Sleep Quality (1-5)</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                              onClick={() => onChange(num)}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stress_level"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Stress Level (1-5)</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            defaultValue={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                value === num ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                              onClick={() => onChange(num)}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Add any additional information about your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes about your progress, how you're feeling, or any other relevant information..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include details about your workouts, nutrition, or any factors affecting your progress.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="h-4 w-4" />
            Save Progress
          </Button>
        </div>
      </form>
    </Form>
  )
}

