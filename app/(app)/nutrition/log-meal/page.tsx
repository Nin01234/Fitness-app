import type { Metadata } from "next"
import Image from "next/image"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LogMealForm } from "@/components/nutrition/log-meal-form"

export const metadata: Metadata = {
  title: "Log Meal - FitLife",
  description: "Log your meals and track your nutrition",
}

export default function LogMealPage() {
  return (
    <DashboardShell>
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-8">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-mart-production-8033081.jpg-DmcgeiJlmH97MiajYAtGCryKSsVsb4.jpeg"
            alt="Healthy meal preparation"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">Track Your Nutrition</h1>
          <p className="mt-2 text-lg max-w-2xl">
            Log your meals to monitor your nutrition and maintain a balanced diet
          </p>
        </div>
      </div>
      <DashboardHeader heading="New Meal Entry" text="Record what you've eaten to track your nutrition" />
      <div className="grid gap-4">
        <LogMealForm />
      </div>
    </DashboardShell>
  )
}

