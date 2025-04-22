import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ExternalLink } from "lucide-react"
import { BluetoothConnection } from "@/components/bluetooth-connection"
import { MobileDeviceConnection } from "@/components/mobile-device-connection"
import { RemindersSystem } from "@/components/reminders/reminders-system"

export const metadata: Metadata = {
  title: "Devices - FitLife",
  description: "Manage all your connected devices for FitLife",
}

export default function DevicesPage() {
  return (
    <DashboardShell>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </Button>
      </div>

      <DashboardHeader heading="Connected Devices" text="Connect and manage your fitness tracking devices">
        <Button asChild>
          <Link href="/settings/devices/connect">
            <Plus className="mr-2 h-4 w-4" /> Connect New Device
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6">
        <MobileDeviceConnection />

        <BluetoothConnection />

        <RemindersSystem />

        <div className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="font-medium">Need help with your devices?</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md">
            Visit our help center for guides on connecting and troubleshooting your devices
          </p>
          <Button variant="outline" asChild>
            <Link href="/support">
              <ExternalLink className="mr-2 h-4 w-4" /> Visit Help Center
            </Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}

