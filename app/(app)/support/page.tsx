import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EnhancedSupportCenter } from "@/components/support/enhanced-support-center"
import { DynamicBackground } from "@/components/workouts/dynamic-background"

export const metadata: Metadata = {
  title: "Support - FitLife",
  description: "Get help and support for using FitLife",
}

export default function SupportPage() {
  return (
    <DashboardShell className="relative">
      {/* Full page dynamic background */}
      <div className="fixed inset-0 z-0">
        <DynamicBackground overlay={false} interval={8000} />
      </div>
      
      {/* Semi-transparent content overlay */}
      <div className="relative z-10 bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <DashboardHeader heading="Support & Resources" text="Get help and learn how to make the most of FitLife" />
        <EnhancedSupportCenter />
      </div>
    </DashboardShell>
  )
}

