import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EnhancedRemindersList } from "@/components/reminders/enhanced-reminders-list"
import { ReminderCalendar } from "@/components/reminders/reminder-calendar"
import { ReminderCategories } from "@/components/reminders/reminder-categories"
import { EmailSetup } from "@/components/profile/email-setup"

export const metadata: Metadata = {
  title: "Reminders - FitLife",
  description: "Set up reminders for your workouts, meals, and more",
}

export default function RemindersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reminders" text="Stay on track with customized alerts" />

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <EnhancedRemindersList />
        </div>
        <div className="space-y-6 md:col-span-2">
          <ReminderCategories />
          <EmailSetup />
        </div>
      </div>

      <div className="mt-6">
        <ReminderCalendar />
      </div>
    </DashboardShell>
  )
}

