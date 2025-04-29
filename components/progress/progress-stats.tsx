"use client"

import { useState } from "react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProgressStatsProps {
  userId: string | undefined
  entries: any[]
}

// Define types for our stats
type StatsType = {
  currentWeight: string | number;
  startingWeight: string | number;
  weightChange: string | number;
  currentBodyFat: string | number;
  bodyFatChange: string | number;
  currentMuscleMass: string | number;
  muscleMassChange: string | number;
}

export function ProgressStats({ userId, entries }: ProgressStatsProps) {
  // State for showing placeholder or real data
  const [dataLoaded, setDataLoaded] = useState(false)
  
  // Initial placeholder values
  const [stats, setStats] = useState<StatsType>({
    currentWeight: "00",
    startingWeight: "00",
    weightChange: "00",
    currentBodyFat: "00",
    bodyFatChange: "00",
    currentMuscleMass: "00",
    muscleMassChange: "00",
  })

  // Calculate stats from entries
  const calculateRealStats = () => {
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

  // Handle "View Progress" button click
  const handleViewClick = () => {
    setDataLoaded(true)
    const realStats = calculateRealStats()
    
    // Update stats one by one with a small delay for visual effect
    setTimeout(() => setStats(prev => ({ ...prev, currentWeight: realStats.currentWeight })), 100)
    setTimeout(() => setStats(prev => ({ ...prev, startingWeight: realStats.startingWeight })), 200)
    setTimeout(() => setStats(prev => ({ ...prev, weightChange: realStats.weightChange })), 300)
    setTimeout(() => setStats(prev => ({ ...prev, currentBodyFat: realStats.currentBodyFat })), 400)
    setTimeout(() => setStats(prev => ({ ...prev, bodyFatChange: realStats.bodyFatChange })), 500)
    setTimeout(() => setStats(prev => ({ ...prev, currentMuscleMass: realStats.currentMuscleMass })), 600)
    setTimeout(() => setStats(prev => ({ ...prev, muscleMassChange: realStats.muscleMassChange })), 700)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Weight</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.currentWeight} {typeof stats.currentWeight === 'number' ? 'lbs' : ''}</span>
            {dataLoaded && (
              <Badge variant={typeof stats.weightChange === 'number' && stats.weightChange < 0 ? "success" : "default"}>
                {typeof stats.weightChange === 'number' && stats.weightChange > 0 ? "+" : ""}
                {stats.weightChange} {typeof stats.weightChange === 'number' ? 'lbs' : ''}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {dataLoaded ? `Starting weight: ${stats.startingWeight} lbs` : "Starting weight: --"}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Body Fat</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.currentBodyFat}{typeof stats.currentBodyFat === 'number' ? '%' : ''}</span>
            {dataLoaded && (
              <Badge variant={typeof stats.bodyFatChange === 'number' && stats.bodyFatChange < 0 ? "success" : "default"}>
                {typeof stats.bodyFatChange === 'number' && stats.bodyFatChange > 0 ? "+" : ""}
                {stats.bodyFatChange}{typeof stats.bodyFatChange === 'number' ? '%' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Muscle Mass</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{stats.currentMuscleMass} {typeof stats.currentMuscleMass === 'number' ? 'lbs' : ''}</span>
            {dataLoaded && (
              <Badge variant={typeof stats.muscleMassChange === 'number' && stats.muscleMassChange > 0 ? "success" : "default"}>
                {typeof stats.muscleMassChange === 'number' && stats.muscleMassChange > 0 ? "+" : ""}
                {stats.muscleMassChange} {typeof stats.muscleMassChange === 'number' ? 'lbs' : ''}
              </Badge>
            )}
          </div>
        </div>
        
        {!dataLoaded && (
          <Button 
            onClick={handleViewClick} 
            className="w-full mt-4"
          >
            View Progress
          </Button>
        )}
        
        {dataLoaded && (
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
          >
            <Link href="/progress/analytics">
              Detailed Analytics <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
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

