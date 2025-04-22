import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProfileForm } from "@/components/profile/profile-form"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { EmailSetup } from "@/components/profile/email-setup"
import { SocialMediaLinks } from "@/components/profile/social-media-links"
import { AppCreators } from "@/components/app-creators"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DynamicTextSlider } from "@/components/ui/dynamic-text-slider"
import { 
  User, 
  Activity, 
  Settings, 
  Shield, 
  Bell, 
  History, 
  Edit, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Dumbbell, 
  Calendar, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getUserStats } from "@/lib/activity-tracking"
import { getUserStreak } from "@/lib/streaks"

export const metadata: Metadata = {
  title: "Profile - FitLife",
  description: "Manage your profile and account settings",
}

export default async function ProfilePage() {
  try {
    const supabase = createClient()
    
    // Add proper error handling for authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect("/login")
    }

    // Fetch profile data with error handling
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError)
    }

    // Fetch user stats for dynamic data
    let userStats = {
      workouts: 0,
      calories: 0,
      streak: 0,
      achievements: 0,
      goalProgress: { weight: 0, workout: 0, nutrition: 0 }
    };
    
    try {
      userStats = await getUserStats(user.id);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
    
    // Get streak separately to avoid circular dependencies
    try {
      const streakCount = await getUserStreak(user.id);
      // Update the streak in userStats
      userStats.streak = streakCount;
    } catch (error) {
      console.error("Error fetching user streak:", error);
      // Keep the default streak value of 0
    }

    // Motivational fitness quotes for the dynamic slider
    const motivationalQuotes = [
      "Transform your body, transform your life",
      "Every workout brings you closer to your goals",
      "Your only competition is the person you were yesterday",
      "Fitness is not a destination, it's a journey",
      "Push yourself, because no one else is going to do it for you",
      "Your body can stand almost anything. It's your mind you have to convince",
      "Sweat now, shine later",
      "Stronger than yesterday, weaker than tomorrow"
    ]

    return (
      <DashboardShell className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/30">
        {/* Profile Hero Section */}
        <div className="relative mb-8 rounded-xl overflow-hidden group">
          {/* Dynamic Text Slider (replacing Cover Photo) */}
          <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-700">
            <div className="absolute inset-0 z-0 opacity-30">
              <div className="absolute inset-0 bg-pattern"></div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            <div className="relative h-full flex items-center justify-center z-10">
              <DynamicTextSlider 
                messages={motivationalQuotes}
                direction="vertical"
                interval={4000}
                className="h-full"
                textClassName="text-white drop-shadow-md"
              />
            </div>
            
            {/* Edit Cover Button */}
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute top-4 right-4 z-20 bg-black/30 text-white hover:bg-black/50 transition-all"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Cover
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="relative z-10 p-6 md:p-8 bg-white dark:bg-gray-950 rounded-b-xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="relative -mt-16 md:-mt-24">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-md">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white text-xl md:text-3xl font-bold">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-800 border shadow-sm h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              {/* User Info */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{profile?.full_name || 'Fitness Enthusiast'}</h1>
                    <p className="text-muted-foreground">@{profile?.username || user?.email?.split('@')[0]}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm md:text-base">
                  {profile?.bio || "Fitness enthusiast on a journey to a healthier life. Passionate about strength training and nutrition."}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {profile?.location && (
                    <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {user?.email}
                  </Badge>
                  {profile?.website && (
                    <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        {profile.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Badge>
                  )}
                </div>
                
                {/* Social Links */}
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-100 dark:border-blue-900 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  <Dumbbell className="h-5 w-5" /> Workouts
                </CardTitle>
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-9 h-9 flex items-center justify-center font-bold">
                  78
                </div>
              </div>
              <CardDescription>Total workouts completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={78} className="h-2 bg-blue-100 dark:bg-blue-900/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                  <Award className="h-5 w-5" /> Achievements
                </CardTitle>
                <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full w-9 h-9 flex items-center justify-center font-bold">
                  12
                </div>
              </div>
              <CardDescription>Fitness achievements earned</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={65} className="h-2 bg-green-100 dark:bg-green-900/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-100 dark:border-purple-900 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  <Calendar className="h-5 w-5" /> Streak
                </CardTitle>
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full w-9 h-9 flex items-center justify-center font-bold">
                  18
                </div>
              </div>
              <CardDescription>Current workout streak (days)</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={60} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-100 dark:border-amber-900 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  <Activity className="h-5 w-5" /> Progress
                </CardTitle>
                <div className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full w-9 h-9 flex items-center justify-center font-bold">
                  85%
                </div>
              </div>
              <CardDescription>Overall fitness goal progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={85} className="h-2 bg-amber-100 dark:bg-amber-900/50" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-5">
            <Card className="border-indigo-100 dark:border-indigo-900 shadow-md overflow-hidden">
              <Tabs defaultValue="profile" className="w-full">
                <CardHeader className="pb-0 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                  <TabsList className="grid w-full grid-cols-5 p-1 bg-white/90 dark:bg-gray-800/90 rounded-xl">
                    <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Profile
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" /> Activity
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Settings
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Privacy
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" /> Alerts
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-0">
                  <TabsContent value="profile" className="p-6 m-0">
                    <ProfileForm profile={profile} />
                  </TabsContent>

                  <TabsContent value="activity" className="p-6 m-0">
                    <ProfileActivity userId={user?.id} />
                  </TabsContent>

                  <TabsContent value="settings" className="m-0">
                    <div className="p-6 space-y-6">
                      <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Account Email</h3>
                        <p className="text-sm mb-3">
                          Your email address is <span className="font-medium">{user?.email}</span>
                        </p>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/profile/change-email">Change email</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/profile/verify-email">Verify email</Link>
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Password</CardTitle>
                            <CardDescription>Last updated 3 months ago</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <p className="text-sm text-muted-foreground">For security reasons, we recommend changing your password periodically.</p>
                          </CardContent>
                          <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 pt-3">
                            <Button variant="outline" size="sm" asChild className="w-full">
                              <Link href="/profile/change-password">Change password</Link>
                            </Button>
                          </CardFooter>
                        </Card>

                        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                            <CardDescription>Add an extra layer of security</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <p className="text-sm text-muted-foreground">Protect your account with an additional verification step.</p>
                          </CardContent>
                          <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 pt-3">
                            <Button variant="outline" size="sm" asChild className="w-full">
                              <Link href="/profile/two-factor">Enable 2FA</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border">
                        <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-lg border bg-white dark:bg-gray-800 p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-[#4285F4] p-2 text-white">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium">Google</h4>
                                <p className="text-xs text-muted-foreground">Not connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild className="text-sm">
                              <Link href="/profile/connect/google">Connect</Link>
                            </Button>
                          </div>

                          <div className="flex items-center justify-between rounded-lg border bg-white dark:bg-gray-800 p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-[#1877F2] p-2 text-white">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium">Facebook</h4>
                                <p className="text-xs text-muted-foreground">Not connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild className="text-sm">
                              <Link href="/profile/connect/facebook">Connect</Link>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Card className="border-red-200 dark:border-red-900">
                        <CardHeader>
                          <CardTitle className="text-red-600 dark:text-red-400">Delete Account</CardTitle>
                          <CardDescription>This action is permanent and cannot be undone</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all of your data. All your workout history, progress tracking, and personal data will be erased.
                          </p>
                          <Button variant="destructive" size="sm" asChild>
                            <Link href="/profile/delete-account">Delete account</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="privacy" className="p-6 m-0">
                    <form action="/api/profile/privacy" method="POST" className="space-y-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle>Privacy Settings</CardTitle>
                          <CardDescription>Control who can see your information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-3">
                          <div className="space-y-4">
                            <div className="grid gap-1">
                              <h3 className="font-medium text-sm mb-1">Profile Visibility</h3>
                              <select name="profile_visibility" className="rounded-md border p-2 text-sm w-full">
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Private</option>
                              </select>
                              <p className="text-xs text-muted-foreground mt-1">Control who can see your profile information</p>
                            </div>

                            <div className="grid gap-1">
                              <h3 className="font-medium text-sm mb-1">Activity Sharing</h3>
                              <select name="activity_sharing" className="rounded-md border p-2 text-sm w-full">
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Private</option>
                              </select>
                              <p className="text-xs text-muted-foreground mt-1">Control who can see your workout activity</p>
                            </div>

                            <div className="grid gap-1">
                              <h3 className="font-medium text-sm mb-1">Progress Visibility</h3>
                              <select name="progress_visibility" className="rounded-md border p-2 text-sm w-full">
                                <option>Public</option>
                                <option>Friends Only</option>
                                <option>Private</option>
                              </select>
                              <p className="text-xs text-muted-foreground mt-1">Control who can see your fitness progress</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="font-medium text-sm">Data Usage</h3>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="analytics" name="analytics" className="rounded border-gray-300" />
                                <label htmlFor="analytics" className="text-sm">
                                  Allow anonymous usage analytics
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="personalization"
                                  name="personalization"
                                  className="rounded border-gray-300"
                                />
                                <label htmlFor="personalization" className="text-sm">
                                  Allow personalized recommendations
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="marketing" name="marketing" className="rounded border-gray-300" />
                                <label htmlFor="marketing" className="text-sm">
                                  Receive marketing communications
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-gray-50 dark:bg-gray-900">
                          <div className="flex items-center justify-between w-full">
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/profile/export-data" className="text-sm">
                                Export data
                              </Link>
                            </Button>
                            <Button type="submit" size="sm">
                              Save Privacy Settings
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </form>
                  </TabsContent>

                  <TabsContent value="notifications" className="p-6 m-0">
                    <Link href="/notifications" className="block w-full">
                      <Card className="hover:shadow-md transition-all duration-300 text-center p-8">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                        <h3 className="text-lg font-medium mb-2">Go to Notification Center</h3>
                        <p className="text-sm text-muted-foreground mb-4">Visit the notification center to manage all your notification preferences</p>
                        <Button>Open Notification Center</Button>
                      </Card>
                    </Link>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                <CardTitle>Profile Stats</CardTitle>
                <CardDescription>Your fitness journey stats</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ProfileStats profile={profile} />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Upgrade to Premium</h3>
                  <p className="text-white/80 mb-4">Get access to advanced features, AI-powered coaching, and exclusive content</p>
                  <Button className="bg-white text-indigo-600 hover:bg-white/90 font-medium shadow-md" asChild>
                    <Link href="/premium">View Premium Plans <ChevronRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                <CardTitle>Email Preferences</CardTitle>
                <CardDescription>Manage your email settings</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <EmailSetup />
              </CardContent>
            </Card>

            <Card className="border-indigo-100 dark:border-indigo-900 shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Connect your social accounts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <SocialMediaLinks />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error in ProfilePage:", error)
    return (
      <div>Error loading profile page</div>
    )
  }
}

