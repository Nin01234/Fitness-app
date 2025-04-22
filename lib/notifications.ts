import { createClient } from '@/lib/supabase/client';

interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  timestamp?: Date;
  action?: {
    text: string;
    url: string;
  };
}

/**
 * Creates and stores a notification in the database
 * @param notification Notification object
 */
export async function addNotification(notification: Notification): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('Cannot add notification: User not authenticated');
    return false;
  }
  
  try {
    // Store notification in database
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: false,
        created_at: new Date().toISOString(),
        action_text: notification.action?.text,
        action_url: notification.action?.url
      });
    
    if (error) {
      console.error('Error saving notification:', error);
      return false;
    }
    
    // Use browser notifications if available and permissions granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png' // Make sure this exists
      });
      
      // Handle notification click if there's an action
      if (notification.action) {
        browserNotification.onclick = function() {
          window.focus();
          window.location.href = notification.action!.url;
        };
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in addNotification:', error);
    return false;
  }
}

/**
 * Generates a random fitness-related notification for testing purposes
 */
export function generateRandomNotification(): Notification {
  const types: ('info' | 'success' | 'warning' | 'error')[] = ['info', 'success', 'warning', 'error'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  const notificationTemplates = [
    {
      type: 'info',
      titles: ['Daily Tip', 'Fitness Advice', 'Nutrition Reminder'],
      messages: [
        'Remember to stay hydrated throughout your workout.',
        'Try adding a protein-rich snack before your next workout.',
        'Have you tracked your nutrition today?'
      ]
    },
    {
      type: 'success',
      titles: ['Goal Reached!', 'New Achievement!', 'Streak Milestone!'],
      messages: [
        'You completed your daily step goal! Great job!',
        'Congratulations on your new personal best!',
        'You\'ve maintained your workout streak for 7 days!'
      ]
    },
    {
      type: 'warning',
      titles: ['Training Reminder', 'Schedule Alert', 'Fitness Check-in'],
      messages: [
        'It\'s been 3 days since your last workout.',
        'Your scheduled training session is in 30 minutes.',
        'Don\'t forget to log your measurements this week.'
      ]
    },
    {
      type: 'error',
      titles: ['Missed Workout', 'Streak Broken', 'Goal Deadline'],
      messages: [
        'You missed your scheduled workout yesterday.',
        'Your 5-day streak was broken. Let\'s start again!',
        'Your monthly goal deadline is approaching.'
      ]
    }
  ];
  
  const template = notificationTemplates.find(t => t.type === randomType) || notificationTemplates[0];
  const titleIndex = Math.floor(Math.random() * template.titles.length);
  const messageIndex = Math.floor(Math.random() * template.messages.length);
  
  return {
    title: template.titles[titleIndex],
    message: template.messages[messageIndex],
    type: randomType,
    action: Math.random() > 0.5 ? {
      text: 'View Details',
      url: '/dashboard'
    } : undefined
  };
}

/**
 * Gets a list of notifications for the current user
 * @param limit Number of notifications to fetch (default: 10)
 * @param includeRead Whether to include read notifications (default: true)
 */
export async function getUserNotifications(limit = 10, includeRead = true): Promise<Notification[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('Cannot get notifications: User not authenticated');
    return [];
  }
  
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (!includeRead) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    // Transform database records to Notification objects
    return data.map(record => ({
      id: record.id,
      title: record.title,
      message: record.message,
      type: record.type,
      read: record.read,
      timestamp: new Date(record.created_at),
      action: record.action_text ? {
        text: record.action_text,
        url: record.action_url
      } : undefined
    }));
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    return [];
  }
}

/**
 * Marks a notification as read
 * @param notificationId ID of the notification to mark as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
}

/**
 * Marks all notifications for the current user as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('Cannot mark notifications as read: User not authenticated');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
} 