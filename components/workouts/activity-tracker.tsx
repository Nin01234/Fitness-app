"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/components/notifications/notification-provider"
import { toast } from "@/hooks/use-toast"
import {
  Activity,
  FootprintsIcon as Walk,
  MonitorIcon as Running,
  Bike,
  FishIcon as Swimming,
  Mountain,
  Pause,
  Play,
  StopCircle,
  RotateCcw,
  Heart,
  Flame,
  Droplets,
  ArrowUp,
  BarChart,
  Map,
  Share2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

export function ActivityTracker() {
  const [activeTracker, setActiveTracker] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distance, setDistance] = useState(0)
  const [calories, setCalories] = useState(0)
  const [pace, setPace] = useState(0)
  const [heartRate, setHeartRate] = useState(0)
  const [elevation, setElevation] = useState(0)
  const [steps, setSteps] = useState(0)
  const [cadence, setCadence] = useState(0)
  const [hydrationLevel, setHydrationLevel] = useState(70)
  const [watchPosition, setWatchPosition] = useState<number | null>(null)
  const [positions, setPositions] = useState<GeolocationPosition[]>([])
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt")
  const [showSummary, setShowSummary] = useState(false)
  const [activitySummary, setActivitySummary] = useState<any>(null)
  const [showHydrationReminder, setShowHydrationReminder] = useState(false)
  const [showHeartRateAlert, setShowHeartRateAlert] = useState(false)
  const [weatherConditions, setWeatherConditions] = useState({
    temperature: 72,
    condition: "Sunny",
    humidity: 45,
    windSpeed: 8,
  })

  const { addNotification } = useNotifications()
  const hydrationReminderRef = useRef<NodeJS.Timeout | null>(null)
  const heartRateCheckRef = useRef<NodeJS.Timeout | null>(null)
  const weatherUpdateRef = useRef<NodeJS.Timeout | null>(null)
  const achievementCheckRef = useRef<NodeJS.Timeout | null>(null)

  // Request location permission
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionStatus(result.state)
        result.onchange = () => {
          setPermissionStatus(result.state)
        }
      })
    }
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)

        // Update calories based on activity type and time
        const caloriesPerMinute = getCaloriesPerMinute(activeTracker)
        setCalories((prev) => prev + caloriesPerMinute / 60)

        // Update pace if we have positions
        if (positions.length > 1) {
          const currentPace = calculatePace(distance, elapsedTime)
          setPace(currentPace)
        }

        // Simulate heart rate changes
        setHeartRate((prev) => {
          const baseHR = getBaseHeartRate(activeTracker)
          const variation = Math.sin(elapsedTime / 30) * 5
          return Math.round(baseHR + variation)
        })

        // Simulate steps
        if (activeTracker === "walking" || activeTracker === "running" || activeTracker === "hiking") {
          const stepsPerMinute = getStepsPerMinute(activeTracker)
          setSteps((prev) => prev + stepsPerMinute / 60)
        }

        // Simulate cadence
        if (activeTracker === "running" || activeTracker === "cycling") {
          const baseCadence = activeTracker === "running" ? 170 : 80
          const variation = Math.sin(elapsedTime / 20) * 5
          setCadence(Math.round(baseCadence + variation))
        }

        // Simulate elevation changes for hiking
        if (activeTracker === "hiking") {
          const elevationChange = Math.sin(elapsedTime / 60) * 2
          setElevation((prev) => prev + elevationChange)
        }

        // Decrease hydration level over time
        if (elapsedTime % 60 === 0 && elapsedTime > 0) {
          setHydrationLevel((prev) => Math.max(0, prev - 5))
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, activeTracker, distance, elapsedTime, positions.length])

  // Geolocation tracking effect
  useEffect(() => {
    if (isTracking && permissionStatus === "granted") {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setPositions((prev) => [...prev, position])

          // Calculate distance if we have at least two positions
          if (positions.length > 0) {
            const newDistance = calculateDistance(positions[positions.length - 1].coords, position.coords)
            setDistance((prev) => prev + newDistance)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location Error",
            description: "Unable to track your location. Please check your device settings.",
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        },
      )

      setWatchPosition(id)
    }

    return () => {
      if (watchPosition !== null) {
        navigator.geolocation.clearWatch(watchPosition)
      }
    }
  }, [isTracking, permissionStatus])

  // Hydration reminder effect
  useEffect(() => {
    if (isTracking) {
      hydrationReminderRef.current = setInterval(
        () => {
          if (hydrationLevel < 40 && !showHydrationReminder) {
            setShowHydrationReminder(true)
            addNotification({
              id: Date.now().toString(),
              title: "Hydration Reminder",
              message: "Your hydration level is low. Take a water break!",
              type: "warning",
              read: false,
              timestamp: new Date(),
            })
          }
        },
        10 * 60 * 1000,
      ) // Check every 10 minutes
    }

    return () => {
      if (hydrationReminderRef.current) {
        clearInterval(hydrationReminderRef.current)
      }
    }
  }, [isTracking, hydrationLevel, showHydrationReminder, addNotification])

  // Heart rate check effect
  useEffect(() => {
    if (isTracking) {
      heartRateCheckRef.current = setInterval(
        () => {
          const maxHeartRate = 220 - 30 // Assuming age 30
          const threshold = maxHeartRate * 0.85

          if (heartRate > threshold && !showHeartRateAlert) {
            setShowHeartRateAlert(true)
            addNotification({
              id: Date.now().toString(),
              title: "High Heart Rate Alert",
              message: `Your heart rate (${heartRate} bpm) is above 85% of your max. Consider slowing down.`,
              type: "warning",
              read: false,
              timestamp: new Date(),
            })
          }
        },
        2 * 60 * 1000,
      ) // Check every 2 minutes
    }

    return () => {
      if (heartRateCheckRef.current) {
        clearInterval(heartRateCheckRef.current)
      }
    }
  }, [isTracking, heartRate, showHeartRateAlert, addNotification])

  // Weather update effect
  useEffect(() => {
    if (isTracking) {
      // Initial weather update
      updateWeather()

      weatherUpdateRef.current = setInterval(
        () => {
          updateWeather()
        },
        15 * 60 * 1000,
      ) // Update every 15 minutes
    }

    return () => {
      if (weatherUpdateRef.current) {
        clearInterval(weatherUpdateRef.current)
      }
    }
  }, [isTracking])

  // Achievement check effect
  useEffect(() => {
    if (isTracking) {
      achievementCheckRef.current = setInterval(() => {
        // Check for distance achievements
        if (distance >= 5 && !activitySummary?.achievements?.includes("5km")) {
          addNotification({
            id: Date.now().toString(),
            title: "Achievement Unlocked!",
            message: "You've reached 5km! Keep up the great work!",
            type: "success",
            read: false,
            timestamp: new Date(),
          })
        }

        // Check for time achievements
        if (elapsedTime >= 1800 && !activitySummary?.achievements?.includes("30min")) {
          addNotification({
            id: Date.now().toString(),
            title: "Achievement Unlocked!",
            message: "You've been active for 30 minutes! Great job!",
            type: "success",
            read: false,
            timestamp: new Date(),
          })
        }
      }, 60 * 1000) // Check every minute
    }

    return () => {
      if (achievementCheckRef.current) {
        clearInterval(achievementCheckRef.current)
      }
    }
  }, [isTracking, distance, elapsedTime, activitySummary, addNotification])

  const updateWeather = () => {
    // Simulate weather API call
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
    const randomTemp = Math.floor(Math.random() * 15) + 65 // 65-80°F
    const randomHumidity = Math.floor(Math.random() * 30) + 40 // 40-70%
    const randomWind = Math.floor(Math.random() * 10) + 5 // 5-15 mph

    setWeatherConditions({
      temperature: randomTemp,
      condition: randomCondition,
      humidity: randomHumidity,
      windSpeed: randomWind,
    })

    // Notify about significant weather changes
    if (randomCondition === "Light Rain" && weatherConditions.condition !== "Light Rain") {
      addNotification({
        id: Date.now().toString(),
        title: "Weather Alert",
        message: "Light rain detected in your area. Be careful on slippery surfaces.",
        type: "info",
        read: false,
        timestamp: new Date(),
      })
    }
  }

  const startTracking = (tracker: string) => {
    setActiveTracker(tracker)
    setIsTracking(true)
    setPositions([])
    setElapsedTime(0)
    setDistance(0)
    setCalories(0)
    setPace(0)
    setSteps(0)
    setCadence(0)
    setElevation(0)
    setHydrationLevel(70)
    setShowHydrationReminder(false)
    setShowHeartRateAlert(false)

    // Request location permission if needed
    if (permissionStatus !== "granted") {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionStatus("granted")
          toast({
            title: "Location Access Granted",
            description: "Your activity will now be tracked with GPS.",
          })
        },
        () => {
          setPermissionStatus("denied")
          toast({
            title: "Location Access Denied",
            description: "GPS tracking will not be available. Some features may be limited.",
            variant: "destructive",
          })
        },
      )
    }

    // Notify user that tracking has started
    addNotification({
      id: Date.now().toString(),
      title: `${capitalizeFirstLetter(tracker)} Started`,
      message: "Your activity is now being tracked. Good luck!",
      type: "info",
      read: false,
      timestamp: new Date(),
    })
  }

  const pauseTracking = () => {
    setIsTracking(false)
    addNotification({
      id: Date.now().toString(),
      title: "Activity Paused",
      message: "Your tracking has been paused. Resume when you're ready.",
      type: "info",
      read: false,
      timestamp: new Date(),
    })
  }

  const resumeTracking = () => {
    setIsTracking(true)
    addNotification({
      id: Date.now().toString(),
      title: "Activity Resumed",
      message: "Your tracking has been resumed. Keep going!",
      type: "info",
      read: false,
      timestamp: new Date(),
    })
  }

  const stopTracking = () => {
    setIsTracking(false)

    // Create activity summary
    const summary = {
      activity: activeTracker,
      duration: formatTime(elapsedTime),
      distance: distance.toFixed(2) + " km",
      calories: Math.round(calories),
      pace: formatPace(pace),
      heartRate: heartRate,
      steps: Math.round(steps),
      cadence: cadence,
      elevation: elevation.toFixed(1) + " m",
      weather: weatherConditions,
      date: new Date(),
      achievements: [],
    }

    // Add achievements
    if (distance >= 5) summary.achievements.push("5km")
    if (elapsedTime >= 1800) summary.achievements.push("30min")
    if (calories >= 300) summary.achievements.push("300cal")

    setActivitySummary(summary)
    setShowSummary(true)

    // Notify user that tracking has stopped
    addNotification({
      id: Date.now().toString(),
      title: "Activity Completed",
      message: `Great job! You completed a ${capitalizeFirstLetter(activeTracker || "")} session.`,
      type: "success",
      read: false,
      timestamp: new Date(),
    })
  }

  const resetTracking = () => {
    setActiveTracker(null)
    setIsTracking(false)
    setElapsedTime(0)
    setDistance(0)
    setCalories(0)
    setPace(0)
    setHeartRate(0)
    setSteps(0)
    setCadence(0)
    setElevation(0)
    setHydrationLevel(70)
    setPositions([])
    setShowSummary(false)
    setActivitySummary(null)

    if (watchPosition !== null) {
      navigator.geolocation.clearWatch(watchPosition)
      setWatchPosition(null)
    }
  }

  const saveActivity = () => {
    // Here you would typically save to a database
    toast({
      title: "Activity Saved",
      description: "Your activity has been saved to your history.",
    })

    addNotification({
      id: Date.now().toString(),
      title: "Activity Saved",
      message: "Your activity has been saved to your history and added to your stats.",
      type: "success",
      read: false,
      timestamp: new Date(),
    })

    setShowSummary(false)
    resetTracking()
  }

  const shareActivity = () => {
    toast({
      title: "Activity Shared",
      description: "Your activity has been shared with your friends.",
    })

    addNotification({
      id: Date.now().toString(),
      title: "Activity Shared",
      message: "Your activity has been shared with your friends and social media.",
      type: "success",
      read: false,
      timestamp: new Date(),
    })
  }

  const updateHydration = (value: number[]) => {
    setHydrationLevel(value[0])
    if (value[0] > 60 && showHydrationReminder) {
      setShowHydrationReminder(false)
    }
  }

  // Helper functions
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatPace = (pace: number): string => {
    if (pace === 0) return "0'00\""
    const minutes = Math.floor(pace)
    const seconds = Math.round((pace - minutes) * 60)
    return `${minutes}'${seconds.toString().padStart(2, "0")}"`
  }

  const calculateDistance = (coords1: GeolocationCoordinates, coords2: GeolocationCoordinates): number => {
    // Haversine formula to calculate distance between two points
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(coords2.latitude - coords1.latitude)
    const dLon = deg2rad(coords2.longitude - coords1.longitude)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coords1.latitude)) *
        Math.cos(deg2rad(coords2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  const calculatePace = (distance: number, seconds: number): number => {
    if (distance === 0 || seconds === 0) return 0
    // Pace in minutes per kilometer
    return seconds / 60 / distance
  }

  const getCaloriesPerMinute = (activity: string | null): number => {
    // Rough estimates of calories burned per minute for a 70kg person
    switch (activity) {
      case "walking":
        return 4
      case "running":
        return 10
      case "cycling":
        return 8
      case "hiking":
        return 6
      case "swimming":
        return 9
      default:
        return 5
    }
  }

  const getBaseHeartRate = (activity: string | null): number => {
    // Base heart rates for different activities
    switch (activity) {
      case "walking":
        return 110
      case "running":
        return 150
      case "cycling":
        return 135
      case "hiking":
        return 125
      case "swimming":
        return 140
      default:
        return 120
    }
  }

  const getStepsPerMinute = (activity: string | null): number => {
    // Steps per minute for different activities
    switch (activity) {
      case "walking":
        return 100
      case "running":
        return 170
      case "hiking":
        return 90
      default:
        return 0
    }
  }

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "walking":
        return <Walk className="h-5 w-5" />
      case "running":
        return <Running className="h-5 w-5" />
      case "cycling":
        return <Bike className="h-5 w-5" />
      case "swimming":
        return <Swimming className="h-5 w-5" />
      case "hiking":
        return <Mountain className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Activity Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activeTracker ? (
            <Tabs defaultValue="walking">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="walking">Walking</TabsTrigger>
                <TabsTrigger value="running">Running</TabsTrigger>
                <TabsTrigger value="cycling">Cycling</TabsTrigger>
                <TabsTrigger value="hiking">Hiking</TabsTrigger>
                <TabsTrigger value="swimming">Swimming</TabsTrigger>
              </TabsList>
              <TabsContent value="walking" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Walk className="h-5 w-5 text-green-500" />
                    <span>Track your walking distance and pace</span>
                  </div>
                  <Button onClick={() => startTracking("walking")}>Start Walking</Button>
                </div>
              </TabsContent>
              <TabsContent value="running" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Running className="h-5 w-5 text-blue-500" />
                    <span>Track your running performance</span>
                  </div>
                  <Button onClick={() => startTracking("running")}>Start Running</Button>
                </div>
              </TabsContent>
              <TabsContent value="cycling" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="h-5 w-5 text-purple-500" />
                    <span>Track your cycling journey</span>
                  </div>
                  <Button onClick={() => startTracking("cycling")}>Start Cycling</Button>
                </div>
              </TabsContent>
              <TabsContent value="hiking" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-amber-500" />
                    <span>Track your hiking adventure</span>
                  </div>
                  <Button onClick={() => startTracking("hiking")}>Start Hiking</Button>
                </div>
              </TabsContent>
              <TabsContent value="swimming" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Swimming className="h-5 w-5 text-cyan-500" />
                    <span>Track your swimming session</span>
                  </div>
                  <Button onClick={() => startTracking("swimming")}>Start Swimming</Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getActivityIcon(activeTracker)}
                  <span className="font-medium capitalize">{activeTracker}</span>
                  {isTracking ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Paused
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-bold font-mono">{formatTime(elapsedTime)}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-2 border rounded-md">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Map className="h-3 w-3" />
                    <span>Distance</span>
                  </div>
                  <div className="text-xl font-bold">{distance.toFixed(2)} km</div>
                </div>
                <div className="text-center p-2 border rounded-md">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Flame className="h-3 w-3" />
                    <span>Calories</span>
                  </div>
                  <div className="text-xl font-bold">{Math.round(calories)}</div>
                </div>
                <div className="text-center p-2 border rounded-md">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <BarChart className="h-3 w-3" />
                    <span>Pace</span>
                  </div>
                  <div className="text-xl font-bold">{formatPace(pace)}/km</div>
                </div>
                <div className="text-center p-2 border rounded-md">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Heart className="h-3 w-3" />
                    <span>Heart Rate</span>
                  </div>
                  <div className="text-xl font-bold">{heartRate} bpm</div>
                </div>
              </div>

              {(activeTracker === "walking" || activeTracker === "running" || activeTracker === "hiking") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Steps</div>
                    <div className="text-xl font-bold">{Math.round(steps)}</div>
                  </div>
                  {activeTracker === "running" && (
                    <div className="text-center p-2 border rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">Cadence</div>
                      <div className="text-xl font-bold">{cadence} spm</div>
                    </div>
                  )}
                  {activeTracker === "hiking" && (
                    <div className="text-center p-2 border rounded-md">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <ArrowUp className="h-3 w-3" />
                        <span>Elevation</span>
                      </div>
                      <div className="text-xl font-bold">{elevation.toFixed(1)} m</div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm">
                    <Droplets className="h-3 w-3" />
                    <span>Hydration Level</span>
                  </div>
                  <span
                    className={`text-sm ${hydrationLevel < 40 ? "text-red-500" : hydrationLevel < 70 ? "text-amber-500" : "text-green-500"}`}
                  >
                    {hydrationLevel}%
                  </span>
                </div>
                <Slider
                  value={[hydrationLevel]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={updateHydration}
                  className={`${hydrationLevel < 40 ? "accent-red-500" : hydrationLevel < 70 ? "accent-amber-500" : "accent-green-500"}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.min(100, Math.round((elapsedTime / 1800) * 100))}%</span>
                </div>
                <Progress value={Math.min(100, Math.round((elapsedTime / 1800) * 100))} className="h-2" />
              </div>

              <div className="flex justify-center gap-4">
                {isTracking ? (
                  <Button variant="outline" size="icon" onClick={pauseTracking}>
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="icon" onClick={resumeTracking}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="destructive" size="icon" onClick={stopTracking}>
                  <StopCircle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetTracking}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {permissionStatus === "denied" && (
                <div className="text-center text-red-500 text-sm">
                  Location access denied. Please enable location services to track your activity.
                </div>
              )}

              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Current Conditions</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Weather:</span>
                    <span>{weatherConditions.condition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Temp:</span>
                    <span>{weatherConditions.temperature}°F</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Humidity:</span>
                    <span>{weatherConditions.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Wind:</span>
                    <span>{weatherConditions.windSpeed} mph</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Summary</DialogTitle>
            <DialogDescription>
              {activitySummary?.activity &&
                `${capitalizeFirstLetter(activitySummary.activity)} - ${new Date(activitySummary.date).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>

          {activitySummary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-bold">{activitySummary.duration}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Distance</div>
                  <div className="font-bold">{activitySummary.distance}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Calories</div>
                  <div className="font-bold">{activitySummary.calories}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Avg. Pace</div>
                  <div className="font-bold">{activitySummary.pace}/km</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Avg. Heart Rate</div>
                  <div className="font-bold">{activitySummary.heartRate} bpm</div>
                </div>
                {activitySummary.steps > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Steps</div>
                    <div className="font-bold">{activitySummary.steps}</div>
                  </div>
                )}
              </div>

              {activitySummary.achievements && activitySummary.achievements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {activitySummary.achievements.map((achievement: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={() => setShowSummary(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={shareActivity}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button onClick={saveActivity}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hydration Reminder Dialog */}
      <Dialog open={showHydrationReminder} onOpenChange={setShowHydrationReminder}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Hydration Alert
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm">Your hydration level is low. Remember to drink water during your activity.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Level</span>
                <span className="text-red-500">{hydrationLevel}%</span>
              </div>
              <Progress value={hydrationLevel} className="h-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHydrationReminder(false)}>
              Dismiss
            </Button>
            <Button
              onClick={() => {
                setHydrationLevel(100)
                setShowHydrationReminder(false)
                addNotification({
                  id: Date.now().toString(),
                  title: "Hydration Updated",
                  message: "Great job staying hydrated! Your hydration level has been updated.",
                  type: "success",
                  read: false,
                  timestamp: new Date(),
                })
              }}
            >
              I Drank Water
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Heart Rate Alert Dialog */}
      <Dialog open={showHeartRateAlert} onOpenChange={setShowHeartRateAlert}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Heart Rate Alert
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm">
              Your heart rate is currently {heartRate} bpm, which is above 85% of your estimated maximum heart rate.
            </p>
            <div className="rounded-md bg-red-500/10 p-3 text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-red-500">
                Consider slowing down or taking a short break to allow your heart rate to decrease.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHeartRateAlert(false)}>
              Dismiss
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                pauseTracking()
                setShowHeartRateAlert(false)
                addNotification({
                  id: Date.now().toString(),
                  title: "Activity Paused",
                  message: "Your activity has been paused due to elevated heart rate.",
                  type: "warning",
                  read: false,
                  timestamp: new Date(),
                })
              }}
            >
              Pause Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

