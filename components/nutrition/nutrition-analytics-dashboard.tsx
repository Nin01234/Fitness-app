"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Droplets, Leaf, Beef } from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for the charts
const weeklyData = [
  { day: "Mon", calories: 2100, protein: 110, carbs: 220, fat: 70 },
  { day: "Tue", calories: 1950, protein: 115, carbs: 200, fat: 65 },
  { day: "Wed", calories: 2200, protein: 120, carbs: 230, fat: 75 },
  { day: "Thu", calories: 2050, protein: 105, carbs: 215, fat: 72 },
  { day: "Fri", calories: 2150, protein: 118, carbs: 225, fat: 68 },
  { day: "Sat", calories: 2300, protein: 125, carbs: 240, fat: 80 },
  { day: "Sun", calories: 1900, protein: 100, carbs: 195, fat: 65 },
]

const monthlyData = [
  { week: "Week 1", calories: 14500, protein: 770, carbs: 1525, fat: 490 },
  { week: "Week 2", calories: 15200, protein: 800, carbs: 1600, fat: 510 },
  { week: "Week 3", calories: 14800, protein: 785, carbs: 1550, fat: 500 },
  { week: "Week 4", calories: 15500, protein: 820, carbs: 1630, fat: 520 },
]

const macroData = [
  { name: "Protein", value: 25 },
  { name: "Carbs", value: 55 },
  { name: "Fat", value: 20 },
]

const COLORS = ["#FF5A5F", "#3498DB", "#F1C40F"]

const mealTimingData = [
  { name: "Breakfast", calories: 550, protein: 30, carbs: 60, fat: 20 },
  { name: "Morning Snack", calories: 250, protein: 15, carbs: 25, fat: 10 },
  { name: "Lunch", calories: 650, protein: 40, carbs: 65, fat: 25 },
  { name: "Afternoon Snack", calories: 200, protein: 10, carbs: 20, fat: 8 },
  { name: "Dinner", calories: 600, protein: 35, carbs: 60, fat: 22 },
  { name: "Evening Snack", calories: 150, protein: 8, carbs: 15, fat: 6 },
]

const waterData = [
  { day: "Mon", amount: 1.8 },
  { day: "Tue", amount: 2.1 },
  { day: "Wed", amount: 1.9 },
  { day: "Thu", amount: 2.3 },
  { day: "Fri", amount: 2.0 },
  { day: "Sat", amount: 2.5 },
  { day: "Sun", amount: 1.7 },
]

const vegetableData = [
  { day: "Mon", servings: 3 },
  { day: "Tue", servings: 4 },
  { day: "Wed", servings: 3 },
  { day: "Thu", servings: 5 },
  { day: "Fri", servings: 4 },
  { day: "Sat", servings: 6 },
  { day: "Sun", servings: 3 },
]

const proteinData = [
  { day: "Mon", grams: 95 },
  { day: "Tue", grams: 110 },
  { day: "Wed", grams: 105 },
  { day: "Thu", grams: 115 },
  { day: "Fri", grams: 100 },
  { day: "Sat", grams: 120 },
  { day: "Sun", grams: 90 },
]

export function NutritionAnalyticsDashboard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          <div className="flex items-center relative z-10">
            <BarChart2 className="mr-2 h-5 w-5" />
            <span className="font-medium">Nutrition Analytics Dashboard</span>
            <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">Live Data</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nutrition Analytics Dashboard</DialogTitle>
          <DialogDescription>
            Comprehensive analysis of your nutrition data to help you make informed decisions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="macros">Macronutrients</TabsTrigger>
            <TabsTrigger value="timing">Meal Timing</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,100</div>
                  <p className="text-xs text-muted-foreground">calories per day</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="font-medium text-red-500">115g</span>
                      <span className="text-muted-foreground">Protein</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-500">220g</span>
                      <span className="text-muted-foreground">Carbs</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-yellow-500">70g</span>
                      <span className="text-muted-foreground">Fat</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[120px]">
                  <ChartContainer
                    config={{
                      calories: {
                        label: "Calories",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[1800, 2400]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="calories"
                          stroke="var(--color-calories)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Macro Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[120px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Nutrition Overview</CardTitle>
                <CardDescription>Calorie and macronutrient intake for the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    calories: {
                      label: "Calories",
                      color: "hsl(var(--chart-1))",
                    },
                    protein: {
                      label: "Protein",
                      color: "#FF5A5F",
                    },
                    carbs: {
                      label: "Carbs",
                      color: "#3498DB",
                    },
                    fat: {
                      label: "Fat",
                      color: "#F1C40F",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="calories"
                        stroke="var(--color-calories)"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="protein"
                        stroke="var(--color-protein)"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="carbs"
                        stroke="var(--color-carbs)"
                        strokeWidth={2}
                      />
                      <Line yAxisId="right" type="monotone" dataKey="fat" stroke="var(--color-fat)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="macros" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Macronutrient Breakdown</CardTitle>
                  <CardDescription>Daily distribution of protein, carbs, and fat</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      protein: {
                        label: "Protein",
                        color: "#FF5A5F",
                      },
                      carbs: {
                        label: "Carbs",
                        color: "#3498DB",
                      },
                      fat: {
                        label: "Fat",
                        color: "#F1C40F",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="protein" stackId="a" fill="var(--color-protein)" />
                        <Bar dataKey="carbs" stackId="a" fill="var(--color-carbs)" />
                        <Bar dataKey="fat" stackId="a" fill="var(--color-fat)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ideal vs. Actual</CardTitle>
                  <CardDescription>Comparison with recommended values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="text-sm text-muted-foreground">115g / 120g</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "96%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Carbs</span>
                      <span className="text-sm text-muted-foreground">220g / 200g</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "110%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Fat</span>
                      <span className="text-sm text-muted-foreground">70g / 65g</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "108%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Fiber</span>
                      <span className="text-sm text-muted-foreground">22g / 30g</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "73%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Sugar</span>
                      <span className="text-sm text-muted-foreground">45g / 35g</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "129%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meal Timing Analysis</CardTitle>
                <CardDescription>Calorie and nutrient distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    calories: {
                      label: "Calories",
                      color: "hsl(var(--chart-1))",
                    },
                    protein: {
                      label: "Protein",
                      color: "#FF5A5F",
                    },
                    carbs: {
                      label: "Carbs",
                      color: "#3498DB",
                    },
                    fat: {
                      label: "Fat",
                      color: "#F1C40F",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mealTimingData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="calories" fill="var(--color-calories)" />
                      <Bar yAxisId="right" dataKey="protein" fill="var(--color-protein)" />
                      <Bar yAxisId="right" dataKey="carbs" fill="var(--color-carbs)" />
                      <Bar yAxisId="right" dataKey="fat" fill="var(--color-fat)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Meal Frequency</CardTitle>
                  <CardDescription>Number of meals and snacks per day</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Average Meals</p>
                      <p className="text-2xl font-bold">3.2</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Average Snacks</p>
                      <p className="text-2xl font-bold">2.5</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Eating Events</p>
                      <p className="text-2xl font-bold">5.7</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Time Between Meals</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Breakfast - Lunch</span>
                      <span>4h 15m</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Lunch - Dinner</span>
                      <span>5h 30m</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Dinner - Breakfast</span>
                      <span>14h 15m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimal Meal Windows</CardTitle>
                  <CardDescription>Recommended timing based on your activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-24">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-muted"></div>
                    </div>
                    <div className="absolute inset-0">
                      <div className="flex justify-between h-full">
                        {["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"].map((time, i) => (
                          <div key={i} className="flex flex-col items-center justify-between">
                            <div className="w-px h-2 bg-muted"></div>
                            <span className="text-xs text-muted-foreground">{time}</span>
                            <div className="w-px h-2 bg-muted"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-1/2 left-[15%] w-[15%] h-6 -translate-y-1/2 bg-green-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-800">Breakfast</span>
                    </div>

                    <div className="absolute top-1/2 left-[40%] w-[15%] h-6 -translate-y-1/2 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-800">Lunch</span>
                    </div>

                    <div className="absolute top-1/2 left-[70%] w-[15%] h-6 -translate-y-1/2 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-800">Dinner</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recommendations</p>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-0.5 text-[8px]">•</span>
                        <span>Eat breakfast within 1-2 hours of waking up</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2 mt-0.5 text-[8px]">•</span>
                        <span>Space meals 3-5 hours apart for optimal energy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-100 text-purple-800 rounded-full p-1 mr-2 mt-0.5 text-[8px]">•</span>
                        <span>Finish dinner at least 2-3 hours before bedtime</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                    <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[150px]">
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Water (L)",
                        color: "#3498DB",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waterData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 3]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 text-green-500 mr-2" />
                    <CardTitle className="text-sm font-medium">Vegetable Servings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[150px]">
                  <ChartContainer
                    config={{
                      servings: {
                        label: "Servings",
                        color: "#2ECC71",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vegetableData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 8]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="servings" stroke="var(--color-servings)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Beef className="h-4 w-4 text-red-500 mr-2" />
                    <CardTitle className="text-sm font-medium">Protein Intake</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="h-[150px]">
                  <ChartContainer
                    config={{
                      grams: {
                        label: "Protein (g)",
                        color: "#FF5A5F",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={proteinData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 150]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="grams" stroke="var(--color-grams)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Nutrition Trends</CardTitle>
                <CardDescription>Track your progress over the past month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    calories: {
                      label: "Calories",
                      color: "hsl(var(--chart-1))",
                    },
                    protein: {
                      label: "Protein",
                      color: "#FF5A5F",
                    },
                    carbs: {
                      label: "Carbs",
                      color: "#3498DB",
                    },
                    fat: {
                      label: "Fat",
                      color: "#F1C40F",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="week" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="calories" fill="var(--color-calories)" />
                      <Bar yAxisId="right" dataKey="protein" fill="var(--color-protein)" />
                      <Bar yAxisId="right" dataKey="carbs" fill="var(--color-carbs)" />
                      <Bar yAxisId="right" dataKey="fat" fill="var(--color-fat)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

