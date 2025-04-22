"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ruler } from "lucide-react"

interface MeasurementTrackerProps {
  userId: string | undefined
}

export function MeasurementTracker({ userId }: MeasurementTrackerProps) {
  // Sample measurements data
  const measurements = {
    chest: { current: 42, previous: 43 },
    waist: { current: 32, previous: 34 },
    hips: { current: 38, previous: 39 },
    arms: { current: 14, previous: 13.5 },
    thighs: { current: 22, previous: 23 },
  }

  const calculateChange = (current: number, previous: number) => {
    const change = current - previous
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      percentage: ((Math.abs(change) / previous) * 100).toFixed(1),
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Body Measurements</CardTitle>
          <Ruler className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(measurements).map(([part, { current, previous }]) => {
          const change = calculateChange(current, previous)
          return (
            <div key={part} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="capitalize">{part}</span>
                <span className="text-sm font-medium">{current}"</span>
              </div>
              <Progress value={(current / previous) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {change.isPositive ? "+" : "-"}
                {change.value}" ({change.percentage}%) from last measurement
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

