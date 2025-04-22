"use client"

import { useState, useEffect, useRef } from "react"
import { useNotifications } from "@/components/notifications/notification-provider"
import { getUserStreak } from "@/lib/streaks"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { recordActivity } from "@/lib/activity-tracking"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Activity,
  PersonStanding as Walk,
  Timer,
  Heart,
  Flame,
  Droplets,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Save,
  Share2,
  Camera,
  Bike
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface RealTimeTrackerProps {
  userId: string
  onComplete?: (data: any) => void
}

export function RealTimeTracker({ userId, onComplete }: RealTimeTrackerProps) {
  const { addNotification } = useNotifications()
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activityType, setActivityType] = useState<string>("walking")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [heartRate, setHeartRate] = useState(70)
  const [calories, setCalories] = useState(0)
  const [distance, setDistance] = useState(0)
  const [hydrationLevel, setHydrationLevel] = useState(100)
  const [steps, setSteps] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [userMetrics, setUserMetrics] = useState<any>({
    weight: 0,
    height: 0,
    age: 30,
    gender: 'other'
  })
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const heartRateRef = useRef<NodeJS.Timeout | null>(null)
  const notificationRef = useRef<NodeJS.Timeout | null>(null)
  
  // Load user profile data for calculations
  useEffect(() => {
    async function loadUserProfile() {
      if (!userId) return
      
      try {
        const supabase = createClient()
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single()
        
        if (error) throw error
        
        if (profile) {
          // Calculate age from birthdate if available
          let age = 30 // Default
          if (profile.birthdate) {
            const birthDate = new Date(profile.birthdate)
            const today = new Date()
            age = today.getFullYear() - birthDate.getFullYear()
            // Adjust age if birthday hasn't occurred yet this year
            if (
              today.getMonth() < birthDate.getMonth() || 
              (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
            ) {
              age--
            }
          }
          
          setUserMetrics({
            weight: profile.weight || 70, // kg
            height: profile.height || 170, // cm
            age: age,
            gender: profile.gender || 'other'
          })
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      }
    }
    
    loadUserProfile()
  }, [userId])
  
  // Timer effect
  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1)
        
        // Update calories every second based on activity and user metrics
        const caloriesPerSecond = calculateCaloriesBurn(activityType, userMetrics)
        setCalories(prev => prev + caloriesPerSecond)
        
        // Update distance based on activity type
        const distancePerSecond = calculateDistance(activityType)
        setDistance(prev => prev + distancePerSecond)
        
        // Update steps for certain activities
        if (activityType === 'walking' || activityType === 'running') {
          const stepsPerSecond = activityType === 'walking' ? 1.5 : 2.8
          setSteps(prev => prev + stepsPerSecond)
        }
        
        // Decrease hydration level over time (faster when running)
        if (elapsedTime % 60 === 0) {
          const hydrationDecreaseRate = activityType === 'running' ? 2 : 1
          setHydrationLevel(prev => Math.max(0, prev - hydrationDecreaseRate))
        }
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTracking, isPaused, activityType, userMetrics])
  
  // Heart rate simulation
  useEffect(() => {
    if (isTracking && !isPaused) {
      heartRateRef.current = setInterval(() => {
        // Base heart rate by activity
        const baseHeartRate = getBaseHeartRate(activityType)
        // Add some variability
        const variability = Math.sin(Date.now() / 2000) * 5
        // Age-adjusted max heart rate (simplified)
        const maxHeartRate = 220 - userMetrics.age
        // Calculate heart rate (never exceeding max)
        const newHeartRate = Math.min(
          Math.round(baseHeartRate + variability),
          maxHeartRate
        )
        
        setHeartRate(newHeartRate)
        
        // Trigger heart rate alerts
        if (newHeartRate > maxHeartRate * 0.9) {
          addNotification({
            title: "High Heart Rate Warning ⚠️",
            message: `Your heart rate (${newHeartRate} bpm) is approaching your maximum. Consider slowing down.`,
            type: "warning"
          })
        }
      }, 3000)
    } else if (heartRateRef.current) {
      clearInterval(heartRateRef.current)
    }
    
    return () => {
      if (heartRateRef.current) clearInterval(heartRateRef.current)
    }
  }, [isTracking, isPaused, activityType, userMetrics, addNotification])
  
  // Periodic notifications for motivation and hydration
  useEffect(() => {
    if (isTracking && !isPaused) {
      notificationRef.current = setInterval(() => {
        // Remind about hydration if level is low
        if (hydrationLevel < 30) {
          addNotification({
            title: "Hydration Reminder 💧",
            message: "Your hydration level is getting low. Time to take a water break!",
            type: "warning"
          })
        }
        
        // Send motivational notification every 5 minutes
        if (elapsedTime > 0 && elapsedTime % 300 === 0) {
          const motivationalMessages = [
            "Keep pushing! You're doing great!",
            `You've burned ${Math.round(calories)} calories so far!`,
            `Already ${formatTime(elapsedTime)} of activity. Impressive!`,
            "Remember, consistency beats intensity!",
            "Focus on your form, not just speed.",
            "Every second counts towards your goals!"
          ]
          
          const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
          
          addNotification({
            title: "Workout Motivation 💪",
            message: randomMessage,
            type: "info"
          })
        }
        
        // Achievement notifications at certain milestones
        if (calories > 100 && calories < 105) {
          addNotification({
            title: "Achievement Unlocked! 🏆",
            message: "You've burned over 100 calories!",
            type: "success"
          })
        }
        
        if (distance > 1 && distance < 1.05) {
          addNotification({
            title: "Milestone Reached! 🎯",
            message: "You've covered more than 1 kilometer!",
            type: "success"
          })
        }
      }, 60000) // Check every minute
    } else if (notificationRef.current) {
      clearInterval(notificationRef.current)
    }
    
    return () => {
      if (notificationRef.current) clearInterval(notificationRef.current)
    }
  }, [isTracking, isPaused, hydrationLevel, elapsedTime, calories, distance, addNotification])
  
  const startActivity = () => {
    if (isTracking) return
    
    setIsTracking(true)
    setIsPaused(false)
    
    addNotification({
      title: "Workout Started 🏃",
      message: `You've started a ${activityType} workout. Let's go!`,
      type: "info"
    })
  }
  
  const pauseActivity = () => {
    setIsPaused(true)
    
    addNotification({
      title: "Workout Paused ⏸️",
      message: "Your workout has been paused. Resume when you're ready!",
      type: "info"
    })
  }
  
  const resumeActivity = () => {
    setIsPaused(false)
    
    addNotification({
      title: "Workout Resumed ▶️",
      message: "You've resumed your workout. Keep it up!",
      type: "info"
    })
  }
  
  const stopActivity = async () => {
    setIsTracking(false)
    setIsPaused(false)
    
    // Record the activity in the database
    try {
      const activityData = {
        workout_name: capitalizeFirstLetter(activityType),
        duration: elapsedTime,
        calories_burned: Math.round(calories),
        distance: distance.toFixed(2),
        steps: Math.round(steps),
        heart_rate_avg: heartRate,
        activity_type: activityType
      }
      
      const result = await recordActivity({
        userId,
        activityType: 'workout',
        data: activityData,
        photos
      })
      
      if (result.success) {
        toast({
          title: "Workout Saved",
          description: "Your activity has been recorded successfully!",
        })
        
        // Send completion notification
        addNotification({
          title: "Workout Complete! 🎉",
          message: `Great job! You completed a ${formatTime(elapsedTime)} ${activityType} workout and burned ${Math.round(calories)} calories.`,
          type: "success",
          action: {
            text: "View Details",
            url: "/workouts"
          }
        })
        
        // Check streaks
        const streak = await getUserStreak(userId)
        if (streak > 1) {
          addNotification({
            title: "Streak Update! 🔥",
            message: `You're on a ${streak}-day activity streak! Keep it going!`,
            type: "success"
          })
        }
        
        // Call the onComplete callback if provided
        if (onComplete) {
          onComplete(activityData)
        }
        
        // Reset the form
        resetActivity()
      } else {
        throw new Error("Failed to save activity")
      }
    } catch (error) {
      console.error("Error recording activity:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your activity",
        variant: "destructive"
      })
    }
  }
  
  const resetActivity = () => {
    setElapsedTime(0)
    setCalories(0)
    setDistance(0)
    setSteps(0)
    setHydrationLevel(100)
    setPhotos([])
  }
  
  const takePhoto = async () => {
    // Simulate taking a photo and uploading it
    try {
      // In a real app, this would open the camera or file picker
      // For now, we'll simulate a successful photo upload with a placeholder URL
      const timestamp = Date.now()
      const photoUrl = `https://source.unsplash.com/random/300x200?fitness&t=${timestamp}`
      
      setPhotos(prev => [...prev, photoUrl])
      
      toast({
        title: "Photo Added",
        description: "Your workout photo has been added!",
      })
    } catch (error) {
      console.error("Error taking photo:", error)
      toast({
        title: "Error",
        description: "Could not add photo",
        variant: "destructive"
      })
    }
  }
  
  const shareActivity = () => {
    // Simulate sharing the activity
    const shareText = `I just completed a ${formatTime(elapsedTime)} ${activityType} workout and burned ${Math.round(calories)} calories using FitLife!`
    
    // In a real app, this would use the Web Share API or a custom sharing modal
    if (navigator.share) {
      navigator.share({
        title: 'My Workout',
        text: shareText,
      }).catch(error => {
        console.log('Error sharing:', error)
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "Share",
        description: "Sharing functionality not available in this browser",
      })
    }
  }
  
  // Helper functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const calculateCaloriesBurn = (activity: string, metrics: any): number => {
    // MET values (Metabolic Equivalent of Task)
    const metValues: Record<string, number> = {
      walking: 3.5,
      running: 8.0,
      cycling: 5.5,
      swimming: 6.0,
      hiking: 5.3
    }
    
    const met = metValues[activity] || 3.0
    
    // Simplified formula: calories/min = MET * weight(kg) * 3.5 / 200
    // We convert to per second by dividing by 60
    const caloriesPerSecond = (met * metrics.weight * 3.5) / (200 * 60)
    
    return caloriesPerSecond
  }
  
  const calculateDistance = (activity: string): number => {
    // Speed in km/h converted to km/s
    const speedValues: Record<string, number> = {
      walking: 5 / 3600,    // ~5 km/h
      running: 10 / 3600,   // ~10 km/h
      cycling: 20 / 3600,   // ~20 km/h
      swimming: 3 / 3600,   // ~3 km/h
      hiking: 4 / 3600      // ~4 km/h
    }
    
    return speedValues[activity] || speedValues.walking
  }
  
  const getBaseHeartRate = (activity: string): number => {
    // Base heart rate by activity type
    const baseRates: Record<string, number> = {
      walking: 100,
      running: 140,
      cycling: 120,
      swimming: 110,
      hiking: 105
    }
    
    return baseRates[activity] || 100
  }
  
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'walking':
        return <Walk className="h-5 w-5" />
      case 'running':
        return <Running />
      case 'cycling':
        return <Bike className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }
  
  return (
    <Card className="shadow-md border-blue-100 dark:border-blue-900">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b border-blue-100 dark:border-blue-900">
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Activity className="h-5 w-5" />
          Real-Time Activity Tracker
        </CardTitle>
        <CardDescription>
          Track your workout in real-time with detailed metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {!isTracking ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose Activity Type</h3>
            <Tabs defaultValue="walking" value={activityType} onValueChange={setActivityType}>
              <TabsList className="grid grid-cols-3 gap-2">
                <TabsTrigger value="walking" className="flex items-center gap-2">
                  <Walk className="h-4 w-4" /> Walking
                </TabsTrigger>
                <TabsTrigger value="running" className="flex items-center gap-2">
                  <Running /> Running
                </TabsTrigger>
                <TabsTrigger value="cycling" className="flex items-center gap-2">
                  <Bike className="h-4 w-4" /> Cycling
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <p className="text-sm text-center text-blue-600 dark:text-blue-400">
                You're about to start a {activityType} workout. Make sure you're prepared!
              </p>
            </div>
            
            <Button 
              onClick={startActivity} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Start Tracking
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <Timer className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-2xl font-bold">{formatTime(elapsedTime)}</span>
                <span className="text-xs text-muted-foreground">Time</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-950 rounded-lg p-4">
                <Flame className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                <span className="text-2xl font-bold">{Math.round(calories)}</span>
                <span className="text-xs text-muted-foreground">Calories</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950 rounded-lg p-4">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                <span className="text-2xl font-bold">{distance.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">Distance (km)</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-red-50 dark:bg-red-950 rounded-lg p-4">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400 mb-2" />
                <span className="text-2xl font-bold">{heartRate}</span>
                <span className="text-xs text-muted-foreground">Heart Rate</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Hydration Level</span>
                <span className="text-sm">{hydrationLevel}%</span>
              </div>
              <Progress value={hydrationLevel} className="h-2" />
            </div>
            
            {activityType === 'walking' || activityType === 'running' ? (
              <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 flex justify-between items-center">
                <Walk className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div className="flex-1 mx-4">
                  <h4 className="font-medium text-sm">Step Count</h4>
                  <Progress value={steps % 100} className="h-1 my-1" />
                </div>
                <span className="font-bold">{Math.round(steps)}</span>
              </div>
            ) : null}
            
            <div className="flex gap-2">
              {photos.map((photo, index) => (
                <img 
                  key={index} 
                  src={photo} 
                  alt={`Workout photo ${index + 1}`} 
                  className="h-16 w-16 rounded-md object-cover"
                />
              ))}
            </div>
            
            <div className="flex gap-3 justify-center">
              {isPaused ? (
                <Button onClick={resumeActivity} variant="outline" size="lg" className="flex-1">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseActivity} variant="outline" size="lg" className="flex-1">
                  <PauseCircle className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button onClick={stopActivity} variant="destructive" size="lg" className="flex-1">
                <StopCircle className="h-5 w-5 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {isTracking && (
        <CardFooter className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-between gap-3">
          <Button variant="ghost" onClick={takePhoto} className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Photo
          </Button>
          
          <Button variant="ghost" onClick={shareActivity} className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button variant="ghost" onClick={stopActivity} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Finish
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Implement a custom Running icon
const Running = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
    <path d="M4 17l5 1 .75-1.5"></path>
    <path d="M15 21l5-1s-2-5-8-5c-2.76 0-5-2.24-5-5"></path>
    <path d="M8 11l2 3 4-4"></path>
  </svg>
) 