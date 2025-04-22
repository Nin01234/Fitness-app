import Link from "next/link"
import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UpcomingRemindersProps {
  reminders: any[]
}

export function UpcomingReminders({ reminders }: UpcomingRemindersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Reminders</CardTitle>
          <CardDescription>Stay on track with reminders</CardDescription>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/reminders/new">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">{reminder.time_of_day}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
            <div className="rounded-full bg-primary/10 p-2">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <h3 className="mt-2 text-sm font-semibold">No reminders</h3>
            <p className="mt-1 text-xs text-muted-foreground">Add reminders to stay on track</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

