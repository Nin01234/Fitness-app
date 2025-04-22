import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NewWorkoutForm } from "@/components/workouts/new-workout-form"
import { ImageFallback } from "@/components/ui/image-fallback"

export const metadata: Metadata = {
  title: "New Workout - FitLife",
  description: "Create a new workout routine",
}

export default function NewWorkoutPage() {
  return (
    <DashboardShell>
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover opacity-80"
            poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-thelazyartist-1302928.jpg-qBG9PFdTOAP4GQx6IVY4B3LoU5J0zM.jpeg"
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8356-fxz49OdcylsOKF8HWe9fcC0zdEtPTc.MP4"
              type="video/mp4"
            />
            <ImageFallback message="Video could not be loaded" />
          </video>
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">Design Your Perfect Workout</h1>
          <p className="mt-2 text-lg max-w-2xl">
            Create a customized workout routine tailored to your fitness goals, equipment, and experience level
          </p>
        </div>
      </div>
      <DashboardHeader heading="New Workout" text="Build a workout that fits your goals and schedule" />
      <div className="grid gap-4">
        <NewWorkoutForm />
      </div>
    </DashboardShell>
  )
}

