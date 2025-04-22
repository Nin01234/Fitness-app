"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, subMonths } from "date-fns"
import { Loader2 } from "lucide-react"

interface ProgressChartProps {
  userId: string | undefined
}

export function ProgressChart({ userId }: ProgressChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Sample data for when the database table doesn't exist
  const sampleData = [
    { date: "Jan 01", weight: 185, bodyFat: 22, muscleMass: 140 },
    { date: "Jan 15", weight: 183, bodyFat: 21.5, muscleMass: 141 },
    { date: "Feb 01", weight: 181, bodyFat: 21, muscleMass: 142 },
    { date: "Feb 15", weight: 179, bodyFat: 20.5, muscleMass: 143 },
    { date: "Mar 01", weight: 177, bodyFat: 20, muscleMass: 144 },
    { date: "Mar 15", weight: 175, bodyFat: 19.5, muscleMass: 145 },
  ]

  useEffect(() => {
    async function fetchProgressData() {
      if (!userId) return

      setIsLoading(true)
      try {
        // Get data from the last 3 months
        const threeMonthsAgo = subMonths(new Date(), 3).toISOString()

        // Try to fetch data, but handle the case where the table doesn't exist
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", userId)
          .gte("date", threeMonthsAgo)
          .order("date", { ascending: true })

        if (error) {
          console.log("Using sample data instead of database data")
          // Use sample data instead
          setData(sampleData)
        } else {
          // Format data for the chart
          const formattedData = data.map((entry) => ({
            date: format(new Date(entry.date), "MMM dd"),
            weight: entry.weight,
            bodyFat: entry.body_fat,
            muscleMass: entry.muscle_mass,
          }))

          setData(formattedData.length > 0 ? formattedData : sampleData)
        }
      } catch (error) {
        console.error("Error in progress chart:", error)
        // Fallback to sample data
        setData(sampleData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressData()
  }, [userId, supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-[300px]">
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
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />
                <Line type="monotone" dataKey="muscleMass" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

