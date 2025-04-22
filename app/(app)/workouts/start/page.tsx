"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { WorkoutCountdown } from "@/components/workouts/workout-countdown"
import { Play, Pause, SkipForward, CheckCircle, XCircle, Clock, Dumbbell, Heart, Flame, Volume2, VolumeX, Bluetooth } from "lucide-react"
import { DynamicBackground } from "@/components/workouts/dynamic-background"
import { YouTubeVideoPlayer } from "@/components/workout/youtube-video-player"

// Enhanced video library with better categorized exercise videos
interface VideoDetails {
  videoId: string;
  title: string;
  channel: string;
}

interface ExerciseVideoLibrary {
  [key: string]: VideoDetails;
}

const exerciseVideos: ExerciseVideoLibrary = {
  "Push-ups": {
    videoId: "IODxDxX7oi4", // Athlean-X
    title: "Perfect Push-up Form",
    channel: "Athlean-X"
  },
  "Squats": {
    videoId: "gsNoPYwWXeM", // Jeff Nippard
    title: "How to Squat Properly",
    channel: "Jeff Nippard"
  },
  "Dumbbell Rows": {
    videoId: "roCP6wCXPqo", // Jeremy Ethier
    title: "Perfect Dumbbell Row Form",
    channel: "Jeremy Ethier"
  },
  "Lunges": {
    videoId: "QOVaHwm-Q6U", // FitnessBlender
    title: "How to Do Lunges Correctly",
    channel: "FitnessBlender"
  },
  "Plank": {
    videoId: "ASdvN_XEl_c", // Calisthenicmovement
    title: "Perfect Plank Form Tutorial",
    channel: "Calisthenicmovement"
  },
  // Additional exercise videos
  "Deadlift": {
    videoId: "hCDzSR6bW10", 
    title: "How To Deadlift: Starting Strength",
    channel: "Starting Strength"
  },
  "Pull-ups": {
    videoId: "eGo4IYlbE5g",
    title: "The PERFECT Pull-up",
    channel: "Athlean-X"
  },
  "Bench Press": {
    videoId: "vcBig73ojF0",
    title: "How To Bench Press",
    channel: "Jeff Nippard"
  },
  // New exercises added
  "Overhead Press": {
    videoId: "QAQ64hK4Xxs",
    title: "How To: Overhead Press / Shoulder Press",
    channel: "Scott Herman Fitness"
  },
  "Bicep Curls": {
    videoId: "ykJmrZ5v0Oo",
    title: "The PERFECT Bicep Workout",
    channel: "Athlean-X"
  },
  "Tricep Extensions": {
    videoId: "REWv05om0ho",
    title: "How To Do Tricep Extensions",
    channel: "Mind Pump TV"
  },
  "Leg Press": {
    videoId: "IZxyjW7MPJQ",
    title: "How to Leg Press Correctly",
    channel: "ATHLEAN-X"
  },
  "Calf Raises": {
    videoId: "3UWi44yN-wM",
    title: "Standing Calf Raises",
    channel: "Howcast"
  },
  "Lat Pulldown": {
    videoId: "CAwf7n6Luuc",
    title: "How To: Lat Pulldown",
    channel: "ScottHermanFitness"
  },
  "Shoulder Raises": {
    videoId: "3VcKaXpzqRo",
    title: "How To Do Lateral Raises",
    channel: "Jeff Nippard"
  },
  "Cable Flyes": {
    videoId: "W7nbQQKYILM",
    title: "How To Do Cable Flyes",
    channel: "ATHLEAN-X"
  },
  "Romanian Deadlift": {
    videoId: "jEy_czb3RKA",
    title: "How To Romanian Deadlift",
    channel: "Jeff Nippard"
  },
  "Glute Bridges": {
    videoId: "OEewTj2n2J8",
    title: "How To Do Glute Bridges",
    channel: "Bret Contreras"
  },
  "Russian Twists": {
    videoId: "JyUqwkVpsi8",
    title: "How To Do Russian Twists",
    channel: "GymRa"
  },
  "Mountain Climbers": {
    videoId: "nmwgirgXLYM",
    title: "How To Do Mountain Climbers",
    channel: "SELF"
  },
  "Burpees": {
    videoId: "auBLPXFTaM8", 
    title: "How To Do A Burpee Properly",
    channel: "Howcast"
  },
  "Jump Squats": {
    videoId: "A-cFYWvaHr0",
    title: "How To Do Jump Squats",
    channel: "LivestrongWoman"
  },
  // Default fallback video
  "default": {
    videoId: "UoC_O3HzsH0", // MadFit full body workout
    title: "20 MIN FULL BODY WORKOUT",
    channel: "MadFit"
  }
}

// Function to find the best video match for an exercise
const findBestVideoMatch = (exerciseName: string): VideoDetails => {
  // Direct match
  if (exerciseVideos[exerciseName]) {
    return exerciseVideos[exerciseName];
  }
  
  // Try to find partial match
  const exerciseKey = Object.keys(exerciseVideos).find(key => 
    exerciseName.toLowerCase().includes(key.toLowerCase())
  );
  
  return exerciseKey ? exerciseVideos[exerciseKey] : exerciseVideos.default;
}

export default function StartExercisePage() {
  const router = useRouter()
  const [workout, setWorkout] = useState<any>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([])
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoDetails | null>(null)
  const [bluetoothAvailable, setBluetoothAvailable] = useState<boolean | null>(null)
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false)
  
  // Sample workout data (in a real app, this would come from the database)
  const sampleWorkout = {
    id: "1",
    name: "Full Body Strength",
    description: "A complete full body workout targeting all major muscle groups",
    exercises: [
      {
        id: "ex1",
        name: "Push-ups",
        sets: 3,
        reps: 12,
        weight: null,
        rest: 60,
        notes: "Keep your core tight and elbows close to your body",
      },
      {
        id: "ex2",
        name: "Squats",
        sets: 3,
        reps: 15,
        weight: null,
        rest: 60,
        notes: "Keep your knees aligned with your toes",
      },
      {
        id: "ex3",
        name: "Dumbbell Rows",
        sets: 3,
        reps: 10,
        weight: "20",
        rest: 60,
        notes: "Keep your back straight and pull with your back muscles",
      },
      {
        id: "ex4",
        name: "Lunges",
        sets: 3,
        reps: 12,
        weight: null,
        rest: 60,
        notes: "Step forward and lower your hips until both knees are bent at 90 degrees",
      },
      {
        id: "ex5",
        name: "Plank",
        sets: 3,
        reps: "30 sec",
        weight: null,
        rest: 60,
        notes: "Keep your body in a straight line from head to heels",
      },
    ],
    duration: 45,
    difficulty: "Intermediate",
    category: "Strength",
  }

  // Load workout data
  useEffect(() => {
    // In a real app, you would fetch this from an API or localStorage
    setWorkout(sampleWorkout)

    // Check if Bluetooth is available
    if ('bluetooth' in navigator) {
      setBluetoothAvailable(true)
    } else {
      setBluetoothAvailable(false)
    }

    // Start session timer
    const timer = setInterval(() => {
      if (!isPaused) {
        setSessionTime((prev) => prev + 1)

        // Update heart rate if not connected to a real device
        if (!isBluetoothConnected) {
          // Simulate heart rate changes based on exercise intensity
          setHeartRate((prev) => {
            const baseRate = prev || 70
            const intensity = currentExerciseIndex / (sampleWorkout.exercises.length - 1)
            const maxVariation = 10 + Math.floor(intensity * 20)
            const variation = Math.floor(Math.random() * maxVariation) - Math.floor(maxVariation / 2)
            const newRate = Math.max(60, Math.min(180, baseRate + variation))
            
            // Store heart rate history for trends
            setHeartRateHistory(prev => {
              const newHistory = [...prev, newRate]
              // Keep only the last 60 readings (1 minute at 1 reading per second)
              return newHistory.length > 60 ? newHistory.slice(-60) : newHistory
            })
            
            return newRate
          })
        }

        // Calculate calories burned based on heart rate (using a simple formula)
        // Formula: calories = (HR * weight * duration in hours * MET factor) / 60
        // where MET factor is an exercise-specific intensity factor
        if (heartRate) {
          // Assuming weight of 70 kg and MET factor of 8 for moderate exercise
          const weight = 70
          const metFactor = 8
          const durationHours = 1 / 3600 // 1 second in hours
          const caloriesPerSecond = (heartRate * weight * durationHours * metFactor) / 60
          setCaloriesBurned(prev => prev + caloriesPerSecond)
        } else {
          // Fallback if no heart rate data
          setCaloriesBurned((prev) => prev + 8 / 60)
        }
      }
    }, 1000)

    return () => {
      clearInterval(timer);
      // No need to clean up YouTube API directly
    }
  }, [isPaused, currentExerciseIndex, isBluetoothConnected])

  // Update current video when exercise changes
  useEffect(() => {
    if (workout) {
      const currentExercise = workout.exercises[currentExerciseIndex];
      const videoDetails = findBestVideoMatch(currentExercise.name);
      setCurrentVideo(videoDetails);
    }
  }, [workout, currentExerciseIndex]);

  if (!workout) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading workout...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const currentExercise = workout.exercises[currentExerciseIndex]
  const totalExercises = workout.exercises.length
  const progress =
    (currentExerciseIndex / totalExercises) * 100 +
    (currentSetIndex / (currentExercise?.sets || 1)) * (100 / totalExercises)

  function handleNextSet() {
    if (currentSetIndex + 1 < currentExercise.sets) {
      setCurrentSetIndex((prev) => prev + 1)
      setIsResting(true)
    } else {
      handleNextExercise()
    }
  }

  function handleNextExercise() {
    setIsResting(false)
    setCurrentSetIndex(0)

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1)
    } else {
      completeWorkout()
    }
  }

  function restComplete() {
    setIsResting(false)
  }

  function completeWorkout() {
    setWorkoutComplete(true)
    toast({
      title: "Workout Complete!",
      description: "Great job! You've finished your workout.",
    })
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  function toggleVideoMute() {
    setVideoMuted(!videoMuted)
  }

  // Connect to Bluetooth heart rate monitor
  const connectToHeartRateMonitor = async () => {
    if (!bluetoothAvailable) {
      toast({
        title: "Bluetooth Not Available",
        description: "Your device does not support Bluetooth connectivity.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Connecting",
        description: "Searching for heart rate monitors...",
      });

      // @ts-ignore - Web Bluetooth API types
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { namePrefix: 'Polar' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Wahoo' },
          { namePrefix: 'Fitbit' }
        ],
        optionalServices: ['heart_rate']
      });

      toast({
        title: "Device Found",
        description: `Found ${device.name || 'Heart Rate Monitor'}`,
      });

      // @ts-ignore - Web Bluetooth API types
      const server = await device.gatt?.connect();
      if (!server) throw new Error("Failed to connect to GATT server");
      
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      
      // Listen for heart rate notifications
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        // Heart rate is typically the second byte for most heart rate monitors
        // using standard Bluetooth Heart Rate Profile
        const heartRate = value.getUint8(1);
        setHeartRate(heartRate);
        
        // Store heart rate history for trends
        setHeartRateHistory(prev => {
          const newHistory = [...prev, heartRate];
          return newHistory.length > 60 ? newHistory.slice(-60) : newHistory;
        });
      });
      
      setIsBluetoothConnected(true);
      
      toast({
        title: "Connected",
        description: `Successfully connected to ${device.name || 'Heart Rate Monitor'}`,
      });
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to a heart rate monitor. Using simulated data instead.",
        variant: "destructive"
      });
    }
  };

  if (workoutComplete) {
    return (
      <DashboardShell>
        <DynamicBackground className="mb-8">
          <div className="p-10 text-white">
            <h1 className="text-3xl font-bold drop-shadow-md">Workout Complete!</h1>
            <p className="mt-2 text-lg drop-shadow-md">Great job! You've finished your workout.</p>
          </div>
        </DynamicBackground>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Workout Summary</CardTitle>
            <CardDescription>Here's how you did</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">{formatTime(sessionTime)}</h3>
                <p className="text-sm text-muted-foreground">Total Time</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Dumbbell className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">{totalExercises}</h3>
                <p className="text-sm text-muted-foreground">Exercises Completed</p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Flame className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">{Math.round(caloriesBurned)}</h3>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/workouts")}>
              Back to Workouts
            </Button>
            <Button onClick={() => router.push("/progress/new")}>Log Progress</Button>
          </CardFooter>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DynamicBackground className="mb-8">
        <div className="p-10 text-white">
          <h1 className="text-3xl font-bold drop-shadow-md">{workout.name}</h1>
          <p className="mt-2 text-lg drop-shadow-md">Keep pushing! You're doing great.</p>
          <div className="mt-2 text-sm font-semibold">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              {workout.category} • {workout.difficulty}
            </span>
          </div>
        </div>
      </DynamicBackground>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{isResting ? "Rest Period" : currentExercise?.name}</CardTitle>
                  <CardDescription>
                    {isResting
                      ? "Take a short break before the next set"
                      : `Set ${currentSetIndex + 1} of ${currentExercise?.sets}`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currentExerciseIndex + 1}/{totalExercises}
                  </div>
                  <div className="text-sm text-muted-foreground">Exercise</div>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              {isResting ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <h3 className="text-xl font-bold mb-4">Rest Time</h3>
                  <WorkoutCountdown seconds={60} onComplete={restComplete} isPaused={isPaused} />
                  <p className="mt-4 text-muted-foreground">
                    Next: {currentExercise?.name} - Set {currentSetIndex + 1 + 1}
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  {/* YouTube Video Demonstration */}
                  <div className="rounded-xl overflow-hidden mb-6 relative video-container">
                    {currentVideo && (
                      <>
                        <YouTubeVideoPlayer 
                          videoId={currentVideo.videoId} 
                          autoPlay={!isPaused && !isResting}
                          className="w-full h-full"
                          mute={true}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                          <div className="text-sm font-medium">{currentVideo.title}</div>
                          <div className="text-xs opacity-80">{currentVideo.channel}</div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Reps</div>
                      <div className="text-2xl font-bold">{currentExercise?.reps || "—"}</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="text-2xl font-bold">
                        {currentExercise?.weight ? `${currentExercise.weight} kg` : "Bodyweight"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button size="lg" variant="outline" className="w-1/3" onClick={() => setIsPaused(!isPaused)}>
                      {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      size="lg"
                      variant="default"
                      className="w-1/3 bg-green-600 hover:bg-green-700"
                      onClick={handleNextSet}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/workouts")}>
                <XCircle className="mr-2 h-4 w-4" />
                End Workout
              </Button>
              <Button variant="ghost" onClick={handleNextExercise}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coming Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((exercise: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps {exercise.weight ? `@ ${exercise.weight}kg` : ""}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{index === 0 ? "Next" : `+${index + 1}`}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Duration</span>
                  </div>
                  <div className="font-medium">{formatTime(sessionTime)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Calories</span>
                  </div>
                  <div className="font-medium">{Math.round(caloriesBurned)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Heart className={`h-4 w-4 mr-2 ${isBluetoothConnected ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                    <span>Heart Rate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium mr-2">{heartRate || "—"} bpm</div>
                    {bluetoothAvailable && !isBluetoothConnected && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs"
                        onClick={connectToHeartRateMonitor}
                      >
                        <Bluetooth className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>

                {/* Heart Rate Visualization - only show when we have data */}
                {heartRateHistory.length > 5 && (
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-1">Heart Rate Trend</div>
                    <div className="h-10 w-full flex items-end space-x-[1px]">
                      {heartRateHistory.slice(-30).map((rate: number, i: number) => {
                        // Calculate height percentage (60-180 bpm range)
                        const minRate = 60;
                        const maxRate = 180;
                        const percentage = Math.min(100, Math.max(0, ((rate - minRate) / (maxRate - minRate)) * 100));
                        
                        // Calculate color based on heart rate zone
                        let bgColor = "bg-green-400";
                        if (rate > 140) bgColor = "bg-red-500";
                        else if (rate > 120) bgColor = "bg-orange-400";
                        else if (rate > 100) bgColor = "bg-yellow-400";
                        
                        return (
                          <div 
                            key={i} 
                            className={`${bgColor} w-full rounded-t`} 
                            style={{ height: `${percentage}%` }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Exercises</span>
                  </div>
                  <div className="font-medium">
                    {currentExerciseIndex + 1}/{totalExercises}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workout Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{currentExercise?.notes || "No notes for this exercise."}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Motivational Quotes */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-indigo-100 dark:border-indigo-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Motivation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="italic text-sm text-center p-2">
                "The only bad workout is the one that didn't happen. Keep pushing!"
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

