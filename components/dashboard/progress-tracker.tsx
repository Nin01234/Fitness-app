"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Activity, Weight, Ruler } from "lucide-react"

export function ProgressTracker() {
  const [timeframe, setTimeframe] = useState("week")
  const [metricType, setMetricType] = useState("weight")

  // Sample data
  const weeklyData = [
    { day: "Mon", weight: 182, bodyFat: 21, muscleMass: 140, steps: 8500 },
    { day: "Tue", weight: 181.5, bodyFat: 21, muscleMass: 140.5, steps: 10200 },
    { day: "Wed", weight: 181, bodyFat: 20.8, muscleMass: 141, steps: 7800 },
    { day: "Thu", weight: 180.5, bodyFat: 20.5, muscleMass: 141.5, steps: 9300 },
    { day: "Fri", weight: 180, bodyFat: 20.2, muscleMass: 142, steps: 11500 },
    { day: "Sat", weight: 179.5, bodyFat: 20, muscleMass: 142.5, steps: 12800 },
    { day: "Sun", weight: 179, bodyFat: 19.8, muscleMass: 143, steps: 9600 },
  ]

  const monthlyData = [
    { day: "Week 1", weight: 185, bodyFat: 22, muscleMass: 138, steps: 8000 },
    { day: "Week 2", weight: 183, bodyFat: 21.5, muscleMass: 139, steps: 8500 },
    { day: "Week 3", weight: 181, bodyFat: 20.8, muscleMass: 141, steps: 9200 },
    { day: "Week 4", weight: 179, bodyFat: 19.8, muscleMass: 143, steps: 10000 },
  ]

  const yearlyData = [
    { day: "Jan", weight: 190, bodyFat: 24, muscleMass: 135, steps: 7000 },
    { day: "Feb", weight: 188, bodyFat: 23.5, muscleMass: 136, steps: 7500 },
    { day: "Mar", weight: 186, bodyFat: 23, muscleMass: 137, steps: 8000 },
    { day: "Apr", weight: 184, bodyFat: 22.5, muscleMass: 138, steps: 8500 },
    { day: "May", weight: 182, bodyFat: 22, muscleMass: 139, steps: 9000 },
    { day: "Jun", weight: 180, bodyFat: 21.5, muscleMass: 140, steps: 9500 },
    { day: "Jul", weight: 178, bodyFat: 21, muscleMass: 141, steps: 10000 },
    { day: "Aug", weight: 176, bodyFat: 20.5, muscleMass: 142, steps: 10500 },
    { day: "Sep", weight: 175, bodyFat: 20, muscleMass: 143, steps: 11000 },
    { day: "Oct", weight: 174, bodyFat: 19.5, muscleMass: 144, steps: 11500 },
    { day: "Nov", weight: 173, bodyFat: 19, muscleMass: 145, steps: 12000 },
    { day: "Dec", weight: 172, bodyFat: 18.5, muscleMass: 146, steps: 12500 },
  ]

  const getDataByTimeframe = () => {
    switch (timeframe) {
      case "week":
        return weeklyData
      case "month":
        return monthlyData
      case "year":
        return yearlyData
      default:
        return weeklyData
    }
  }

  const data = getDataByTimeframe()

  // Calculate progress
  const calculateProgress = () => {
    const currentData = data[data.length - 1]
    const startData = data[0]

    switch (metricType) {
      case "weight":
        const weightChange = startData.weight - currentData.weight
        const weightPercentage = (weightChange / startData.weight) * 100
        return {
          current: currentData.weight,
          change: weightChange.toFixed(1),
          percentage: weightPercentage.toFixed(1),
          isPositive: weightChange > 0, // For weight loss, positive change is good
          unit: "lbs",
        }
      case "bodyFat":
        const fatChange = startData.bodyFat - currentData.bodyFat
        const fatPercentage = (fatChange / startData.bodyFat) * 100
        return {
          current: currentData.bodyFat,
          change: fatChange.toFixed(1),
          percentage: fatPercentage.toFixed(1),
          isPositive: fatChange > 0, // For fat loss, positive change is good
          unit: "%",
        }
      case "muscleMass":
        const massChange = currentData.muscleMass - startData.muscleMass
        const massPercentage = (massChange / startData.muscleMass) * 100
        return {
          current: currentData.muscleMass,
          change: massChange.toFixed(1),
          percentage: massPercentage.toFixed(1),
          isPositive: massChange > 0, // For muscle gain, positive change is good
          unit: "lbs",
        }
      case "steps":
        const stepsChange = currentData.steps - startData.steps
        const stepsPercentage = (stepsChange / startData.steps) * 100
        return {
          current: currentData.steps,
          change: stepsChange.toFixed(0),
          percentage: stepsPercentage.toFixed(1),
          isPositive: stepsChange > 0, // For steps, more is better
          unit: "steps",
        }
      default:
        return {
          current: 0,
          change: "0",
          percentage: "0",
          isPositive: true,
          unit: "",
        }
    }
  }

  const progress = calculateProgress()

  const getMetricIcon = () => {
    switch (metricType) {
      case "weight":
        return <Weight className="h-5 w-5" />
      case "bodyFat":
        return <Ruler className="h-5 w-5" />
      case "muscleMass":
        return <Activity className="h-5 w-5" />
      case "steps":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Weight className="h-5 w-5" />
    }
  }

  const getLineColor = () => {
    switch (metricType) {
      case "weight":
        return "#8884d8"
      case "bodyFat":
        return "#82ca9d"
      case "muscleMass":
        return "#ffc658"
      case "steps":
        return "#ff7300"
      default:
        return "#8884d8"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progress Tracker</CardTitle>
            <CardDescription>Track your fitness metrics over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setTimeframe("week")}>
              Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTimeframe("month")}>
              Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTimeframe("year")}>
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="weight" value={metricType} onValueChange={setMetricType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="bodyFat">Body Fat</TabsTrigger>
            <TabsTrigger value="muscleMass">Muscle Mass</TabsTrigger>
            <TabsTrigger value="steps">Daily Steps</TabsTrigger>
          </TabsList>

          <TabsContent value={metricType} className="space-y-4">
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">{getMetricIcon()}</div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current{" "}
                    {metricType === "bodyFat" ? "Body Fat" : metricType === "muscleMass" ? "Muscle Mass" : metricType}
                  </p>
                  <p className="text-2xl font-bold">
                    {progress.current} {progress.unit}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Change</p>
                <p className={`text-lg font-semibold ${progress.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {progress.isPositive ? "+" : ""}
                  {progress.change} {progress.unit} ({progress.percentage}%)
                </p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={metricType}
                    stroke={getLineColor()}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous {timeframe}
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-1 h-4 w-4" />
            Select Date
          </Button>
          <Button variant="outline" size="sm">
            Next {timeframe}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

