"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReminderCalendarProps {
  userId: string | undefined
  reminders: any[]
}

export function ReminderCalendar({ userId, reminders }: ReminderCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const getDayReminders = (day: Date) => {
    return reminders.filter((reminder) => {
      const reminderDays = reminder.days_of_week || []
      return reminderDays.includes(day.getDay())
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const dayReminders = getDayReminders(date)
              return (
                <div className="relative">
                  <span>{date.getDate()}</span>
                  {dayReminders.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px]"
                    >
                      {dayReminders.length}
                    </Badge>
                  )}
                </div>
              )
            },
          }}
        />

        {date && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">
              Reminders for {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </h4>
            <div className="space-y-2">
              {getDayReminders(date).map((reminder, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <span>{reminder.title}</span>
                  <span className="text-muted-foreground">{reminder.time_of_day}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

