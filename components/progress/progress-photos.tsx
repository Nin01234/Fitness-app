"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react"
import { format } from "date-fns"
import { ProgressPhotoUpload } from "@/components/progress/progress-photo-upload"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProgressPhoto {
  id: string
  url: string
  type: string
  date: Date
  userId: string
}

interface ProgressPhotosProps {
  userId?: string
}

export function ProgressPhotos({ userId = "user-id" }: ProgressPhotosProps) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([
    {
      id: "1",
      url: "/placeholder.svg?height=300&width=200&text=Jan+1",
      type: "front",
      date: new Date(2023, 0, 1),
      userId,
    },
    {
      id: "2",
      url: "/placeholder.svg?height=300&width=200&text=Feb+1",
      type: "front",
      date: new Date(2023, 1, 1),
      userId,
    },
    {
      id: "3",
      url: "/placeholder.svg?height=300&width=200&text=Mar+1",
      type: "front",
      date: new Date(2023, 2, 1),
      userId,
    },
    {
      id: "4",
      url: "/placeholder.svg?height=300&width=200&text=Jan+1",
      type: "side",
      date: new Date(2023, 0, 1),
      userId,
    },
    {
      id: "5",
      url: "/placeholder.svg?height=300&width=200&text=Feb+1",
      type: "side",
      date: new Date(2023, 1, 1),
      userId,
    },
    {
      id: "6",
      url: "/placeholder.svg?height=300&width=200&text=Mar+1",
      type: "side",
      date: new Date(2023, 2, 1),
      userId,
    },
  ])

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photoType, setPhotoType] = useState<string>("front")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null)

  // Filter photos by type
  const filteredPhotos = photos.filter((photo) => photo.type === photoType)

  // Sort photos by date (newest first)
  const sortedPhotos = [...filteredPhotos].sort((a, b) => b.date.getTime() - a.date.getTime())

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < sortedPhotos.length - 1 ? prev + 1 : prev))
  }

  const handlePhotoUpload = (url: string, type: string, date: Date) => {
    const newPhoto: ProgressPhoto = {
      id: `new-${Date.now()}`,
      url,
      type,
      date,
      userId,
    }

    setPhotos((prev) => [...prev, newPhoto])
    setIsUploadDialogOpen(false)

    // If the new photo matches the current filter, update the view
    if (type === photoType) {
      setCurrentPhotoIndex(0) // Show the newest photo
    }
  }

  const openPhotoDetail = (photo: ProgressPhoto) => {
    setSelectedPhoto(photo)
  }

  // Reset current photo index when changing photo type
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [photoType])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progress Photos</CardTitle>
            <CardDescription>Track your physical changes over time</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="front" value={photoType} onValueChange={setPhotoType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="front">Front View</TabsTrigger>
            <TabsTrigger value="side">Side View</TabsTrigger>
            <TabsTrigger value="back">Back View</TabsTrigger>
          </TabsList>
          <TabsContent value="front" className="mt-4">
            {sortedPhotos.length > 0 ? (
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
                  <Image
                    src={sortedPhotos[currentPhotoIndex].url || "/placeholder.svg"}
                    alt={`Progress photo from ${format(sortedPhotos[currentPhotoIndex].date, "PP")}`}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => openPhotoDetail(sortedPhotos[currentPhotoIndex])}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{format(sortedPhotos[currentPhotoIndex].date, "PP")}</span>
                    </div>
                    <div className="text-sm">
                      {currentPhotoIndex + 1} of {sortedPhotos.length}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={handlePrevPhoto} disabled={currentPhotoIndex === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPhoto}
                    disabled={currentPhotoIndex === sortedPhotos.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  No front view photos yet. Add your first photo to start tracking your progress.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Photo
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="side" className="mt-4">
            {sortedPhotos.length > 0 ? (
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
                  <Image
                    src={sortedPhotos[currentPhotoIndex].url || "/placeholder.svg"}
                    alt={`Progress photo from ${format(sortedPhotos[currentPhotoIndex].date, "PP")}`}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => openPhotoDetail(sortedPhotos[currentPhotoIndex])}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{format(sortedPhotos[currentPhotoIndex].date, "PP")}</span>
                    </div>
                    <div className="text-sm">
                      {currentPhotoIndex + 1} of {sortedPhotos.length}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={handlePrevPhoto} disabled={currentPhotoIndex === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPhoto}
                    disabled={currentPhotoIndex === sortedPhotos.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  No side view photos yet. Add your first photo to start tracking your progress.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Photo
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="back" className="mt-4">
            {sortedPhotos.length > 0 ? (
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
                  <Image
                    src={sortedPhotos[currentPhotoIndex].url || "/placeholder.svg"}
                    alt={`Progress photo from ${format(sortedPhotos[currentPhotoIndex].date, "PP")}`}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => openPhotoDetail(sortedPhotos[currentPhotoIndex])}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{format(sortedPhotos[currentPhotoIndex].date, "PP")}</span>
                    </div>
                    <div className="text-sm">
                      {currentPhotoIndex + 1} of {sortedPhotos.length}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={handlePrevPhoto} disabled={currentPhotoIndex === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPhoto}
                    disabled={currentPhotoIndex === sortedPhotos.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  No back view photos yet. Add your first photo to start tracking your progress.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Photo
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Progress Photo</DialogTitle>
            <DialogDescription>Add a new photo to track your fitness progress</DialogDescription>
          </DialogHeader>
          <ProgressPhotoUpload userId={userId} onUploadComplete={handlePhotoUpload} />
        </DialogContent>
      </Dialog>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Progress Photo</DialogTitle>
            <DialogDescription>
              {selectedPhoto && format(selectedPhoto.date, "PPP")} -{" "}
              {selectedPhoto?.type.charAt(0).toUpperCase() + selectedPhoto?.type.slice(1)} View
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedPhoto && (
              <div className="relative h-[70vh] max-h-[600px] w-full max-w-md">
                <Image
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={`Progress photo from ${format(selectedPhoto.date, "PP")}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

