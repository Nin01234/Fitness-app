"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NutritionCalendarProps {
  userId: string | undefined
}

export function NutritionCalendar({ userId }: NutritionCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // This would normally fetch data for the selected date
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} className="rounded-md border" />
      </CardContent>
    </Card>
  )
}

