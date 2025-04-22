"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Activity, Dumbbell, Utensils, BarChart, Award, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSupabase } from "@/app/supabase-provider"
import { toast } from "@/components/ui/use-toast"
import { recordActivity as recordUserActivity } from "@/lib/activity-tracking"
import { addNotification } from "@/lib/notifications"
import { getUserStreak } from "@/lib/streaks"

interface ProfileActivityProps {
  userId: string | undefined
}

// Define type interfaces for activity data
interface Workout {
  id: string
  name: string
  duration: number
  calories_burned: number
  exercises?: Array<{
    name: string
    sets: number
    reps: number
    weight: number
    weight_unit?: string
    notes?: string
  }>
  notes?: string
  date: string
  user_id: string
}

interface Nutrition {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  foods?: Array<{
    name: string
    servings: number
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
  notes?: string
  date: string
  user_id: string
}

interface Progress {
  id: string
  type: string
  value: number
  unit: string
  previous_value?: number
  change?: number
  notes?: string
  date: string
  user_id: string
}

interface Achievement {
  id: string
  name: string
  points: number
  description: string
  icon?: string
  date: string
  user_id: string
}

interface ActivityData {
  workouts: Workout[]
  nutrition: Nutrition[]
  progress: Progress[]
  achievements: Achievement[]
}

// Add this function after the imports and before the ProfileActivity component
function generateSampleData(date: Date): ActivityData {
  // Get day of week (0-6, where 0 is Sunday)
  const dayOfWeek = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  
  // Generate different data based on the day of week for variety
  const workouts: Workout[] = [];
  const nutrition: Nutrition[] = [];
  const progress: Progress[] = [];
  const achievements: Achievement[] = [];
  
  // Only show sample data for past dates, not future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate > today) {
    // Return empty data for future dates
    return { workouts, nutrition, progress, achievements };
  }
  
  // Workout data based on day of week
  if ([1, 3, 5].includes(dayOfWeek)) { // Monday, Wednesday, Friday - strength training
    workouts.push({
      id: `sample-workout-${day}-${month}`,
      name: dayOfWeek === 1 ? "Upper Body Strength" : dayOfWeek === 3 ? "Lower Body Power" : "Full Body Workout",
      duration: 45 + (day % 20), // 45-65 minutes
      calories_burned: 320 + (day % 150), // 320-470 calories
      exercises: [
        { name: "Bench Press", sets: 3, reps: 10, weight: 135 + (day % 50) },
        { name: "Squats", sets: 4, reps: 8, weight: 185 + (day % 70) },
        { name: "Pull-ups", sets: 3, reps: 8, weight: 0 }
      ],
      notes: "Felt strong today!",
      date: date.toISOString().split('T')[0],
      user_id: "sample"
    });
  } else if ([2, 4].includes(dayOfWeek)) { // Tuesday, Thursday - cardio
    workouts.push({
      id: `sample-workout-${day}-${month}`,
      name: dayOfWeek === 2 ? "HIIT Cardio" : "Endurance Run",
      duration: 30 + (day % 30), // 30-60 minutes
      calories_burned: 280 + (day % 200), // 280-480 calories
      exercises: [
        { name: "Treadmill Run", sets: 1, reps: 1, weight: 0, notes: "5km" },
        { name: "Rowing", sets: 3, reps: 1, weight: 0, notes: "500m each" }
      ],
      notes: "Great cardio session!",
      date: date.toISOString().split('T')[0],
      user_id: "sample"
    });
  } else if (dayOfWeek === 6) { // Saturday - yoga/mobility
    workouts.push({
      id: `sample-workout-${day}-${month}`,
      name: "Yoga & Mobility",
      duration: 60,
      calories_burned: 200 + (day % 100),
      exercises: [
        { name: "Yoga Flow", sets: 1, reps: 1, weight: 0 },
        { name: "Mobility Exercises", sets: 1, reps: 1, weight: 0 }
      ],
      notes: "Focused on recovery and flexibility",
      date: date.toISOString().split('T')[0],
      user_id: "sample"
    });
  }
  
  // Nutrition data - everyday but varies by day
  const mealNames = ["Balanced Breakfast", "Protein-packed Lunch", "Nutritious Dinner"];
  const mealIndex = day % 3;
  nutrition.push({
    id: `sample-nutrition-${day}-${month}`,
    name: mealNames[mealIndex],
    calories: 1800 + (dayOfWeek * 100) + (day % 400), // 1800-2600 calories varies by day
    protein: 120 + (day % 50), // 120-170g protein
    carbs: 180 + (day % 70), // 180-250g carbs
    fat: 60 + (day % 30), // 60-90g fat
    foods: [
      { name: "Chicken Breast", servings: 2, calories: 330, protein: 62, carbs: 0, fat: 8 },
      { name: "Brown Rice", servings: 1.5, calories: 340, protein: 7, carbs: 72, fat: 3 },
      { name: "Broccoli", servings: 2, calories: 60, protein: 5, carbs: 12, fat: 0 }
    ],
    notes: "Felt energized all day!",
    date: date.toISOString().split('T')[0],
    user_id: "sample"
  });
  
  // Progress data - show only on Mondays and Fridays
  if ([1, 5].includes(dayOfWeek)) {
    progress.push({
      id: `sample-progress-${day}-${month}`,
      type: "Weight",
      value: 180 - (day % 10), // Weight slowly decreasing
      previous_value: 181 - (day % 9),
      unit: "lbs",
      change: -1 - (day % 2),
      notes: "Weight is trending down!",
      date: date.toISOString().split('T')[0],
      user_id: "sample"
    });
    
    progress.push({
      id: `sample-progress-${day}-${month}-2`,
      type: "Body Fat",
      value: 18 - (month % 5) - (day % 2) / 10, // Body fat slowly decreasing
      previous_value: 18 - (month % 5) + 0.2,
      unit: "%",
      change: -0.2 - (day % 5) / 10,
      notes: "Body fat decreasing steadily",
      date: date.toISOString().split('T')[0],
      user_id: "sample"
    });
  }
  
  // Achievements - rare, only on specific days (1st and 15th)
  if (day === 1 || day === 15) {
    achievements.push({
      id: `sample-achievement-${day}-${month}`,
      name: day === 1 ? "Monthly Consistency Award" : "Two-Week Streak",
      points: day === 1 ? 50 : 25,
      description: day === 1 
        ? "Completed 20+ workouts last month!" 
        : "Maintained activity for 14 consecutive days!",
      date: date.toISOString().split('T')[0],
      user_id: "sample"
    });
  }
  
  return { workouts, nutrition, progress, achievements };
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const supabase = useSupabase()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [activityData, setActivityData] = useState<ActivityData>({
    workouts: [],
    nutrition: [],
    progress: [],
    achievements: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [calendarHighlights, setCalendarHighlights] = useState<Date[]>([])

  // Fetch activity data when user or date changes
  useEffect(() => {
    if (!userId) return
    
    async function fetchUserActivity() {
      setIsLoading(true)
      try {
        // Get activities from the last 90 days for calendar highlighting
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
        
        // Format date for Supabase query
        const formattedDateLimit = ninetyDaysAgo.toISOString().split('T')[0]
        
        // Get all days with activity for calendar highlighting
        try {
          const { data: activityDays, error: activityDaysError } = await supabase
            .from('user_activity')
            .select('date')
            .eq('user_id', userId)
            .gte('date', formattedDateLimit)
            .order('date', { ascending: false })
          
          if (activityDaysError) {
            // Check if this is a "table doesn't exist" error (42P01)
            if (activityDaysError.code === '42P01') {
              console.warn('user_activity table does not exist yet');
              
              // Generate sample activity dates for calendar highlighting
              const sampleHighlights: Date[] = [];
              const today = new Date();
              
              // Add activity for past 90 days based on day of week pattern
              for (let i = 0; i < 90; i++) {
                const pastDate = new Date();
                pastDate.setDate(today.getDate() - i);
                
                // Only highlight past dates with sample activities
                if (pastDate <= today) {
                  const dayOfWeek = pastDate.getDay();
                  
                  // Match our generateSampleData pattern - Mon, Tue, Wed, Thu, Fri, Sat
                  if (dayOfWeek >= 1 && dayOfWeek <= 6) {
                    sampleHighlights.push(new Date(pastDate));
                  }
                }
              }
              
              setCalendarHighlights(sampleHighlights);
            } else {
              throw activityDaysError;
            }
          } else {
            // Convert activity days to Date objects for calendar
            const highlights = activityDays?.map(day => new Date(day.date)) || []
            setCalendarHighlights(highlights)
          }
        } catch (calendarError) {
          console.warn('Error fetching calendar highlights:', calendarError);
          setCalendarHighlights([]);
        }
        
        // If a date is selected, fetch detailed activity for that day
        if (date) {
          await fetchActivityForDate(date)
        }
      } catch (error) {
        console.error('Error fetching user activity:', error)
        toast({
          title: "Error loading activity",
          description: "Could not load your activity history",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserActivity()
  }, [userId, supabase, date])
  
  // Modify the fetchActivityForDate function to include sample data when no real data exists
  async function fetchActivityForDate(selectedDate: Date) {
    if (!userId) return
    
    try {
      setIsLoading(true)
      
      // Format date for Supabase query (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0]
      
      // Prepare empty results in case of error
      let workoutsData: any[] = [];
      let nutritionData: any[] = [];
      let progressData: any[] = [];
      let achievementsData: any[] = [];
      
      // Fetch workouts for the selected date
      try {
        const { data: workouts, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', userId)
          .eq('date', formattedDate)
        
        if (workoutsError) {
          if (workoutsError.code === '42P01') {
            console.warn('workouts table does not exist yet');
          } else {
            throw workoutsError;
          }
        } else {
          workoutsData = workouts || [];
        }
      } catch (error) {
        console.warn('Error fetching workouts:', error);
      }
      
      // Fetch nutrition entries for the selected date
      try {
        const { data: nutrition, error: nutritionError } = await supabase
          .from('nutrition')
          .select('*')
          .eq('user_id', userId)
          .eq('date', formattedDate)
        
        if (nutritionError) {
          if (nutritionError.code === '42P01') {
            console.warn('nutrition table does not exist yet');
          } else {
            throw nutritionError;
          }
        } else {
          nutritionData = nutrition || [];
        }
      } catch (error) {
        console.warn('Error fetching nutrition:', error);
      }
      
      // Fetch progress entries for the selected date
      try {
        const { data: progress, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', userId)
          .eq('date', formattedDate)
        
        if (progressError) {
          if (progressError.code === '42P01') {
            console.warn('progress table does not exist yet');
          } else {
            throw progressError;
          }
        } else {
          progressData = progress || [];
        }
      } catch (error) {
        console.warn('Error fetching progress:', error);
      }
      
      // Fetch achievements for the selected date
      try {
        const { data: achievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId)
          .eq('date', formattedDate)
        
        if (achievementsError) {
          if (achievementsError.code === '42P01') {
            console.warn('achievements table does not exist yet');
          } else {
            throw achievementsError;
          }
        } else {
          achievementsData = achievements || [];
        }
      } catch (error) {
        console.warn('Error fetching achievements:', error);
      }
      
      // If no real data exists, generate sample data
      const hasNoRealData = 
        workoutsData.length === 0 && 
        nutritionData.length === 0 && 
        progressData.length === 0 && 
        achievementsData.length === 0;
      
      if (hasNoRealData) {
        const sampleData = generateSampleData(selectedDate);
        workoutsData = sampleData.workouts;
        nutritionData = sampleData.nutrition;
        progressData = sampleData.progress;
        achievementsData = sampleData.achievements;
      }
      
      // Update state with the fetched or sample data
      setActivityData({
        workouts: workoutsData,
        nutrition: nutritionData,
        progress: progressData,
        achievements: achievementsData
      })
    } catch (error) {
      console.error('Error fetching activity for date:', error)
      toast({
        title: "Error loading activity",
        description: "Could not load your activity for the selected date",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle date selection in calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      fetchActivityForDate(selectedDate)
    }
  }
  
  // Record new activity
  const recordActivity = async (activityType: string, activityDetails: any) => {
    if (!userId || !date) return
    
    try {
      // Add photos array for attachment support
      const photos = activityDetails.photos || []
      
      const result = await recordUserActivity({
        userId,
        date,
        activityType: activityType as 'workout' | 'nutrition' | 'progress',
        data: activityDetails,
        photos
      })
      
      if (!result.success) throw result.error
      
      // Refresh data for the current date
      await fetchActivityForDate(date)
      
      // Send more detailed notifications based on activity type
      if (activityType === 'workout') {
        // Send workout completion notification
        addNotification({
          title: "Workout Complete! 💪",
          message: `Great job completing your ${activityDetails.name || 'workout'}! You burned ${activityDetails.calories_burned || '0'} calories.`,
          type: "success",
          action: {
            text: "View Details",
            url: `/profile?tab=activity&date=${date.toISOString().split('T')[0]}`
          }
        });
        
        // Check if it's a streak achievement
        try {
          const streak = await getUserStreak(userId);
          if (streak % 5 === 0 && streak > 0) {
            addNotification({
              title: "Streak Achievement! 🔥",
              message: `Amazing! You've been active for ${streak} days in a row!`,
              type: "success",
              action: {
                text: "View Achievements",
                url: "/achievements"
              }
            });
          }
        } catch (streakError) {
          console.warn('Error fetching streak for notification:', streakError);
        }
      } 
      else if (activityType === 'nutrition') {
        addNotification({
          title: "Nutrition Logged 🥗",
          message: `You've logged your ${activityDetails.name || 'meal'} with ${activityDetails.calories || '0'} calories.`,
          type: "info",
          action: {
            text: "Nutrition Summary",
            url: "/nutrition"
          }
        });
      } 
      else if (activityType === 'progress') {
        // Calculate improvement percentage if available
        let improvementMessage = "";
        if (activityDetails.previous_value && activityDetails.value > activityDetails.previous_value) {
          const improvement = Math.round(((activityDetails.value - activityDetails.previous_value) / activityDetails.previous_value) * 100);
          improvementMessage = ` That's a ${improvement}% improvement!`;
        }
        
        addNotification({
          title: "Progress Update 📈",
          message: `You've recorded a new ${activityDetails.type || 'measurement'} of ${activityDetails.value} ${activityDetails.unit || 'units'}.${improvementMessage}`,
          type: "success",
          action: {
            text: "View Progress",
            url: "/progress"
          }
        });
      }
      
      toast({
        title: "Activity recorded",
        description: `Your ${activityType} has been recorded successfully`,
      })
      
    } catch (error) {
      console.error('Error recording activity:', error)
      toast({
        title: "Error recording activity",
        description: "Could not save your activity",
        variant: "destructive"
      })
    }
  }

  const openActivityDetails = (activity: any, type: string) => {
    setSelectedActivity({ ...activity, type })
  }

  // Check if there are any activities for the selected date
  const hasActivities = Object.values(activityData).some(arr => arr.length > 0)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-400">Activity Calendar</CardTitle>
          <CardDescription>View your fitness activities by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border bg-white dark:bg-gray-800"
            modifiers={{
              highlighted: calendarHighlights
            }}
            modifiersStyles={{
              highlighted: { 
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fontWeight: 'bold',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle>
            Activities for{" "}
            {date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : hasActivities ? (
            <Tabs defaultValue="workouts">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="workouts" className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" /> Workouts
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" /> Nutrition
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" /> Progress
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-1">
                  <Award className="h-4 w-4" /> Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workouts" className="space-y-4 pt-4">
                {activityData.workouts.length > 0 ? (
                  activityData.workouts.map((workout: any) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                          <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{workout.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {workout.duration} min · {workout.calories_burned} calories
                          </p>
                        </div>
                      </div>
                          <Button
                        size="sm"
                            variant="ghost"
                            onClick={() => openActivityDetails(workout, "workout")}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No workouts recorded for this date</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        // Example of recording a simple workout
                        recordActivity('workout', {
                          name: 'Quick Workout',
                          duration: 30,
                          calories_burned: 250,
                          notes: 'Recorded from profile activity'
                        })
                      }}
                    >
                      Record Workout
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-4 pt-4">
                {activityData.nutrition.length > 0 ? (
                  activityData.nutrition.map((meal: any) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                          <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{meal.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {meal.calories} calories · {meal.protein}g protein
                          </p>
                        </div>
                      </div>
                          <Button
                        size="sm"
                            variant="ghost"
                        onClick={() => openActivityDetails(meal, "nutrition")}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No nutrition entries recorded for this date</p>
                    <Button 
                      className="mt-4"
                      onClick={() => {
                        // Example of recording a simple meal
                        recordActivity('nutrition', {
                          name: 'Quick Meal',
                          calories: 500,
                          protein: 25,
                          carbs: 45,
                          fat: 15,
                          notes: 'Recorded from profile activity'
                        })
                      }}
                    >
                      Record Meal
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4 pt-4">
                {activityData.progress.length > 0 ? (
                  activityData.progress.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                          <BarChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{entry.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {entry.value} {entry.unit} {entry.change && entry.change !== 0 ? 
                              `(${entry.change > 0 ? '+' : ''}${entry.change} ${entry.unit})` : ''}
                          </p>
                        </div>
                      </div>
                          <Button
                        size="sm"
                            variant="ghost"
                        onClick={() => openActivityDetails(entry, "progress")}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No progress entries recorded for this date</p>
                    <Button 
                      className="mt-4"
                      onClick={() => {
                        // Example of recording a simple progress entry
                        recordActivity('progress', {
                          type: 'Weight',
                          value: 75.0,
                          unit: 'kg',
                          previous_value: 75.5,
                          change: -0.5,
                          notes: 'Recorded from profile activity'
                        })
                      }}
                    >
                      Record Progress
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 pt-4">
                {activityData.achievements.length > 0 ? (
                  activityData.achievements.map((achievement: any) => (
                    <div
                      key={achievement.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-2">
                          <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.points} points earned
                          </p>
                        </div>
                      </div>
                          <Button
                        size="sm"
                            variant="ghost"
                            onClick={() => openActivityDetails(achievement, "achievement")}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No achievements earned on this date</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {activityData.workouts.length > 0 || activityData.nutrition.length > 0 || 
                 activityData.progress.length > 0 || activityData.achievements.length > 0 
                  ? "Activity Summary" 
                  : "No Activity Recorded"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activityData.workouts.length > 0 || activityData.nutrition.length > 0 || 
                 activityData.progress.length > 0 || activityData.achievements.length > 0 
                  ? "This is sample activity data. Record your own activities to see your personal data here!" 
                  : "There are no activities recorded for this date. Start tracking your fitness journey!"}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  onClick={() => {
                    recordActivity('workout', {
                      name: 'Quick Workout',
                      duration: 30,
                      calories_burned: 250,
                      notes: 'Recorded from profile activity'
                    })
                  }}
                >
                  <Dumbbell className="h-4 w-4 mr-2" /> Record Workout
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    recordActivity('nutrition', {
                      name: 'Quick Meal',
                      calories: 500,
                      protein: 25,
                      carbs: 45,
                      fat: 15,
                      notes: 'Recorded from profile activity'
                    })
                  }}
                >
                  <Utensils className="h-4 w-4 mr-2" /> Record Meal
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    recordActivity('progress', {
                      type: 'Weight',
                      value: 75.0,
                      unit: 'kg',
                      previous_value: 75.5,
                      change: -0.5,
                      notes: 'Recorded from profile activity'
                    })
                  }}
                >
                  <BarChart className="h-4 w-4 mr-2" /> Record Progress
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedActivity.type === "workout"
                  ? "Workout Details"
                  : selectedActivity.type === "nutrition"
                  ? "Meal Details"
                  : selectedActivity.type === "progress"
                  ? "Progress Details"
                  : "Achievement Details"}
              </DialogTitle>
              <DialogDescription>
                {date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedActivity.type === "workout" && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedActivity.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Duration: {selectedActivity.duration} minutes | Calories: {selectedActivity.calories_burned}
                    </p>
                  </div>

                  {selectedActivity.exercises && selectedActivity.exercises.length > 0 ? (
                    <div>
                      <h4 className="font-medium mb-2">Exercises</h4>
                      <div className="space-y-2">
                        {selectedActivity.exercises.map((exercise: any, index: number) => (
                          <div key={index} className="border rounded-md p-2">
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm">
                              {exercise.sets} sets x {exercise.reps} reps
                              {exercise.weight > 0 ? ` @ ${exercise.weight} ${exercise.weight_unit || 'lbs'}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedActivity.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Notes</h4>
                      <p className="text-sm">{selectedActivity.notes}</p>
                    </div>
                  )}
                </>
              )}

              {selectedActivity.type === "nutrition" && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedActivity.name}</h3>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <div className="text-center p-2 bg-muted rounded-md">
                        <p className="font-medium">{selectedActivity.calories}</p>
                        <p className="text-xs">Calories</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-md">
                        <p className="font-medium">{selectedActivity.protein}g</p>
                        <p className="text-xs">Protein</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-md">
                        <p className="font-medium">{selectedActivity.carbs}g</p>
                        <p className="text-xs">Carbs</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-md">
                        <p className="font-medium">{selectedActivity.fat}g</p>
                        <p className="text-xs">Fat</p>
                      </div>
                    </div>
                  </div>

                  {selectedActivity.foods && selectedActivity.foods.length > 0 ? (
                    <div>
                      <h4 className="font-medium mb-2">Foods</h4>
                      <div className="space-y-2">
                        {selectedActivity.foods.map((food: any, index: number) => (
                          <div key={index} className="border rounded-md p-2">
                            <div className="flex justify-between">
                              <p className="font-medium">{food.name}</p>
                              <p className="text-sm">{food.servings} serving(s)</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {food.calories} cal | {food.protein}g protein | {food.carbs}g carbs | {food.fat}g fat
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedActivity.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Notes</h4>
                      <p className="text-sm">{selectedActivity.notes}</p>
                    </div>
                  )}
                </>
              )}

              {selectedActivity.type === "progress" && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedActivity.type}</h3>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Current Value</p>
                        <p className="font-semibold">
                          {selectedActivity.value} {selectedActivity.unit}
                        </p>
                      </div>

                      {selectedActivity.previous_value && (
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm font-medium">Previous Value</p>
                          <p className="text-sm">
                            {selectedActivity.previous_value} {selectedActivity.unit}
                          </p>
                        </div>
                      )}

                      {selectedActivity.change && (
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm font-medium">Change</p>
                          <p className={`text-sm ${selectedActivity.change > 0 ? 'text-green-500' : selectedActivity.change < 0 ? 'text-red-500' : ''}`}>
                            {selectedActivity.change > 0 ? '+' : ''}{selectedActivity.change} {selectedActivity.unit}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedActivity.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Notes</h4>
                      <p className="text-sm">{selectedActivity.notes}</p>
                    </div>
                  )}
                </>
              )}

              {selectedActivity.type === "achievement" && (
                <>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{selectedActivity.icon || '🏆'}</div>
                    <h3 className="font-semibold text-lg">{selectedActivity.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedActivity.points} points earned
                    </p>
                    <div className="p-3 bg-muted rounded-md mt-3">
                      <p>{selectedActivity.description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

