"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePremiumStatus } from "@/components/hooks/use-premium-status"
import { PremiumUpsellBanner } from "@/components/premium/premium-upsell-banner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Target, 
  ArrowUp, 
  ArrowDown,
  Heart
} from "lucide-react"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { format } from "date-fns"
import { Circle } from "@/components/ui/circle"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line
} from "recharts"

// Sample data for charts
const workoutDistributionData = [
  { name: "Strength", value: 45 },
  { name: "Cardio", value: 30 },
  { name: "HIIT", value: 15 },
  { name: "Flexibility", value: 10 },
];

const caloriesBurnedData = [
  { day: "Mon", calories: 350 },
  { day: "Tue", calories: 420 },
  { day: "Wed", calories: 380 },
  { day: "Thu", calories: 520 },
  { day: "Fri", calories: 480 },
  { day: "Sat", calories: 600 },
  { day: "Sun", calories: 320 },
];

const intensityData = [
  { type: "Strength", easy: 10, moderate: 25, intense: 65 },
  { type: "Cardio", easy: 20, moderate: 45, intense: 35 },
  { type: "HIIT", easy: 5, moderate: 15, intense: 80 },
  { type: "Flexibility", easy: 60, moderate: 30, intense: 10 },
];

const weeklyBreakdownData = [
  { day: "Monday", duration: 45, calories: 380, intensity: 7 },
  { day: "Tuesday", duration: 60, calories: 450, intensity: 8 },
  { day: "Wednesday", duration: 30, calories: 320, intensity: 6 },
  { day: "Thursday", duration: 75, calories: 520, intensity: 9 },
  { day: "Friday", duration: 50, calories: 410, intensity: 7 },
  { day: "Saturday", duration: 90, calories: 650, intensity: 8 },
  { day: "Sunday", duration: 40, calories: 310, intensity: 5 },
];

const bodyCompositionData = [
  { month: "Jan", weight: 82, bodyFat: 23, muscle: 38 },
  { month: "Feb", weight: 81, bodyFat: 22, muscle: 38.5 },
  { month: "Mar", weight: 80, bodyFat: 21, muscle: 39 },
  { month: "Apr", weight: 79, bodyFat: 20, muscle: 39.5 },
  { month: "May", weight: 78, bodyFat: 19, muscle: 40 },
  { month: "Jun", weight: 77, bodyFat: 18, muscle: 40.5 },
];

const strengthProgressData = [
  { week: "W1", bench: 70, squat: 100, deadlift: 120 },
  { week: "W2", bench: 75, squat: 110, deadlift: 130 },
  { week: "W3", bench: 77.5, squat: 115, deadlift: 135 },
  { week: "W4", bench: 80, squat: 120, deadlift: 140 },
  { week: "W5", bench: 82.5, squat: 125, deadlift: 145 },
  { week: "W6", bench: 85, squat: 130, deadlift: 150 },
];

const macroData = [
  { name: "Protein", value: 35 },
  { name: "Carbs", value: 45 },
  { name: "Fats", value: 20 },
];

const calorieIntakeData = [
  { day: "Mon", intake: 2200, target: 2300 },
  { day: "Tue", intake: 2350, target: 2300 },
  { day: "Wed", intake: 2100, target: 2300 },
  { day: "Thu", intake: 2400, target: 2300 },
  { day: "Fri", intake: 2500, target: 2300 },
  { day: "Sat", intake: 2700, target: 2300 },
  { day: "Sun", intake: 2250, target: 2300 },
];

// Notification data
const notifications = [
  { 
    id: 1, 
    title: "New workout recommendation", 
    description: "Based on your progress, we've updated your workout plan",
    time: "2 hours ago",
    isRead: false
  },
  { 
    id: 2, 
    title: "Weekly progress report", 
    description: "Your weekly fitness summary is ready to view",
    time: "Yesterday",
    isRead: true
  },
  { 
    id: 3, 
    title: "Nutrition goal achieved", 
    description: "Congratulations! You've hit your protein intake goal for 5 days straight",
    time: "2 days ago",
    isRead: true
  }
];

// Prediction data
const predictions = [
  {
    id: 1,
    metric: "Weight",
    current: 77,
    predicted: 74,
    timeframe: "3 months",
    confidence: 85
  },
  {
    id: 2,
    metric: "Bench Press",
    current: 85,
    predicted: 95,
    timeframe: "2 months",
    confidence: 80
  },
  {
    id: 3,
    metric: "Body Fat %",
    current: 18,
    predicted: 15,
    timeframe: "4 months",
    confidence: 75
  }
];

// Custom colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PremiumAnalyticsPage() {
  const { isPremium, isLoading } = usePremiumStatus()
  const [simulatedPremium, setSimulatedPremium] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()
  
  // Check for simulated premium mode
  useEffect(() => {
    const simulated = localStorage.getItem('simulatedPremium') === 'true'
    setSimulatedPremium(simulated)
  }, [])
  
  // If not premium and not in simulation mode, redirect to premium page
  useEffect(() => {
    if (!isLoading && !isPremium && !simulatedPremium) {
      router.push('/premium')
    }
  }, [isPremium, isLoading, simulatedPremium, router])
  
  if (isLoading) {
    return (
      <div className="container relative flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!isPremium && !simulatedPremium) {
    return (
      <div className="container relative py-10">
        <Card>
          <CardHeader>
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>
              This feature is only available to premium subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PremiumUpsellBanner 
              title="Unlock Premium Analytics"
              description="Upgrade to premium to access detailed analytics and insights"
            />
            <div className="mt-4 text-center">
              <Button onClick={() => router.push('/premium')}>
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container relative py-10">
      {/* Header with notification button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Premium Analytics</h1>
            <PremiumBadge />
          </div>
          <p className="text-muted-foreground mt-1">
            AI-powered insights into your fitness journey
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg border shadow-lg z-50">
                <div className="p-3 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-[350px] overflow-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b hover:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-t">
                  <Button variant="ghost" size="sm" className="w-full text-xs">View all notifications</Button>
                </div>
              </div>
            )}
          </div>
          
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Today:</span> {format(new Date(), "MMM d, yyyy")}
          </Button>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="text-green-500 flex items-center gap-1 text-sm font-medium">
                <ArrowUp className="h-4 w-4" />
                <span>12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">62<span className="text-base">min</span></div>
                <p className="text-xs text-muted-foreground">Per session</p>
              </div>
              <div className="text-green-500 flex items-center gap-1 text-sm font-medium">
                <ArrowUp className="h-4 w-4" />
                <span>8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">14,320</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="text-green-500 flex items-center gap-1 text-sm font-medium">
                <ArrowUp className="h-4 w-4" />
                <span>15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="h-14 w-14">
                <CircularProgressbar 
                  value={78} 
                  text={`78%`} 
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: 'var(--primary)',
                    textColor: 'var(--foreground)',
                    trailColor: 'var(--muted)'
                  })}
                />
              </div>
              <div>
                <div className="text-base font-medium">Weekly Goal</div>
                <p className="text-xs text-muted-foreground">4 of 5 workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Prediction Card */}
      <Card className="mb-8 border-primary/20">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>AI Progress Predictions</CardTitle>
              <Badge variant="outline" className="text-xs">Powered by AI</Badge>
            </div>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
          <CardDescription>
            Based on your current training data, here's what our AI predicts for your future progress
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictions.map(prediction => (
              <div key={prediction.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{prediction.metric}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {prediction.confidence}% accurate
                  </Badge>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <div className="text-2xl font-bold">{prediction.predicted}{prediction.metric === "Body Fat %" ? "%" : "kg"}</div>
                  <div className="text-sm text-green-500 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {prediction.metric === "Body Fat %" ? 
                      ((prediction.current - prediction.predicted) / prediction.current * 100).toFixed(0) : 
                      ((prediction.predicted - prediction.current) / prediction.current * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Current: {prediction.current}{prediction.metric === "Body Fat %" ? "%" : "kg"}</span>
                  <span>In {prediction.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t text-xs text-muted-foreground">
          Predictions are calculated using your workout history, nutrition data, and biometric markers
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Workout Distribution</CardTitle>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Types of workouts completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={workoutDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {workoutDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Calories Burned</CardTitle>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Weekly calorie expenditure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={caloriesBurnedData}>
                      <defs>
                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="calories" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCalories)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Workout Intensity</CardTitle>
                  <BarChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Intensity levels across workout types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={intensityData}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="easy" stackId="a" fill="#8884d8" />
                      <Bar dataKey="moderate" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="intense" stackId="a" fill="#ffc658" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 overflow-hidden">
            <CardHeader>
              <CardTitle>Weekly Activity Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of your workout activity over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={weeklyBreakdownData}>
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="duration" fill="#8884d8" name="Duration (min)" />
                    <Bar yAxisId="right" dataKey="calories" fill="#82ca9d" name="Calories" />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Body Composition</CardTitle>
                <CardDescription>
                  Track changes in body measurements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={bodyCompositionData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="bodyFat" stroke="#ff7300" />
                      <Line type="monotone" dataKey="muscle" stroke="#82ca9d" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Strength Progress</CardTitle>
                <CardDescription>
                  Track improvements in your key lifts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={strengthProgressData}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bench" stroke="#8884d8" />
                      <Line type="monotone" dataKey="squat" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="deadlift" stroke="#ffc658" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Nutrition Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of your nutrition intake and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-[250px] w-full">
                  <h3 className="text-sm font-medium mb-2 text-center">Macronutrient Distribution</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <RePieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[250px] w-full">
                  <h3 className="text-sm font-medium mb-2 text-center">Calorie Intake vs. Target</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={calorieIntakeData}>
                      <defs>
                        <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="intake" stroke="#82ca9d" fillOpacity={1} fill="url(#colorIntake)" />
                      <Line type="monotone" dataKey="target" stroke="#ff7300" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Training Recommendations</CardTitle>
                <CardDescription>
                  AI-generated workout recommendations based on your goals and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-primary/5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increase Squat Volume</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your squat progress is slower than other lifts. We recommend adding an additional squat day focused on volume rather than intensity.
                        </p>
                        <Button variant="outline" size="sm">View Suggested Workouts</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-primary/5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Add Recovery Sessions</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your training intensity has been high for 3 weeks. Consider adding a recovery week with lighter loads to prevent overtraining.
                        </p>
                        <Button variant="outline" size="sm">View Recovery Plan</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-primary/5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Optimize Workout Timing</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Based on your check-in data, your performance peaks in the evening. Consider scheduling your most demanding workouts between 5-7 PM.
                        </p>
                        <Button variant="outline" size="sm">Adjust Schedule</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Training Schedule</CardTitle>
                <CardDescription>
                  Your personalized weekly workout plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 rounded-lg bg-muted/50 border">
                    <div className="w-10 text-center font-medium">Mon</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Upper Body Strength</div>
                      <div className="text-xs text-muted-foreground">Chest, Shoulders, Triceps</div>
                    </div>
                    <div className="text-sm text-muted-foreground">60 min</div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="w-10 text-center font-medium">Tue</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Lower Body Strength</div>
                      <div className="text-xs text-muted-foreground">Squat focus, Hamstrings</div>
                    </div>
                    <div className="text-sm text-muted-foreground">75 min</div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-muted/50 border">
                    <div className="w-10 text-center font-medium">Wed</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Active Recovery</div>
                      <div className="text-xs text-muted-foreground">Mobility, Light Cardio</div>
                    </div>
                    <div className="text-sm text-muted-foreground">45 min</div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-muted/50 border">
                    <div className="w-10 text-center font-medium">Thu</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Pull-Focused Upper Body</div>
                      <div className="text-xs text-muted-foreground">Back, Biceps, Rear Delts</div>
                    </div>
                    <div className="text-sm text-muted-foreground">65 min</div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-muted/50 border">
                    <div className="w-10 text-center font-medium">Fri</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Full Body HIIT</div>
                      <div className="text-xs text-muted-foreground">Metabolic Conditioning</div>
                    </div>
                    <div className="text-sm text-muted-foreground">45 min</div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-muted/50 border">
                    <div className="w-10 text-center font-medium">Sat</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Lower Body Hypertrophy</div>
                      <div className="text-xs text-muted-foreground">Quads, Glutes, Calves</div>
                    </div>
                    <div className="text-sm text-muted-foreground">70 min</div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-muted/50 border">
                    <div className="w-10 text-center font-medium">Sun</div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">Rest Day</div>
                      <div className="text-xs text-muted-foreground">Light Stretching/Yoga Optional</div>
                    </div>
                    <div className="text-sm text-muted-foreground">30 min</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {simulatedPremium && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300 text-center flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
            You're viewing this page in simulation mode. <Button variant="link" className="h-auto p-0" onClick={() => router.push('/premium')}>Upgrade to Premium</Button> for real access.
          </p>
        </div>
      )}
    </div>
  )
} 