import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NutritionVideos } from "@/components/nutrition/nutrition-videos"

export const metadata: Metadata = {
  title: "Nutrition Videos - FitLife",
  description: "Watch educational videos about nutrition, healthy eating, and meal preparation",
}

export default function NutritionVideosPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Nutrition Videos"
        text="Watch educational videos about nutrition, healthy eating, meal preparation, and more."
      />
      <div className="grid gap-8">
        <NutritionVideos />
      </div>
    </DashboardShell>
  )
} 