"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Flame, Heart, Trophy, Utensils, BookOpen, Bike, CalendarCheck, ArrowUp, ArrowDown, Zap } from "lucide-react"
import { CountUp } from "@/components/ui/count-up"

interface DashboardStatsProps {
  profile?: any
}

export function DashboardStats({ profile }: DashboardStatsProps) {
  // Create state for the dynamic stats
  const [calorieProgress, setCalorieProgress] = useState(65)
  const [heartRate, setHeartRate] = useState(72)
  const [workoutsCompleted, setWorkoutsCompleted] = useState(18)
  const [workoutStreak, setWorkoutStreak] = useState(5)
  const [achievementCount, setAchievementCount] = useState(7)
  const [steps, setSteps] = useState(6841)
  const [proteinIntake, setProteinIntake] = useState(87)
  const [waterIntake, setWaterIntake] = useState(1200)
  const [calories, setCalories] = useState(2200)

  // Use effects to simulate live data updates
  useEffect(() => {
    // Random number generator in a range
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Update heart rate every 3 seconds
    const heartRateInterval = setInterval(() => {
      setHeartRate(prev => {
        const variation = random(-3, 3);
        return Math.max(65, Math.min(85, prev + variation));
      });
    }, 3000);

    // Update calorie progress periodically
    const calorieInterval = setInterval(() => {
      setCalorieProgress(prev => {
        const newVal = prev + random(-2, 2);
        return Math.max(40, Math.min(90, newVal));
      });
    }, 5000);

    // Update steps every 10 seconds to simulate walking
    const stepsInterval = setInterval(() => {
      setSteps(prev => prev + random(15, 60));
    }, 10000);

    // Gradually update water intake to simulate drinking
    const waterInterval = setInterval(() => {
      setWaterIntake(prev => {
        // 20% chance of increasing water intake
        if (Math.random() < 0.2) {
          return Math.min(2500, prev + 250); // Add a cup of water
        }
        return prev;
      });
    }, 20000);

    // Update protein intake occasionally
    const proteinInterval = setInterval(() => {
      setProteinIntake(prev => {
        // 15% chance of increasing protein
        if (Math.random() < 0.15) {
          return Math.min(160, prev + random(5, 15));
        }
        return prev;
      });
    }, 25000);

    // Once a day, potentially increase workout streak
    const workoutStreakInterval = setInterval(() => {
      const today = new Date().getDay();
      // If it's a weekday and a 70% chance
      if (today !== 0 && today !== 6 && Math.random() < 0.7) {
        setWorkoutStreak(prev => prev + 1);
        setWorkoutsCompleted(prev => prev + 1);
      }
    }, 86400000); // 24 hours

    // Simulate calorie burn throughout the day
    const caloriesBurnedInterval = setInterval(() => {
      setCalories(prev => {
        const hour = new Date().getHours();
        // More active during daytime
        const burnRate = hour >= 8 && hour <= 20 ? random(5, 15) : random(1, 5);
        return Math.max(0, prev - burnRate);
      });
    }, 15000);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(heartRateInterval);
      clearInterval(calorieInterval);
      clearInterval(stepsInterval);
      clearInterval(waterInterval);
      clearInterval(proteinInterval);
      clearInterval(workoutStreakInterval);
      clearInterval(caloriesBurnedInterval);
    };
  }, []);

  // For demo purposes, simulate a data refresh when component mounts
  useEffect(() => {
    // Simulate initial data loading with slight delay and animation
    const timeout = setTimeout(() => {
      setWorkoutsCompleted(prev => prev + 1);
      setAchievementCount(prev => prev + 1);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
              <Dumbbell className="mr-2 h-5 w-5" /> Workouts
            </CardTitle>
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
              <CountUp value={workoutsCompleted} duration={2} />
            </div>
          </div>
          <CardDescription>
            <span className="font-medium">{workoutStreak} day</span> streak
            <Badge variant="outline" className="ml-2 bg-blue-100 dark:bg-blue-900">
              <ArrowUp className="h-3 w-3 mr-1 text-green-600" /> 12%
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm mt-2">
            <div className="flex items-center">
              <CalendarCheck className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
              <span>This week: 3/5</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1 text-amber-600 dark:text-amber-400" />
              <span>{Math.round(workoutsCompleted * 120)} mins</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950 dark:to-amber-950 border-red-100 dark:border-red-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center text-red-700 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
              <Flame className="mr-2 h-5 w-5" /> Calories
            </CardTitle>
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
              <CountUp value={calorieProgress} duration={1.5} />%
            </div>
              </div>
          <CardDescription>
            <span className="font-medium">
              <CountUp value={calories} duration={1.5} />
            </span> remaining today
            <Badge variant="outline" className="ml-2 bg-red-100 dark:bg-red-900">
              <ArrowDown className="h-3 w-3 mr-1 text-amber-600" /> {Math.round(100-calorieProgress)}%
            </Badge>
          </CardDescription>
            </CardHeader>
        <CardContent>
          <Progress value={calorieProgress} className="h-2 bg-red-100 dark:bg-red-900/50" />
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-red-800 dark:text-red-300">Goal: 1,800</span>
            <span className="text-muted-foreground">Active: 320</span>
          </div>
            </CardContent>
          </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-100 dark:border-green-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center text-green-700 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
              <Trophy className="mr-2 h-5 w-5" /> Achievements
            </CardTitle>
            <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
              <CountUp value={achievementCount} duration={1} />
            </div>
          </div>
          <CardDescription>
            <span className="font-medium">3 new</span> this month
            <Badge variant="outline" className="ml-2 bg-green-100 dark:bg-green-900">
              <ArrowUp className="h-3 w-3 mr-1 text-green-600" /> 2 badges
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm mt-2">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
              <span>Level {Math.floor(achievementCount / 2) + 1}</span>
            </div>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-1 text-amber-600 dark:text-amber-400" />
              <span>{achievementCount * 50} points</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-100 dark:border-purple-800 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
              <Heart className="mr-2 h-5 w-5" /> Health
            </CardTitle>
            <div className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
              <CountUp value={heartRate} duration={1} />
            </div>
          </div>
          <CardDescription>
            <span className="font-medium">
              <CountUp value={steps} duration={2} />
            </span> steps today
            <div className="inline-flex items-center ml-2 text-xs font-medium rounded-full px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              {heartRate} bpm
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm mt-2">
            <div className="flex items-center">
              <Utensils className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
              <span>Protein: {proteinIntake}g</span>
            </div>
            <div className="flex items-center">
              <Bike className="h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400" />
              <span>Water: {(waterIntake / 1000).toFixed(1)}L</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

