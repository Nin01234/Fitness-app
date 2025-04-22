import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressStatsProps {
  userId: string | undefined
  entries: any[]
}

export function ProgressStats({ userId, entries }: ProgressStatsProps) {
  // Calculate stats from entries
  const calculateStats = () => {
    if (!entries || entries.length === 0) {
      return {
        currentWeight: 175, // Sample data
        startingWeight: 185,
        weightChange: -10,
        currentBodyFat: 19.5,
        bodyFatChange: -2.5,
        currentMuscleMass: 145,
        muscleMassChange: 5,
      }
    }

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const firstEntry = sortedEntries[0]
    const lastEntry = sortedEntries[sortedEntries.length - 1]

    return {
      currentWeight: lastEntry.weight || 0,
      startingWeight: firstEntry.weight || 0,
      weightChange: (lastEntry.weight || 0) - (firstEntry.weight || 0),
      currentBodyFat: lastEntry.body_fat || 0,
      bodyFatChange: (lastEntry.body_fat || 0) - (firstEntry.body_fat || 0),
      currentMuscleMass: lastEntry.muscle_mass || 0,
      muscleMassChange: (lastEntry.muscle_mass || 0) - (firstEntry.muscle_mass || 0),
    }
  }

  const stats = calculateStats()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Weight</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.currentWeight} lbs</span>
            <Badge variant={stats.weightChange < 0 ? "success" : "default"}>
              {stats.weightChange > 0 ? "+" : ""}
              {stats.weightChange} lbs
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Starting weight: {stats.startingWeight} lbs</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Body Fat</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.currentBodyFat}%</span>
            <Badge variant={stats.bodyFatChange < 0 ? "success" : "default"}>
              {stats.bodyFatChange > 0 ? "+" : ""}
              {stats.bodyFatChange}%
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Muscle Mass</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.currentMuscleMass} lbs</span>
            <Badge variant={stats.muscleMassChange > 0 ? "success" : "default"}>
              {stats.muscleMassChange > 0 ? "+" : ""}
              {stats.muscleMassChange} lbs
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "success"
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        variant === "success"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      }`}
    >
      {children}
    </span>
  )
}

