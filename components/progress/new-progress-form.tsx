"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressPhotoUpload } from "@/components/progress/progress-photo-upload"
import { Scale, Ruler, Percent, CalendarDays } from "lucide-react"

const progressFormSchema = z.object({
  weight: z.string().optional(),
  bodyFat: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  arms: z.string().optional(),
  thighs: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().default(() => new Date().toISOString().split("T")[0]),
})

type ProgressFormValues = z.infer<typeof progressFormSchema>

export function NewProgressForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("measurements")

  const defaultValues: Partial<ProgressFormValues> = {
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  }

  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProgressFormValues) {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Insert progress data
      const { error } = await supabase.from("progress").insert({
        user_id: user.id,
        weight: data.weight ? Number.parseFloat(data.weight) : null,
        body_fat: data.bodyFat ? Number.parseFloat(data.bodyFat) : null,
        measurements: {
          chest: data.chest ? Number.parseFloat(data.chest) : null,
          waist: data.waist ? Number.parseFloat(data.waist) : null,
          hips: data.hips ? Number.parseFloat(data.hips) : null,
          arms: data.arms ? Number.parseFloat(data.arms) : null,
          thighs: data.thighs ? Number.parseFloat(data.thighs) : null,
        },
        notes: data.notes,
        date: data.date,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Progress saved",
        description: "Your progress has been recorded successfully.",
      })

      router.push("/progress")
      router.refresh()
    } catch (error) {
      console.error("Error saving progress:", error)
      toast({
        title: "Something went wrong",
        description: "Your progress could not be saved. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="measurements" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
          <TabsTrigger value="notes">Notes & Feelings</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="measurements">
              <Card>
                <CardHeader>
                  <CardTitle>Body Measurements</CardTitle>
                  <CardDescription>
                    Record your current body measurements to track your progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Scale className="mr-2 h-4 w-4" /> Weight (kg)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 70.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bodyFat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Percent className="mr-2 h-4 w-4" /> Body Fat %
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 15.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="chest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Ruler className="mr-2 h-4 w-4" /> Chest (cm)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 95.5" {...field} />
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
                            <Input type="number" step="0.1" placeholder="e.g. 80.5" {...field} />
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
                            <Input type="number" step="0.1" placeholder="e.g. 100.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="arms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Ruler className="mr-2 h-4 w-4" /> Arms (cm)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 35.5" {...field} />
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
                            <Input type="number" step="0.1" placeholder="e.g. 55.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4" /> Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/progress")}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("photos")}>
                    Next: Photos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Photos</CardTitle>
                  <CardDescription>Upload photos to visually track your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressPhotoUpload />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("measurements")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("notes")}>
                    Next: Notes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Feelings</CardTitle>
                  <CardDescription>
                    Record how you're feeling and any additional notes about your progress
                  </CardDescription>
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
                            placeholder="How are you feeling? Any changes in energy levels, sleep quality, or other observations?"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any observations about your progress, challenges, or achievements.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("photos")}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Progress"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}

