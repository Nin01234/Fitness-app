import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { SearchBar } from "@/components/search-bar"
import { EnhancedChatBot } from "@/components/chat/enhanced-chat-bot"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { SkipLink } from "@/components/skip-link"
import { ClientEmailBannerWrapper } from "@/components/notifications/client-email-banner-wrapper"
import { LayoutDashboard, Dumbbell, Utensils, LineChart, Award, HelpCircle, User, Bell, Settings } from "lucide-react"
import { cookies } from "next/headers"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  // Try-catch to handle any Supabase client errors more gracefully
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect("/login")
    }

    // Default profile in case we can't fetch or create one
    let profile = {
      id: user.id,
      username: user.email?.split('@')[0] || `user_${Date.now()}`,
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      points: 0,
      // Add default starting values for all tracking metrics
      steps: 0,
      calories_burned: 0, 
      distance: 0,
      active_minutes: 0,
      workouts_completed: 0,
      weight: user.user_metadata?.weight || 0,
      height: user.user_metadata?.height || 0,
      activity_level: 'beginner',
      email_preferences_set: false,
      email_notifications_enabled: false,
      created_at: new Date().toISOString()
    }

    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError)
      }

      // If profile exists, use it
      if (existingProfile) {
        profile = existingProfile
      } else {
        // Otherwise try to create a new profile with default 0 values
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .upsert([
            {
              id: user.id,
              username: profile.username,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              updated_at: new Date().toISOString(),
              points: 0,
              steps: 0,
              calories_burned: 0,
              distance: 0,
              active_minutes: 0,
              workouts_completed: 0,
              weight: user.user_metadata?.weight || 0,
              height: user.user_metadata?.height || 0,
              activity_level: 'beginner',
              email_preferences_set: false,
              email_notifications_enabled: false,
              created_at: new Date().toISOString()
            },
          ])
          .select()
          .single()

        if (insertError) {
          console.error("Error creating profile:", insertError)
        } else if (newProfile) {
          profile = newProfile
        }
      }
    } catch (error) {
      console.error("Profile handling error:", error)
    }

    return (
      <NotificationProvider>
        <div className="flex min-h-screen flex-col relative overflow-hidden">
          {/* Use the SkipLink component for improved accessibility */}
          <SkipLink targetId="main-content" />
          
          {/* Dynamic background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-1000">
            <div className="absolute top-0 right-0 -mt-40 -mr-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-40 -ml-40 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-1/2 left-1/3 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
            
            {/* Additional decorative elements */}
            <div className="absolute top-1/4 right-1/4 h-40 w-40 rounded-full bg-primary/10 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute bottom-1/4 right-1/3 h-60 w-60 rounded-full bg-secondary/10 blur-2xl animate-pulse" style={{ animationDelay: "1.2s" }}></div>
            <div className="absolute top-2/3 left-1/5 h-32 w-32 rounded-full bg-accent/10 blur-2xl animate-pulse" style={{ animationDelay: "0.8s" }}></div>
            
            {/* Dynamic grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.background/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.background/10)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          </div>
          
          {/* Email notification settings banner */}
          <ClientEmailBannerWrapper
            userId={user.id}
            showBanner={!profile.email_preferences_set}
          />
          
          <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-primary/10 transition-all duration-500">
            <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
              <MainNav />
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex">
                  <SearchBar placeholder="Search workouts, nutrition..." />
                </div>
                <UserNav user={user} profile={profile} />
                <MobileNav 
                  links={[
                    { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
                    { title: "Workouts", href: "/workouts", icon: <Dumbbell className="h-5 w-5" /> },
                    { title: "Nutrition", href: "/nutrition", icon: <Utensils className="h-5 w-5" /> },
                    { title: "Progress", href: "/progress", icon: <LineChart className="h-5 w-5" /> },
                    { title: "Achievements", href: "/achievements", icon: <Award className="h-5 w-5" /> },
                    { title: "Support", href: "/support", icon: <HelpCircle className="h-5 w-5" /> },
                    { title: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
                    { title: "Notifications", href: "/notifications", icon: <Bell className="h-5 w-5" /> },
                    { title: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> }
                  ]} 
                />
              </div>
            </div>
          </header>
          <div className="container flex-1 items-start px-4 md:px-6 md:gap-6 lg:gap-10 relative z-10">
            <main id="main-content" className="grid flex-1 gap-6 py-6 md:py-8">{children}</main>
          </div>
          <EnhancedChatBot />
        </div>
      </NotificationProvider>
    )
  } catch (error) {
    console.error("Authentication error:", error)
    redirect("/login")
  }
}

