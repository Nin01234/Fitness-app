"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Timer } from "lucide-react"

// Define props interface
interface WorkoutCountdownProps {
  seconds?: number;
  onComplete?: () => void;
  isPaused?: boolean;
  showControls?: boolean;
}

export function WorkoutCountdown({
  seconds = 300,
  onComplete,
  isPaused = false,
  showControls = true
}: WorkoutCountdownProps) {
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer")
  const [time, setTime] = useState(seconds)
  const [initialTime, setInitialTime] = useState(seconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Update time when seconds prop changes
  useEffect(() => {
    setTime(seconds);
    setInitialTime(seconds);
  }, [seconds]);

  // Handle external pause control
  useEffect(() => {
    if (isPaused && isRunning) {
      pauseTimer();
    } else if (!isPaused && !isRunning && time > 0) {
      startTimer();
    }
  }, [isPaused]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle start/pause
  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  // Start timer
  const startTimer = () => {
    if (mode === "timer" && time === 0) {
      // If timer is at 0, reset to initial time
      setTime(initialTime)
    }

    setIsRunning(true)

    if (!isMuted) {
      playSound("start")
    }

    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (mode === "timer") {
          // Timer mode (countdown)
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)

            if (!isMuted) {
              playSound("complete")
            }

            // Call onComplete callback if provided
            if (onComplete) {
              onComplete();
            }

            return 0
          }
          return prevTime - 1
        } else {
          // Stopwatch mode (count up)
          return prevTime + 1
        }
      })
    }, 1000)
  }

  // Pause timer
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)

    if (!isMuted) {
      playSound("pause")
    }
  }

  // Reset timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)

    if (mode === "timer") {
      setTime(initialTime)
    } else {
      setTime(0)
    }

    if (!isMuted) {
      playSound("reset")
    }
  }

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputMinutes = Number.parseInt(e.target.value)
    if (!isNaN(inputMinutes)) {
      const newTime = inputMinutes * 60
      setInitialTime(newTime)
      if (!isRunning) {
        setTime(newTime)
      }
    }
  }

  // Handle mode change
  const handleModeChange = (value: string) => {
    setMode(value as "timer" | "stopwatch")
    resetTimer()
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  // Play sound effect
  const playSound = (type: "start" | "pause" | "reset" | "complete" | "tick") => {
    if (isMuted) return

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      let soundUrl = ""
      switch (type) {
        case "start":
          soundUrl = "/sounds/timer-start.mp3"
          break
        case "pause":
          soundUrl = "/sounds/timer-pause.mp3"
          break
        case "reset":
          soundUrl = "/sounds/timer-reset.mp3"
          break
        case "complete":
          soundUrl = "/sounds/timer-complete.mp3"
          break
        case "tick":
          soundUrl = "/sounds/timer-tick.mp3"
          break
      }

      audioRef.current = new Audio(soundUrl)
      audioRef.current.volume = volume / 100
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
    } catch (error) {
      console.error("Error playing sound:", error)
    }
  }

  // Play tick sound every 10 seconds in timer mode
  useEffect(() => {
    if (isRunning && mode === "timer" && time > 0 && time % 10 === 0 && time !== initialTime) {
      if (!isMuted) {
        playSound("tick")
      }
    }
  }, [time, isRunning, mode, initialTime, isMuted])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Calculate progress percentage for timer mode
  const calculateProgress = () => {
    if (mode === "timer") {
      return ((initialTime - time) / initialTime) * 100
    }
    return 0
  }

  // If only using as a countdown without controls
  if (!showControls) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold tabular-nums">{formatTime(time)}</div>
        <div className="mt-4 w-full max-w-[200px] h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </div>
    );
  }

  // Full component with controls
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Workout Timer</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
          </div>
        </div>
        <CardDescription>Track your workout time and rest periods</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <Tabs defaultValue="timer" value={mode} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer" className="flex items-center gap-1">
              <Timer className="h-4 w-4" /> Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Stopwatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold tabular-nums">{formatTime(time)}</div>

              <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timer-minutes">Set Timer (minutes)</Label>
              <Input
                id="timer-minutes"
                type="number"
                min="1"
                max="60"
                value={Math.floor(initialTime / 60)}
                onChange={handleTimeChange}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume-slider">Volume</Label>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              <Slider
                id="volume-slider"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={handleVolumeChange}
                disabled={isMuted}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <Switch id="sound-effects" checked={!isMuted} onCheckedChange={() => setIsMuted(!isMuted)} />
            </div>
          </TabsContent>

          <TabsContent value="stopwatch" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold tabular-nums">{formatTime(time)}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume-slider-stopwatch">Volume</Label>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              <Slider
                id="volume-slider-stopwatch"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={handleVolumeChange}
                disabled={isMuted}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects-stopwatch">Sound Effects</Label>
              <Switch id="sound-effects-stopwatch" checked={!isMuted} onCheckedChange={() => setIsMuted(!isMuted)} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={resetTimer}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={toggleTimer}>
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

