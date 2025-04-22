import { createClient } from "@/lib/supabase/client"

interface ActivityOptions {
  userId: string
  date?: Date
  activityType: 'workout' | 'nutrition' | 'progress'
  data: Record<string, any>
  photos?: string[] // URLs of uploaded photos
}

/**
 * Records user activity to the appropriate tables and updates the user activity log
 * @param options ActivityOptions object containing activity details
 * @returns Promise resolving to success status
 */
export async function recordActivity(options: ActivityOptions): Promise<{ success: boolean; error: any | null; activityId?: string }> {
  const { userId, date = new Date(), activityType, data, photos = [] } = options
  const supabase = createClient()
  
  if (!userId) {
    return { success: false, error: 'User ID is required' }
  }
  
  // Validate date - prevent future dates
  const currentDate = new Date()
  currentDate.setHours(23, 59, 59, 999) // End of today
  
  if (date > currentDate) {
    return { 
      success: false, 
      error: 'Cannot record activities for future dates' 
    }
  }
  
  try {
    // Format date for Supabase (YYYY-MM-DD)
    const formattedDate = date.toISOString().split('T')[0]
    
    // Insert into the appropriate table based on activity type
    let result
    let activityId: string | undefined
    
    switch (activityType) {
      case 'workout':
        result = await supabase
          .from('workouts')
          .insert({
            user_id: userId,
            date: formattedDate,
            ...data
          })
          .select('id') // Return the ID for reference
        
        if (result.data && result.data.length > 0) {
          activityId = result.data[0].id
        }
        break
        
      case 'nutrition':
        result = await supabase
          .from('nutrition')
          .insert({
            user_id: userId,
            date: formattedDate,
            ...data
          })
          .select('id')
        
        if (result.data && result.data.length > 0) {
          activityId = result.data[0].id
        }
        break
        
      case 'progress':
        result = await supabase
          .from('progress')
          .insert({
            user_id: userId,
            date: formattedDate,
            ...data
          })
          .select('id')
        
        if (result.data && result.data.length > 0) {
          activityId = result.data[0].id
        }
        break
        
      default:
        return { success: false, error: 'Invalid activity type' }
    }
    
    if (result.error) throw result.error
    
    // Store photos if provided
    if (photos.length > 0 && activityId) {
      const photoEntries = photos.map((photoUrl, index) => ({
        activity_id: activityId,
        activity_type: activityType,
        user_id: userId,
        photo_url: photoUrl,
        upload_date: new Date().toISOString(),
        display_order: index,
      }))
      
      const { error: photoError } = await supabase
        .from('activity_photos')
        .insert(photoEntries)
      
      if (photoError) {
        console.error('Error storing photo references:', photoError)
        // Continue execution even if photo storage fails
      }
    }
    
    // Record in user_activity table for streak tracking
    const { error: activityError } = await supabase
      .from('user_activity')
      .upsert({
        user_id: userId,
        date: formattedDate,
        activity_type: activityType
      }, {
        onConflict: 'user_id,date'
      })
    
    if (activityError) throw activityError
    
    // Update user's points
    const pointsToAdd = activityType === 'workout' ? 20 : 10
    
    const { error: pointsError } = await supabase.rpc('increment_user_points', {
      user_id_input: userId,
      points_to_add: pointsToAdd
    })
    
    if (pointsError) {
      console.error('Error updating user points:', pointsError)
      // Continue execution even if points update fails
    }
    
    // Send notification via email for completed workouts
    if (activityType === 'workout') {
      try {
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            eventType: 'workoutComplete',
            eventData: {
              workoutName: data.workout_name || 'Workout',
              duration: data.duration || 0,
              caloriesBurned: data.calories_burned || 0,
              weeklyProgress: 0, // Calculate if available
            },
          }),
        });
      } catch (notificationError) {
        console.error('Error sending workout notification:', notificationError);
        // Continue execution even if notification fails
      }
    }
    
    return { success: true, error: null, activityId }
  } catch (error) {
    console.error('Error recording activity:', error)
    return { success: false, error }
  }
}

/**
 * Gets a user's current streak of consecutive days with activity
 * @param userId The user's ID
 * @returns Promise resolving to the current streak count
 */
export async function getUserStreak(userId: string): Promise<number> {
  if (!userId) return 0
  
  try {
    const supabase = createClient()
    
    // Get recent activity sorted by date (newest first)
    const { data: activityData, error } = await supabase
      .from('user_activity')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(60) // Limit to 60 days (reasonable max streak)
    
    if (error) throw error
    if (!activityData || activityData.length === 0) return 0
    
    // Get today's date and set time to beginning of day
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Sort activity by date (newest first)
    const sortedActivity = activityData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    let streak = 0
    
    // Check if today has activity
    const hasTodayActivity = sortedActivity.some(activity => {
      const activityDate = new Date(activity.date)
      activityDate.setHours(0, 0, 0, 0)
      return activityDate.getTime() === today.getTime()
    })
    
    // Starting point depends on if there is activity today
    let currentDate = new Date(today)
    if (!hasTodayActivity) {
      // Check if yesterday has activity
      currentDate.setDate(currentDate.getDate() - 1)
      const hasYesterdayActivity = sortedActivity.some(activity => {
        const activityDate = new Date(activity.date)
        activityDate.setHours(0, 0, 0, 0)
        return activityDate.getTime() === currentDate.getTime()
      })
      
      if (!hasYesterdayActivity) {
        return 0 // Streak broken
      }
    }
    
    // Count consecutive days with activity
    for (let i = 0; i < 365; i++) { // Limit to a year
      const dateToCheck = new Date(today)
      dateToCheck.setDate(dateToCheck.getDate() - i)
      dateToCheck.setHours(0, 0, 0, 0)
      
      const hasActivity = sortedActivity.some(activity => {
        const activityDate = new Date(activity.date)
        activityDate.setHours(0, 0, 0, 0)
        return activityDate.getTime() === dateToCheck.getTime()
      })
      
      if (hasActivity) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  } catch (error) {
    console.error('Error getting user streak:', error)
    return 0
  }
}

/**
 * Gets user stats for profile display
 * @param userId The user's ID
 * @returns Promise resolving to user stats object
 */
export async function getUserStats(userId: string): Promise<{
  workouts: number;
  calories: number;
  streak: number;
  achievements: number;
  goalProgress: { weight: number; workout: number; nutrition: number };
}> {
  if (!userId) {
    return {
      workouts: 0,
      calories: 0,
      streak: 0,
      achievements: 0,
      goalProgress: { weight: 0, workout: 0, nutrition: 0 }
    }
  }
  
  try {
    const supabase = createClient()
    
    // Get workout count
    let workoutsCount = 0
    let totalCalories = 0
    let achievementsCount = 0
    
    try {
      const { count, error } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      if (!error) {
        workoutsCount = count || 0
      }
    } catch (e) {
      console.warn('Error fetching workouts count:', e)
    }
    
    // Get total calories burned
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('calories_burned')
        .eq('user_id', userId)
      
      if (!error && data) {
        totalCalories = data.reduce((total, workout) => 
          total + (workout.calories_burned || 0), 0)
      }
    } catch (e) {
      console.warn('Error fetching calories:', e)
    }
    
    // Get achievements count
    try {
      const { count, error } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      if (!error) {
        achievementsCount = count || 0
      }
    } catch (e) {
      console.warn('Error fetching achievements count:', e)
    }
    
    // Get goals progress
    let weightProgress = 0
    let workoutProgress = 0
    let nutritionProgress = 0
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
      
      if (!error && data) {
        const weightGoals = data.filter(g => g.goal_type === 'weight')
        const workoutGoals = data.filter(g => g.goal_type === 'workout')
        const nutritionGoals = data.filter(g => g.goal_type === 'nutrition')
        
        const calculateProgress = (goalList: any[]) => {
          if (goalList.length === 0) return 0
          
          const totalProgress = goalList.reduce((sum, goal) => {
            if (goal.target_value && goal.target_value > 0) {
              const progress = Math.min(100, (goal.current_value / goal.target_value) * 100)
              return sum + progress
            }
            return sum
          }, 0)
          
          return Math.round(totalProgress / goalList.length)
        }
        
        weightProgress = calculateProgress(weightGoals)
        workoutProgress = calculateProgress(workoutGoals)
        nutritionProgress = calculateProgress(nutritionGoals)
      }
    } catch (e) {
      console.warn('Error fetching goals:', e)
    }
    
    // Return stats with a placeholder for streak
    // Stream will be calculated separately to avoid circular dependencies
    return {
      workouts: workoutsCount,
      calories: totalCalories,
      streak: 0, // Will be filled in by the parent component
      achievements: achievementsCount,
      goalProgress: {
        weight: weightProgress,
        workout: workoutProgress,
        nutrition: nutritionProgress
      }
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return {
      workouts: 0,
      calories: 0,
      streak: 0,
      achievements: 0,
      goalProgress: { weight: 0, workout: 0, nutrition: 0 }
    }
  }
}

/**
 * Retrieves photos associated with a specific activity
 * @param activityId The activity ID
 * @param activityType The type of activity
 * @returns Promise resolving to an array of photo URLs
 */
export async function getActivityPhotos(activityId: string, activityType: string): Promise<string[]> {
  if (!activityId || !activityType) return []
  
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('activity_photos')
      .select('photo_url')
      .eq('activity_id', activityId)
      .eq('activity_type', activityType)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    
    return data?.map(item => item.photo_url) || []
  } catch (error) {
    console.error('Error retrieving activity photos:', error)
    return []
  }
} 