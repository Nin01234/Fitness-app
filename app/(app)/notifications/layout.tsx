import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Notifications - FitLife",
  description: "Manage your notifications and updates",
}

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  )
} 