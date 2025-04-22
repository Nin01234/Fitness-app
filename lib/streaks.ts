import { createClient } from "@/lib/supabase/client";

/**
 * Gets a user's current streak of consecutive days with activity
 * @param userId The user's ID
 * @returns Promise resolving to the current streak count
 */
export async function getUserStreak(userId: string): Promise<number> {
  if (!userId) return 0;
  
  try {
    const supabase = createClient();
    
    // Check if the user_activity table exists
    try {
      const { error: tableCheckError } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .limit(1);
      
      // If the table doesn't exist, return 0 instead of throwing an error
      if (tableCheckError) {
        if (tableCheckError.code === '42P01') {
          console.warn('user_activity table does not exist yet. Please run the database migrations.');
          return 0;
        } else {
          console.warn('Error checking user_activity table:', tableCheckError);
          return 0;
        }
      }
      
      // Get recent activity sorted by date (newest first)
      try {
        const { data: activityData, error } = await supabase
          .from('user_activity')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(60); // Limit to 60 days (reasonable max streak)
        
        if (error) {
          console.warn('Error fetching activity data:', error);
          return 0;
        }
        
        if (!activityData || activityData.length === 0) return 0;
        
        // Get today's date and set time to beginning of day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Sort activity by date (newest first)
        const sortedActivity = activityData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        let streak = 0;
        
        // Check if today has activity
        const hasTodayActivity = sortedActivity.some(activity => {
          const activityDate = new Date(activity.date);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate.getTime() === today.getTime();
        });
        
        // Starting point depends on if there is activity today
        let currentDate = new Date(today);
        if (!hasTodayActivity) {
          // Check if yesterday has activity
          currentDate.setDate(currentDate.getDate() - 1);
          const hasYesterdayActivity = sortedActivity.some(activity => {
            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);
            return activityDate.getTime() === currentDate.getTime();
          });
          
          if (!hasYesterdayActivity) {
            return 0; // Streak broken
          }
        }
        
        // Count consecutive days with activity
        for (let i = 0; i < 365; i++) { // Limit to a year
          const dateToCheck = new Date(today);
          dateToCheck.setDate(dateToCheck.getDate() - i);
          dateToCheck.setHours(0, 0, 0, 0);
          
          const hasActivity = sortedActivity.some(activity => {
            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);
            return activityDate.getTime() === dateToCheck.getTime();
          });
          
          if (hasActivity) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      } catch (fetchError) {
        console.error('Error processing user activity data:', fetchError);
        return 0;
      }
    } catch (innerError) {
      console.error('Error in user activity check:', innerError);
      return 0;
    }
  } catch (error) {
    console.error('Error getting user streak:', error);
    return 0;
  }
}

/**
 * Checks if the user has reached a streak milestone
 * @param userId User ID
 * @returns Promise resolving to a milestone object if reached, null otherwise
 */
export async function checkStreakMilestone(userId: string): Promise<{ days: number, message: string } | null> {
  if (!userId) return null;
  
  try {
    const streak = await getUserStreak(userId);
    
    // Define milestone days to check
    const milestones = [3, 5, 7, 10, 14, 21, 30, 50, 75, 100, 150, 200, 365];
    
    // Check if current streak matches a milestone
    const milestone = milestones.find(m => m === streak);
    
    if (milestone) {
      // Different messages based on the milestone
      let message = '';
      
      if (milestone <= 7) {
        message = `Great start! You've been active for ${milestone} days in a row.`;
      } else if (milestone <= 30) {
        message = `Amazing consistency! ${milestone} day streak achieved.`;
      } else if (milestone <= 100) {
        message = `Incredible discipline! ${milestone} day streak - you're a fitness champion!`;
      } else {
        message = `Legendary status achieved with a ${milestone} day streak! Your commitment is inspiring.`;
      }
      
      return { days: milestone, message };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking streak milestone:', error);
    return null;
  }
}

/**
 * Updates user activity for streak tracking
 * @param userId User ID
 * @param date Activity date (defaults to today)
 * @param activityType Type of activity
 * @returns Promise resolving to success status
 */
export async function recordStreakActivity(
  userId: string, 
  activityType: string,
  date: Date = new Date()
): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const supabase = createClient();
    const formattedDate = date.toISOString().split('T')[0];
    
    // Record in user_activity table for streak tracking
    const { error } = await supabase
      .from('user_activity')
      .upsert({
        user_id: userId,
        date: formattedDate,
        activity_type: activityType
      }, {
        onConflict: 'user_id,date'
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error recording streak activity:', error);
    return false;
  }
} 