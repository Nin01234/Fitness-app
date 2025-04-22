"use client"

// Add type declaration for Web Bluetooth API at the top of the file
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: {
        filters?: Array<{
          services?: string[];
          name?: string;
          namePrefix?: string;
        }>;
        optionalServices?: string[];
      }): Promise<{
        id: string;
        name?: string;
        gatt?: {
          connected?: boolean;
        };
      }>;
    };
  }
}

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footprints, Heart, Activity, Clock, BarChart, Play, AreaChart, Trophy, Waves, Mountain, Timer, Target, Droplet, SmartphoneCharging, AlertTriangle, MapPin, Navigation, Thermometer, Cloud, Wind, Smartphone, Calendar, Dumbbell, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Activity types with real video IDs
const activityVideos = {
  walking: {
    videoId: "njeZ29umqVE",
    title: "30-Minute Walking Workout",
    description: "Low-impact indoor walking workout for beginners"
  },
  running: {
    videoId: "q2NZyW5EP-Q",
    title: "Beginner Running Tips",
    description: "Essential tips for new runners to improve form and endurance"
  },
  cycling: {
    videoId: "4Hl1WAGKjMo",
    title: "Indoor Cycling Workout",
    description: "30-minute high intensity cycling interval training"
  },
  swimming: {
    videoId: "gh5mAtmeR3Y",
    title: "Swimming Techniques for Beginners",
    description: "Learn essential swimming strokes and techniques"
  },
  hiking: {
    videoId: "ECvbUvJkFMM",
    title: "Hiking Tips & Techniques",
    description: "Essential tips for safer and more enjoyable hiking"
  }
}

// Add dynamic premium benefits that rotate
const premiumBenefits = [
  {
    title: "Fitness Challenges",
    description: "Join premium challenges and competitions",
    detail: "Unlock premium challenges to compete with friends and earn rewards",
    icon: <Trophy className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Exclusive Workouts",
    description: "Access premium workout libraries",
    detail: "Get access to 500+ advanced workouts from top fitness trainers",
    icon: <Dumbbell className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Performance Analytics",
    description: "Advanced fitness metrics and insights",
    detail: "Track your progress with detailed performance charts and AI recommendations",
    icon: <BarChart className="h-5 w-5 text-indigo-500" />
  },
  {
    title: "Premium Coaching",
    description: "Get personal guidance from experts",
    detail: "Connect with certified trainers for customized workout plans and feedback",
    icon: <Users className="h-5 w-5 text-indigo-500" />
  }
];

export function ActivityTracking() {
  const [selectedActivity, setSelectedActivity] = useState("all")
  const [isTracking, setIsTracking] = useState(false)
  const [activityData, setActivityData] = useState({
    steps: 0,
    heartRate: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    distance: 0
  })
  const [goals, setGoals] = useState({
    steps: 10000,
    activeMinutes: 150,
    caloriesBurned: 2500,
    distance: 5
  })
  const [isSettingGoal, setIsSettingGoal] = useState(false)
  const [currentGoalType, setCurrentGoalType] = useState("")
  const [goalValue, setGoalValue] = useState("")
  const [hydrationLevel, setHydrationLevel] = useState(0)
  const [hydrationGoal, setHydrationGoal] = useState(8)
  const [connectedDevices, setConnectedDevices] = useState<string[]>([])
  const [showDeviceConnect, setShowDeviceConnect] = useState(false)
  const [gpsTracking, setGpsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const [gpsHistory, setGpsHistory] = useState<{lat: number, lng: number, timestamp: number}[]>([])
  const [watchId, setWatchId] = useState<number | null>(null)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [deviceInfo, setDeviceInfo] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isSearchingBluetooth, setIsSearchingBluetooth] = useState(false)
  const [bluetoothDevices, setBluetoothDevices] = useState<any[]>([])
  const [premiumBenefitIndex, setPremiumBenefitIndex] = useState(0)
  const supabase = createClient()

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("steps, active_minutes, calories_burned, distance, hydration_level, hydration_goal, connected_devices")
            .eq("id", user.id)
            .single()

          if (profileData) {
            setActivityData({
              steps: profileData.steps || 0,
              heartRate: Math.floor(Math.random() * 40) + 60, // Simulate HR between 60-100
              activeMinutes: profileData.active_minutes || 0,
              caloriesBurned: profileData.calories_burned || 0,
              distance: profileData.distance || 0
            })
            
            // Also load hydration data if available
            setHydrationLevel(profileData.hydration_level || 0)
            setHydrationGoal(profileData.hydration_goal || 8)
            
            // Load any connected devices
            if (profileData.connected_devices && Array.isArray(profileData.connected_devices)) {
              setConnectedDevices(profileData.connected_devices)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [supabase])

  // Simulate real-time tracking when enabled
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isTracking) {
      interval = setInterval(() => {
        setActivityData(prev => {
          // Simulate random increases in stats when tracking is enabled
          const stepIncrease = Math.floor(Math.random() * 25) + 10
          const caloriesIncrease = Math.floor(Math.random() * 5) + 1
          const distanceIncrease = (Math.random() * 0.02) + 0.01
          const activeMinutesIncrease = Math.random() > 0.7 ? 1 : 0
          const heartRateChange = Math.floor(Math.random() * 5) - 2 // -2 to +2 change
          
          return {
            steps: prev.steps + stepIncrease,
            heartRate: Math.max(60, Math.min(100, prev.heartRate + heartRateChange)),
            activeMinutes: prev.activeMinutes + activeMinutesIncrease,
            caloriesBurned: prev.caloriesBurned + caloriesIncrease,
            distance: +(prev.distance + distanceIncrease).toFixed(2)
          }
        })
      }, 5000) // Update every 5 seconds
    }

    return () => clearInterval(interval)
  }, [isTracking])

  // Add a function to send email notifications
  const sendEmailNotification = async (type: string, data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          eventType: type,
          eventData: data
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending email notification:', errorData);
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  // Modify saveActivityData to include email notification
  const saveActivityData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            steps: activityData.steps,
            active_minutes: activityData.activeMinutes,
            calories_burned: activityData.caloriesBurned,
            distance: activityData.distance,
            hydration_level: hydrationLevel,
            hydration_goal: hydrationGoal,
            connected_devices: connectedDevices,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id)
        
        toast({
          title: "Activity data saved successfully",
          description: "Your fitness progress has been updated",
          duration: 3000
        })
        
        // Send email notification with activity summary
        sendEmailNotification('activityUpdate', {
          steps: activityData.steps,
          distance: activityData.distance.toFixed(2),
          activeMinutes: activityData.activeMinutes,
          caloriesBurned: activityData.caloriesBurned
        });
      }
    } catch (error) {
      console.error("Error saving activity data:", error)
      toast({
        title: "Error saving data",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000
      })
    }
  }

  const toggleTracking = async () => {
    const newTrackingState = !isTracking
    setIsTracking(newTrackingState)
    
    if (!newTrackingState) {
      // Save data when tracking is stopped
      await saveActivityData()
    }
  }

  const handleGoalSetting = (goalType: string) => {
    setIsSettingGoal(true)
    setCurrentGoalType(goalType)
    setGoalValue(goals[goalType as keyof typeof goals].toString())
  }

  const saveGoal = () => {
    const numValue = parseInt(goalValue)
    if (isNaN(numValue) || numValue <= 0) {
      toast({
        title: "Invalid goal value",
        description: "Please enter a positive number",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    setGoals(prev => ({
      ...prev,
      [currentGoalType]: numValue
    }))
    
    setIsSettingGoal(false)
    
    toast({
      title: "Goal updated",
      description: `Your ${currentGoalType} goal has been set to ${numValue}`,
      duration: 3000
    })
  }

  // Calculate percentages for progress bars
  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(100, Math.round((current / goal) * 100))
  }

  // Add these new functions for hydration tracking
  const addWaterIntake = (amount: number) => {
    const newLevel = Math.min(hydrationLevel + amount, hydrationGoal * 2) // Allow tracking over goal
    setHydrationLevel(newLevel)
    
    // Save to database
    saveHydrationData(newLevel)
    
    toast({
      title: "Hydration updated",
      description: `Added ${amount} cup(s) of water to your daily intake`,
      duration: 3000
    })
  }

  const resetHydration = () => {
    setHydrationLevel(0)
    saveHydrationData(0)
  }

  const saveHydrationData = async (level: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            hydration_level: level,
            hydration_goal: hydrationGoal,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id)
      }
    } catch (error) {
      console.error("Error saving hydration data:", error)
    }
  }

  // Modify connectDevice to include email notification
  const connectDevice = (deviceType: string) => {
    // In a real app, this would trigger the device pairing process
    // For demo purposes, we'll simulate connecting the device
    if (!connectedDevices.includes(deviceType)) {
      const newDevices = [...connectedDevices, deviceType]
      setConnectedDevices(newDevices)
      
      // Save to database
      saveConnectedDevices(newDevices)
      
      toast({
        title: "Device connected",
        description: `Successfully connected to ${deviceType}`,
        duration: 3000
      })
      
      // Send email notification for device connection
      sendEmailNotification('deviceConnected', {
        deviceName: deviceType
      });
    }
  }

  const disconnectDevice = (deviceType: string) => {
    const newDevices = connectedDevices.filter(d => d !== deviceType)
    setConnectedDevices(newDevices)
    
    // Save to database
    saveConnectedDevices(newDevices)
    
    toast({
      title: "Device disconnected",
      description: `Disconnected from ${deviceType}`,
      duration: 3000
    })
  }

  const saveConnectedDevices = async (devices: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from("profiles")
          .update({
            connected_devices: devices,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id)
      }
    } catch (error) {
      console.error("Error saving connected devices:", error)
    }
  }

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString() + ' - ' + now.toLocaleDateString());
    }, 1000);
    
    // Get device info
    const userAgent = navigator.userAgent;
    const deviceMatch = userAgent.match(/\(([^)]+)\)/);
    setDeviceInfo(deviceMatch ? deviceMatch[1] : userAgent);
    
    return () => clearInterval(intervalId);
  }, []);

  // Add effect to rotate premium benefits
  useEffect(() => {
    const interval = setInterval(() => {
      setPremiumBenefitIndex((prev) => (prev + 1) % premiumBenefits.length);
    }, 7000); // Change every 7 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Add these new functions for GPS tracking with weather data
  const startGpsTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS not available",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    // Start tracking
    setGpsTracking(true)
    
    // Clear any existing watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
    }
    
    // Start new watch
    const id = navigator.geolocation.watchPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ lat: latitude, lng: longitude })
        
        // Fetch weather data for the location
        fetchWeatherData(latitude, longitude);
        
        // Add to tracking history
        setGpsHistory(prevHistory => {
          const updatedHistory = [...prevHistory, { lat: latitude, lng: longitude, timestamp: Date.now() }];
          
          // Update distance if we're also activity tracking
          if (isTracking && prevHistory.length > 0) {
            const lastPoint = prevHistory[prevHistory.length - 1];
            const newDistance = calculateDistance(
              lastPoint.lat, lastPoint.lng,
              latitude, longitude
            );
            
            // Add to current distance (convert km to miles)
            setActivityData(prevData => ({
              ...prevData,
              distance: prevData.distance + (newDistance * 0.621371)
            }));
          }
          
          // Send real-time notification about tracking
          if (updatedHistory.length % 10 === 0) {
            toast({
              title: "GPS Tracking Update",
              description: `Tracked ${updatedHistory.length} points. Current position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              duration: 3000
            });
          }
          
          return updatedHistory;
        });
      },
      // Error callback
      (error) => {
        console.error("GPS Error:", error)
        let errorMessage = "Permission denied or location unavailable";
        
        // Extract message from error object if available
        if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.code) {
          // Handle known error codes
          switch(error.code) {
            case 1:
              errorMessage = "Permission denied. Please enable location access.";
              break;
            case 2:
              errorMessage = "Position unavailable. Check your device's GPS.";
              break;
            case 3:
              errorMessage = "Location request timed out. Try again.";
              break;
          }
        }
        
        toast({
          title: "GPS Error",
          description: `Could not get location: ${errorMessage}`,
          variant: "destructive",
          duration: 3000
        })
        stopGpsTracking()
      },
      // Options
      { 
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000 // Increased timeout for better reliability
      }
    )
    
    setWatchId(id)
    
    toast({
      title: "GPS tracking started",
      description: "Your location is now being tracked",
      duration: 3000
    })
  }

  // Function to fetch weather data
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // In a real app, you would use an actual weather API
      // This is a simulated response
      const weatherTypes = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear', 'Overcast'];
      const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
      const randomHumidity = Math.floor(Math.random() * 60) + 30; // 30-90%
      const randomWind = Math.floor(Math.random() * 30); // 0-30 km/h
      
      // Simulate API response
      const mockWeatherData = {
        weather: randomWeather,
        temperature: randomTemp,
        humidity: randomHumidity,
        windSpeed: randomWind,
        location: await reverseGeocode(lat, lon)
      };
      
      setWeatherData(mockWeatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  
  // Function to get location name from coordinates
  const reverseGeocode = async (lat: number, lon: number) => {
    // In a real app, you'd use a geocoding API
    // This is just a placeholder return value
    return "Your Current Location";
  };

  // Search for Bluetooth devices
  const searchBluetoothDevices = async () => {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth not available",
        description: "Web Bluetooth is not supported in your browser",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    setIsSearchingBluetooth(true);
    setBluetoothDevices([]);
    
    try {
      toast({
        title: "Searching for devices",
        description: "Looking for Bluetooth fitness devices nearby...",
        duration: 3000
      });
      
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['fitness_machine'] },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Apple Watch' },
        ],
        optionalServices: ['battery_service', 'device_information']
      });
      
      if (device) {
        setBluetoothDevices(prev => [...prev, {
          id: device.id,
          name: device.name || "Unknown Device",
          connected: device.gatt?.connected || false
        }]);
        
        connectDevice(device.name || "Bluetooth Device");
        
        toast({
          title: "Device found",
          description: `Found: ${device.name || "Unknown device"}`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Bluetooth error:", error);
      toast({
        title: "Bluetooth Error",
        description: error instanceof Error ? error.message : "Failed to connect to Bluetooth device",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSearchingBluetooth(false);
    }
  };

  const stopGpsTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    
    setGpsTracking(false)
    
    // Save GPS history to database if needed in a real app
    // saveGpsHistory(gpsHistory)
    
    toast({
      title: "GPS tracking stopped",
      description: `Tracked ${gpsHistory.length} location points`,
      duration: 3000
    })
  }

  // Calculate distance between two points in km (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Real-Time Activity Tracker</h2>
          <Button 
            onClick={toggleTracking}
            variant={isTracking ? "destructive" : "default"}
            className="transition-all"
          >
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </Button>
        </div>
        <p className="text-muted-foreground">
          Monitor your daily activities and track your fitness progress in real-time
          {isTracking && <span className="ml-2 animate-pulse text-primary">• Tracking Active</span>}
        </p>
      </div>

      <Tabs defaultValue="all" value={selectedActivity} onValueChange={setSelectedActivity} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-full">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All Activities</TabsTrigger>
          <TabsTrigger value="walking" className="rounded-full data-[state=active]:bg-white">Walking</TabsTrigger>
          <TabsTrigger value="running" className="rounded-full data-[state=active]:bg-white">Running</TabsTrigger>
          <TabsTrigger value="cycling" className="rounded-full data-[state=active]:bg-white">Cycling</TabsTrigger>
          <TabsTrigger value="swimming" className="rounded-full data-[state=active]:bg-white">Swimming</TabsTrigger>
          <TabsTrigger value="hiking" className="rounded-full data-[state=active]:bg-white">Hiking</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Steps Card */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" || selectedActivity === "walking" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-primary/10">
                <Footprints className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline">Daily</Badge>
            </div>
            <CardTitle className="mt-2">Step Tracking</CardTitle>
            <CardDescription>Monitor your daily steps and distance</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">{activityData.steps.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-2">steps today</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">{activityData.distance.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">miles</span>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">{activityData.caloriesBurned}</span>
                <span className="text-xs text-muted-foreground">calories</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{activityData.steps.toLocaleString()} steps</span>
                <div className="flex items-center gap-1">
                  <span>Goal: {goals.steps.toLocaleString()} steps</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-4 w-4"
                    onClick={() => handleGoalSetting('steps')}
                  >
                    <Target className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Progress value={getProgressPercentage(activityData.steps, goals.steps)} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>How to Track Your Daily Steps</DialogTitle>
                  <DialogDescription>Learn effective ways to monitor your step count</DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <YouTubeVideoPlayer
                    videoId={activityVideos.walking.videoId}
                    autoPlay={true}
                    className="w-full h-full"
                    mute={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        {/* Heart Rate Card */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" || selectedActivity === "running" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-red-100 dark:bg-red-900/30">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <Badge variant="outline">Real-time</Badge>
            </div>
            <CardTitle className="mt-2">Heart Rate</CardTitle>
            <CardDescription>Monitor your heart rate during activities</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <span className={`text-4xl font-bold ${isTracking ? 'animate-pulse' : ''}`}>
                {isTracking ? activityData.heartRate : '--'}
              </span>
              <span className="text-sm text-muted-foreground ml-2">BPM</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">{isTracking ? Math.max(60, activityData.heartRate - 10) : '--'}</span>
                <span className="text-xs text-muted-foreground">resting</span>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">{isTracking ? Math.min(160, activityData.heartRate + 50) : '--'}</span>
                <span className="text-xs text-muted-foreground">max</span>
              </div>
            </div>
            <div className="mt-4 h-10 w-full flex items-end space-x-[1px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`bg-red-${300 + (i % 3) * 100} w-full rounded-t ${isTracking ? 'animate-pulse' : ''}`} 
                  style={{ 
                    height: `${isTracking ? (20 + Math.random() * 80) : 10}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>Heart Rate Monitoring Basics</DialogTitle>
                  <DialogDescription>Understanding your heart rate during exercise</DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <YouTubeVideoPlayer
                    videoId={activityVideos.running.videoId}
                    autoPlay={true}
                    className="w-full h-full"
                    mute={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        {/* Active Minutes Card */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" || selectedActivity === "cycling" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-green-100 dark:bg-green-900/30">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <Badge variant="outline">Weekly</Badge>
            </div>
            <CardTitle className="mt-2">Active Minutes</CardTitle>
            <CardDescription>Track your activity minutes per day</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">{activityData.activeMinutes}</span>
              <span className="text-sm text-muted-foreground ml-2">mins today</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">{activityData.activeMinutes * 5}</span>
                <span className="text-xs text-muted-foreground">this week</span>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">{goals.activeMinutes}</span>
                <span className="text-xs text-muted-foreground">goal</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{activityData.activeMinutes} minutes</span>
                <div className="flex items-center gap-1">
                  <span>Goal: {goals.activeMinutes} minutes</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-4 w-4"
                    onClick={() => handleGoalSetting('activeMinutes')}
                  >
                    <Target className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Progress value={getProgressPercentage(activityData.activeMinutes, goals.activeMinutes)} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>Getting Started with Activity Tracking</DialogTitle>
                  <DialogDescription>Learn how to track your activity effectively</DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <YouTubeVideoPlayer
                    videoId={activityVideos.cycling.videoId}
                    autoPlay={true}
                    className="w-full h-full"
                    mute={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Goal Setting Dialog */}
        {isSettingGoal && (
          <Dialog open={isSettingGoal} onOpenChange={setIsSettingGoal}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set Activity Goal</DialogTitle>
                <DialogDescription>
                  Enter your target {currentGoalType.replace(/([A-Z])/g, ' $1').toLowerCase()} goal
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Input
                    id="goal"
                    type="number"
                    min="1"
                    value={goalValue}
                    onChange={(e) => setGoalValue(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setIsSettingGoal(false)}>Cancel</Button>
                <Button onClick={saveGoal}>Save Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Swimming Activity Card */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" || selectedActivity === "swimming" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-blue-100 dark:bg-blue-900/30">
                <Waves className="h-5 w-5 text-blue-500" />
              </div>
              <Badge variant="outline">Tracking</Badge>
            </div>
            <CardTitle className="mt-2">Swimming</CardTitle>
            <CardDescription>Track your swimming sessions and distance</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">0</span>
              <span className="text-sm text-muted-foreground ml-2">meters today</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">0</span>
                <span className="text-xs text-muted-foreground">sessions</span>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">--:--</span>
                <span className="text-xs text-muted-foreground">best time</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>Swimming Techniques for Fitness</DialogTitle>
                  <DialogDescription>Learn effective swimming techniques for a great workout</DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <YouTubeVideoPlayer
                    videoId={activityVideos.swimming.videoId}
                    autoPlay={true}
                    className="w-full h-full"
                    mute={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Hiking Activity Card */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" || selectedActivity === "hiking" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-amber-100 dark:bg-amber-900/30">
                <Mountain className="h-5 w-5 text-amber-500" />
              </div>
              <Badge variant="outline">Outdoor</Badge>
            </div>
            <CardTitle className="mt-2">Hiking</CardTitle>
            <CardDescription>Track your hiking trips and elevation</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">0</span>
              <span className="text-sm text-muted-foreground ml-2">miles hiked</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">0 ft</span>
                <span className="text-xs text-muted-foreground">elevation gain</span>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <span className="block font-medium">0</span>
                <span className="text-xs text-muted-foreground">trips</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>Hiking Tips & Techniques</DialogTitle>
                  <DialogDescription>Essential tips for safer and more enjoyable hiking</DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <YouTubeVideoPlayer
                    videoId={activityVideos.hiking.videoId}
                    autoPlay={true}
                    className="w-full h-full"
                    mute={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Premium Challenge Card */}
        <Card className="overflow-hidden hover:shadow-md transition-all bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-100 dark:border-indigo-900">
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-indigo-100 dark:bg-indigo-900/30">
                {premiumBenefits[premiumBenefitIndex].icon}
              </div>
              <Badge variant="secondary">Premium</Badge>
            </div>
            <CardTitle className="mt-2">{premiumBenefits[premiumBenefitIndex].title}</CardTitle>
            <CardDescription>{premiumBenefits[premiumBenefitIndex].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center p-4 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{premiumBenefits[premiumBenefitIndex].detail}</p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Link href="/premium">
                Upgrade to Premium
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Device Connection Card - Enhanced with Bluetooth */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-purple-100 dark:bg-purple-900/30">
                <SmartphoneCharging className="h-5 w-5 text-purple-500" />
              </div>
              <Badge variant="outline">Devices</Badge>
            </div>
            <CardTitle className="mt-2">Connected Devices</CardTitle>
            <CardDescription>Connect and manage your fitness trackers</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {connectedDevices.length > 0 ? (
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <div key={device} className="flex justify-between items-center p-2 rounded-lg bg-muted">
                    <span className="font-medium">{device}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-2"
                      onClick={() => disconnectDevice(device)}
                    >
                      Disconnect
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                <p>No fitness devices connected</p>
                <p className="text-xs mt-1">Connect a device to sync your activity data</p>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <Button 
                className="w-full" 
                onClick={() => setShowDeviceConnect(true)}
              >
                Connect via App
              </Button>
              <Button 
                className="w-full"
                variant="outline"
                onClick={searchBluetoothDevices}
                disabled={isSearchingBluetooth}
              >
                {isSearchingBluetooth ? "Searching..." : "Connect via Bluetooth"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GPS Tracking Card - Enhanced */}
        <Card className={`overflow-hidden hover:shadow-md transition-all ${selectedActivity === "all" || selectedActivity === "running" || selectedActivity === "walking" || selectedActivity === "hiking" ? "block" : "hidden"}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="rounded-lg p-2 bg-green-100 dark:bg-green-900/30">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <Badge variant={gpsTracking ? "default" : "outline"}>GPS</Badge>
            </div>
            <CardTitle className="mt-2">Real-Time GPS Tracking</CardTitle>
            <CardDescription>Track your routes and outdoor activities</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-muted rounded-lg p-4 mb-4 relative min-h-[120px] flex items-center justify-center">
              {currentLocation ? (
                <div className="text-center w-full">
                  <div className="flex items-center justify-center mb-2">
                    <Navigation className="h-6 w-6 text-primary mx-auto" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div className="text-right font-medium">Latitude:</div>
                    <div>{currentLocation.lat.toFixed(6)}</div>
                    <div className="text-right font-medium">Longitude:</div>
                    <div>{currentLocation.lng.toFixed(6)}</div>
                  </div>
                  
                  {/* Device and Time Info */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2 mb-1">
                    <Smartphone className="h-3 w-3" />
                    <span className="truncate max-w-[180px]" title={deviceInfo}>{deviceInfo}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{currentTime}</span>
                  </div>
                  
                  {/* Weather Data */}
                  {weatherData && (
                    <div className="border-t pt-2 mt-2">
                      <div className="text-sm font-medium mb-1">Weather Conditions</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center">
                          <Cloud className="h-3 w-3 mr-1" />
                          <span>{weatherData.weather}</span>
                        </div>
                        <div className="flex items-center">
                          <Thermometer className="h-3 w-3 mr-1" />
                          <span>{weatherData.temperature}°C</span>
                        </div>
                        <div className="flex items-center">
                          <Droplet className="h-3 w-3 mr-1" />
                          <span>{weatherData.humidity}%</span>
                        </div>
                        <div className="flex items-center">
                          <Wind className="h-3 w-3 mr-1" />
                          <span>{weatherData.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    {gpsHistory.length > 0 ? `${gpsHistory.length} points tracked` : 'GPS active'}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2" />
                  <p>Start GPS tracking to see location data</p>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-2">
              <Button
                variant={gpsTracking ? "destructive" : "default"}
                className="flex-1"
                onClick={gpsTracking ? stopGpsTracking : startGpsTracking}
              >
                {gpsTracking ? "Stop GPS" : "Start GPS"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/progress">
            <BarChart className="mr-2 h-4 w-4" />
            View Detailed Activity Reports
          </Link>
        </Button>
        <Button variant="outline">
          <Timer className="mr-2 h-4 w-4" />
          Set Activity Goals
        </Button>
      </div>
    </div>
  )
} 