import type { Metadata } from "next"
import Image from "next/image"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NewProgressForm } from "@/components/progress/new-progress-form"

export const metadata: Metadata = {
  title: "New Progress Entry - FitLife",
  description: "Track your fitness progress",
}

export default function NewProgressPage() {
  return (
    <DashboardShell>
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mart-production-8033081.jpg-DmcgeiJlmH97MiajYAtGCryKSsVsb4.jpeg"
            alt="Person tracking fitness progress"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">Log Your Progress</h1>
          <p className="mt-2 text-lg">Track your fitness journey and see how far you've come</p>
        </div>
      </div>
      <DashboardHeader heading="New Progress Entry" text="Keep track of your fitness metrics" />
      <NewProgressForm />
    </DashboardShell>
  )
}

