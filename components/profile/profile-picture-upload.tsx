"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface ProfilePictureUploadProps {
  currentImageUrl?: string
  userId: string
  onUploadComplete?: (url: string) => void
}

export function ProfilePictureUpload({
  currentImageUrl = "/placeholder.svg?height=128&width=128",
  userId,
  onUploadComplete,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
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
      // const response = await fetch('/api/upload-profile-picture', { method: 'POST', body: formData })
      // const data = await response.json()

      // For demo purposes, we'll just use the preview URL
      const uploadedUrl = previewUrl

      // Call the callback with the new URL
      if (onUploadComplete) {
        onUploadComplete(uploadedUrl)
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      })

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture. Please try again.",
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
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square w-full overflow-hidden">
              <Image src={currentImageUrl || "/placeholder.svg"} alt="Profile picture" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="rounded-full" onClick={triggerFileInput}>
                  <Camera className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>Preview and confirm your new profile picture</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden">
              {previewUrl && (
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Profile picture preview"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={cancelUpload} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={uploadImage} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

