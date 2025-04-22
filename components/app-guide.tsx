"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dumbbell, Apple, BarChart, Smartphone, Bell, Zap } from "lucide-react"

export function AppGuide() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>FitLife App Guide</CardTitle>
        <CardDescription>
          Learn how to use every feature of the FitLife app to maximize your fitness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <h3 className="text-lg font-medium">Welcome to FitLife</h3>
            <p>
              FitLife is your all-in-one fitness companion designed to help you achieve your health and fitness goals.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Workout Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create custom workouts, follow pre-made plans, and track your progress over time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Apple className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Nutrition Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track meals, monitor macros, and create meal plans tailored to your goals.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Progress Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Visualize your progress with detailed charts and insights to stay motivated.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Device Connectivity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect with fitness trackers, smartwatches, and your mobile devices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">Reminders & Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Set custom reminders for workouts, meals, and hydration to stay on track.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">AI Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get personalized recommendations and answers to your fitness questions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="creating-workouts">
                <AccordionTrigger>Creating Workouts</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>FitLife makes it easy to create custom workouts tailored to your goals:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Navigate to the Workouts tab and click "Create Workout"</li>
                    <li>Fill in basic details like name, type, and difficulty</li>
                    <li>Add exercises, specifying sets, reps, and weights</li>
                    <li>Set rest periods between exercises</li>
                    <li>Save your workout to your library</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Use the "Copy Workout" feature to duplicate and modify existing workouts.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tracking-progress">
                <AccordionTrigger>Tracking Workout Progress</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Monitor your fitness journey with comprehensive tracking tools:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Log completed workouts with actual weights, reps, and sets</li>
                    <li>Rate your perceived exertion for each workout</li>
                    <li>Add notes about how you felt during the workout</li>
                    <li>View progress charts showing improvements over time</li>
                    <li>Track personal records (PRs) for each exercise</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Take progress photos at regular intervals to visually track changes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="workout-plans">
                <AccordionTrigger>Using Workout Plans</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Follow structured workout plans designed by fitness experts:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Browse plans by goal (strength, weight loss, muscle gain, etc.)</li>
                    <li>View the complete schedule before committing</li>
                    <li>Add plans to your calendar with one click</li>
                    <li>Receive notifications for scheduled workouts</li>
                    <li>Track your adherence to the plan</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: You can modify workout plans to fit your schedule and preferences.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="exercise-library">
                <AccordionTrigger>Exercise Library</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Access our comprehensive database of exercises:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Browse by muscle group, equipment, or difficulty</li>
                    <li>Watch video demonstrations with proper form guidance</li>
                    <li>Read detailed instructions for each exercise</li>
                    <li>See which muscles are targeted with anatomical illustrations</li>
                    <li>Add exercises to your favorites for quick access</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Use the "Similar Exercises" feature to find alternatives if you don't have certain
                    equipment.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="meal-tracking">
                <AccordionTrigger>Meal Tracking</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Keep track of your daily nutrition with ease:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Log meals with our extensive food database</li>
                    <li>Scan barcodes for packaged foods</li>
                    <li>Create and save custom recipes</li>
                    <li>Track macronutrients (protein, carbs, fats)</li>
                    <li>Monitor micronutrients and vitamins</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Use the "Quick Add" feature for frequently consumed meals.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="meal-plans">
                <AccordionTrigger>Meal Planning</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Create structured meal plans to reach your nutrition goals:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Design daily or weekly meal plans</li>
                    <li>Set calorie and macro targets</li>
                    <li>Choose from pre-made meal plan templates</li>
                    <li>Generate shopping lists from your meal plans</li>
                    <li>Schedule meal prep reminders</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Plan your meals a week in advance to save time and stay consistent.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="nutrition-goals">
                <AccordionTrigger>Nutrition Goals</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Set and track personalized nutrition targets:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Calculate your daily calorie needs based on your goals</li>
                    <li>Set custom macronutrient ratios</li>
                    <li>Track water intake</li>
                    <li>Monitor fiber, sugar, and sodium consumption</li>
                    <li>Set goals for specific vitamins and minerals</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Adjust your nutrition goals on rest days vs. workout days for optimal results.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="recipes-database">
                <AccordionTrigger>Recipes Database</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Discover healthy and delicious recipes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Browse thousands of recipes filtered by dietary preferences</li>
                    <li>Search by ingredients you have on hand</li>
                    <li>View detailed nutritional information</li>
                    <li>Save favorites and create collections</li>
                    <li>Share recipes with friends</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Use the "Meal Prep" filter to find recipes that store well for multiple days.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="progress-tracking">
                <AccordionTrigger>Progress Tracking</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Monitor your fitness journey with comprehensive metrics:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Track weight, body measurements, and body fat percentage</li>
                    <li>Record progress photos</li>
                    <li>Monitor strength gains and personal records</li>
                    <li>Track cardiovascular fitness improvements</li>
                    <li>View detailed progress charts and trends</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Take measurements and photos at the same time of day for consistency.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="device-connectivity">
                <AccordionTrigger>Device Connectivity</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Connect with your fitness devices for seamless data integration:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Sync with popular fitness trackers and smartwatches</li>
                    <li>Connect with heart rate monitors</li>
                    <li>Import data from smart scales</li>
                    <li>Integrate with Apple Health or Google Fit</li>
                    <li>Connect with Bluetooth-enabled gym equipment</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Enable background syncing to ensure your data is always up to date.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="activity-tracking">
                <AccordionTrigger>Activity Tracking</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Monitor your daily movement and activity levels:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Track steps, distance, and active minutes</li>
                    <li>Monitor heart rate zones during activities</li>
                    <li>Track sleep quality and duration</li>
                    <li>Record cardio sessions (running, cycling, swimming)</li>
                    <li>Set and monitor daily activity goals</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Use the heart rate zone feature to ensure you're training at the right intensity.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="analytics-insights">
                <AccordionTrigger>Analytics & Insights</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Gain valuable insights from your fitness data:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>View detailed performance analytics</li>
                    <li>Identify trends and patterns in your fitness journey</li>
                    <li>Receive personalized recommendations</li>
                    <li>Compare current performance to past periods</li>
                    <li>Get AI-powered insights on your progress</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Review your weekly and monthly reports to identify areas for improvement.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="account-settings">
                <AccordionTrigger>Account Settings</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Manage your FitLife account:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Update personal information and profile picture</li>
                    <li>Manage subscription and billing details</li>
                    <li>Set privacy preferences</li>
                    <li>Control data sharing options</li>
                    <li>Export or delete your data</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Regularly update your fitness goals in your profile as they evolve.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="app-preferences">
                <AccordionTrigger>App Preferences</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Customize your FitLife experience:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Choose between light, dark, or system theme</li>
                    <li>Set your preferred units (metric/imperial)</li>
                    <li>Customize dashboard layout and widgets</li>
                    <li>Set default views for workouts and nutrition</li>
                    <li>Configure language preferences</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Use dark mode to reduce eye strain when using the app at night.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notifications">
                <AccordionTrigger>Notifications & Reminders</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Stay on track with customizable alerts:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Set workout reminders with custom sounds</li>
                    <li>Configure meal and hydration alerts</li>
                    <li>Set weigh-in and measurement reminders</li>
                    <li>Receive progress milestone notifications</li>
                    <li>Customize notification timing and frequency</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Schedule reminders 15 minutes before your planned workout time to prepare.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="device-connections">
                <AccordionTrigger>Device Connections</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Manage your connected devices:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Connect and manage fitness trackers and smartwatches</li>
                    <li>Pair with Bluetooth heart rate monitors and scales</li>
                    <li>Configure sync settings with Apple Health or Google Fit</li>
                    <li>Manage multiple devices across platforms</li>
                    <li>Troubleshoot connection issues</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Keep your devices' firmware updated for the best connection experience.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support-help">
                <AccordionTrigger>Support & Help</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Get assistance when you need it:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Access the knowledge base and FAQs</li>
                    <li>Contact customer support via chat, email, or phone</li>
                    <li>Submit feature requests and bug reports</li>
                    <li>Join the community forum</li>
                    <li>Schedule one-on-one support sessions</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pro Tip: Check the community forum for creative ways other users are utilizing the app.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

