"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface ProgressPhotoUploadProps {
  userId: string
  onUploadComplete?: (url: string, type: string, date: Date) => void
}

export function ProgressPhotoUpload({ userId, onUploadComplete }: ProgressPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [photoType, setPhotoType] = useState<string>("front")
  const [photoDate, setPhotoDate] = useState<Date>(new Date())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setIsDialogOpen(true)

    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const uploadImage = async () => {
    if (!previewUrl) return

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would upload the file to your server or cloud storage here
      // const formData = new FormData()
      // formData.append('file', fileInputRef.current?.files?.[0] as File)
      // formData.append('userId', userId)
      // formData.append('type', photoType)
      // formData.append('date', photoDate.toISOString())
      // const response = await fetch('/api/upload-progress-photo', { method: 'POST', body: formData })
      // const data = await response.json()

      // For demo purposes, we'll just use the preview URL
      const uploadedUrl = previewUrl

      // Call the callback with the new URL
      if (onUploadComplete) {
        onUploadComplete(uploadedUrl, photoType, photoDate)
      }

      toast({
        title: "Progress photo uploaded",
        description: "Your progress photo has been successfully uploaded.",
      })

      setIsDialogOpen(false)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your progress photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const cancelUpload = () => {
    setPreviewUrl(null)
    setIsDialogOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Progress Photos</CardTitle>
          <CardDescription>Track your physical progress with photos over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            onClick={triggerFileInput}
          >
            <Plus className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">Add Progress Photo</h3>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
              Upload a new photo to track your progress
            </p>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" /> Upload Photo
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="text-sm text-muted-foreground">Photos are private and only visible to you.</div>
        </CardFooter>
      </Card>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Progress Photo</DialogTitle>
            <DialogDescription>Add details about your progress photo</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm h-64 rounded-lg overflow-hidden">
                {previewUrl && (
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Progress photo preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo-date">Date</Label>
              <Input
                id="photo-date"
                type="date"
                value={format(photoDate, "yyyy-MM-dd")}
                onChange={(e) => setPhotoDate(new Date(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Photo Type</Label>
              <RadioGroup
                defaultValue="front"
                value={photoType}
                onValueChange={setPhotoType}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="front" id="front" />
                  <Label htmlFor="front">Front View</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="side" id="side" />
                  <Label htmlFor="side">Side View</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="back" id="back" />
                  <Label htmlFor="back">Back View</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={cancelUpload} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={uploadImage} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

