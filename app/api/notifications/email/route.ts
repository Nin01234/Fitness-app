import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

interface EmailNotificationRequest {
  userId: string;
  eventType: 'workoutComplete' | 'goalAchieved' | 'activityUpdate' | 'deviceConnected' | 'systemNotification' | 'nutritionUpdate';
  eventData: Record<string, any>;
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // In production, use actual email service credentials
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'fitlife@example.com',
      pass: process.env.EMAIL_PASSWORD || 'password123',
    },
  });
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient();
    const { userId, eventType, eventData } = await request.json() as EmailNotificationRequest;

    if (!userId || !eventType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get user email and preferences from the database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Check if email notifications are enabled for this user
    if (!profile.email_notifications_enabled) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email notifications are disabled for this user' 
      });
    }

    // Get user email from auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user?.email) {
      console.error('Error fetching user email:', userError);
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const email = userData.user.email;

    // Create email content based on event type
    const { subject, body } = createEmailContent(eventType, eventData, profile);

    // Log email in database
    const { error: insertError } = await supabase
      .from('email_notifications')
      .insert([
        {
          user_id: userId,
          event_type: eventType,
          email,
          subject,
          body,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('Error logging email notification:', insertError);
    }

    // Actually send the email using Nodemailer
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'FitLife <notifications@fitlife-app.com>',
        to: email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(to right, #3b82f6, #6366f1);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e1e1e1;
                border-top: none;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
              .button {
                display: inline-block;
                background: linear-gradient(to right, #3b82f6, #6366f1);
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 4px;
                margin-top: 15px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>FitLife</h1>
              </div>
              <div class="content">
                ${body}
                <center>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://fitlife.example.com'}/dashboard" class="button">
                    View in App
                  </a>
                </center>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} FitLife Fitness. All rights reserved.</p>
                <p>You're receiving this email because you signed up for FitLife notifications.</p>
                <p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://fitlife.example.com'}/settings/notifications">
                    Manage notification settings
                  </a>
                  &nbsp;|&nbsp;
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://fitlife.example.com'}/unsubscribe?email=${email}">
                    Unsubscribe
                  </a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: body.replace(/<[^>]*>?/gm, ''), // Plain text version
      };
      
      // Send the email
      await transporter.sendMail(mailOptions);
      
      // Record that the notification was sent
      await supabase
        .from('email_notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('event_type', eventType);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email notification sent successfully' 
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Update status to failed
      await supabase
        .from('email_notifications')
        .update({ 
          status: 'failed', 
          error_message: String(emailError),
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('event_type', eventType);
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send email' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send email notification' 
    }, { status: 500 });
  }
}

function createEmailContent(
  eventType: EmailNotificationRequest['eventType'],
  eventData: Record<string, any>,
  profile: any
) {
  const appName = 'FitLife Fitness';
  const userName = profile.full_name || profile.username || 'Fitness Enthusiast';

  switch (eventType) {
    case 'workoutComplete':
      return {
        subject: `${appName} - Workout Complete! 💪`,
        body: `
          <h2>Great job, ${userName}!</h2>
          <p>You've completed your ${eventData.workoutName} workout.</p>
          <ul>
            <li>Duration: ${eventData.duration} minutes</li>
            <li>Calories burned: ${eventData.caloriesBurned}</li>
            <li>Progress toward weekly goal: ${eventData.weeklyProgress}%</li>
          </ul>
          <p>Keep up the good work! Your consistency is paying off.</p>
        `
      };

    case 'nutritionUpdate':
      return {
        subject: `${appName} - Nutrition Insights 🥗`,
        body: `
          <h2>Hello, ${userName}!</h2>
          <p>Here's your personalized nutrition update:</p>
          <ul>
            <li>Daily calorie target: ${eventData.calorieTarget || 2000} calories</li>
            <li>Protein recommendation: ${eventData.proteinTarget || 120}g</li>
            <li>Hydration goal: ${eventData.waterTarget || 2.5} liters</li>
          </ul>
          <p>Our AI has analyzed your recent activities and suggests focusing on:</p>
          <p><strong>${eventData.focusArea || 'Balanced macronutrient intake'}</strong></p>
          <p>Check the app for your full personalized nutrition plan!</p>
        `
      };

    case 'goalAchieved':
      return {
        subject: `${appName} - Goal Achieved! 🎯`,
        body: `
          <h2>Congratulations, ${userName}!</h2>
          <p>You've reached your ${eventData.goalName} goal.</p>
          <p>This is a significant milestone in your fitness journey. Well done!</p>
          <p>Why not set a new goal to keep your momentum going?</p>
        `
      };

    case 'activityUpdate':
      return {
        subject: `${appName} - Activity Summary 📊`,
        body: `
          <h2>Hello, ${userName}!</h2>
          <p>Here's your activity summary for today:</p>
          <ul>
            <li>Steps: ${eventData.steps}</li>
            <li>Distance: ${eventData.distance} miles</li>
            <li>Active minutes: ${eventData.activeMinutes}</li>
            <li>Calories burned: ${eventData.caloriesBurned}</li>
          </ul>
          <p>Keep moving to reach your daily goals!</p>
        `
      };

    case 'deviceConnected':
      return {
        subject: `${appName} - New Device Connected 📱`,
        body: `
          <h2>Hello, ${userName}!</h2>
          <p>Your ${eventData.deviceName} has been successfully connected to your FitLife account.</p>
          <p>You can now track your activities and synchronize your fitness data automatically.</p>
        `
      };

    case 'systemNotification':
    default:
      return {
        subject: `${appName} - ${eventData.title || 'Notification'}`,
        body: `
          <h2>Hello, ${userName}!</h2>
          <p>${eventData.message || 'You have a new notification from FitLife.'}</p>
        `
      };
  }
} 