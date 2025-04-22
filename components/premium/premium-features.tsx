import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Dumbbell,
  Utensils,
  Zap,
  MessageSquare,
  Clock,
  Calendar,
  Users,
  Award,
  Smartphone,
  GraduationCap,
  Heart,
  Video,
  Cloud,
  Share2,
  FileText,
  UserPlus
} from "lucide-react"

export function PremiumFeatures() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <BarChart className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>Detailed insights into your fitness progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Analytics+Dashboard"
                alt="Analytics dashboard"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Comprehensive performance metrics</li>
              <li>• Trend analysis and projections</li>
              <li>• Personalized improvement suggestions</li>
              <li>• Export data in multiple formats</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Dumbbell className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Custom Workout Plans</CardTitle>
            <CardDescription>Personalized training programs for your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Workout+Plans"
                alt="Custom workout plans"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• AI-generated workout routines</li>
              <li>• Tailored to your fitness level</li>
              <li>• Progressive overload tracking</li>
              <li>• Adapt based on your progress</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Utensils className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Nutrition Meal Planning</CardTitle>
            <CardDescription>Optimized meal plans for your fitness goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Meal+Planning"
                alt="Nutrition meal planning"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Personalized macro calculations</li>
              <li>• Weekly meal planning</li>
              <li>• Grocery list generation</li>
              <li>• Recipe recommendations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Zap className="h-6 w-6 text-primary mb-2" />
            <CardTitle>AI Workout Recommendations</CardTitle>
            <CardDescription>Smart suggestions to optimize your training</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=AI+Recommendations"
                alt="AI workout recommendations"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Exercise variations based on progress</li>
              <li>• Plateau-breaking suggestions</li>
              <li>• Recovery optimization</li>
              <li>• Form correction tips</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <MessageSquare className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Priority Support</CardTitle>
            <CardDescription>Get help faster when you need it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Priority+Support"
                alt="Priority support"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• 24/7 chat support</li>
              <li>• Priority email responses</li>
              <li>• Monthly check-in calls</li>
              <li>• Dedicated support team</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Smartphone className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Ad-Free Experience</CardTitle>
            <CardDescription>Enjoy FitLife without interruptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Ad-Free+Experience"
                alt="Ad-free experience"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• No advertisements</li>
              <li>• Cleaner interface</li>
              <li>• Faster app performance</li>
              <li>• Distraction-free workouts</li>
            </ul>
          </CardContent>
        </Card>
        
        {/* New Premium Features */}
        <Card>
          <CardHeader className="pb-2">
            <GraduationCap className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Advanced Training Courses</CardTitle>
            <CardDescription>In-depth fitness education and guided programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Training+Courses"
                alt="Advanced training courses"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Expert-led video courses</li>
              <li>• Progressive training programs</li>
              <li>• Specialized technique workshops</li>
              <li>• Certification preparation</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <Heart className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Advanced Health Metrics</CardTitle>
            <CardDescription>Comprehensive monitoring of your vital health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Health+Metrics"
                alt="Health metrics dashboard"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Heart rate variability analysis</li>
              <li>• Sleep quality scoring</li>
              <li>• Recovery optimization</li>
              <li>• Stress level monitoring</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <Video className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Video Form Analysis</CardTitle>
            <CardDescription>AI-powered analysis of your exercise technique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Form+Analysis"
                alt="Video form analysis"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Upload workout videos for analysis</li>
              <li>• AI posture and form feedback</li>
              <li>• Motion path tracking</li>
              <li>• Personalized correction tips</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <Cloud className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Unlimited Cloud Storage</CardTitle>
            <CardDescription>Store all your fitness data securely in the cloud</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Cloud+Storage"
                alt="Cloud storage"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Unlimited progress photos</li>
              <li>• Video uploads for form analysis</li>
              <li>• Full workout history archive</li>
              <li>• Cross-device synchronization</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <Share2 className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Community Challenges</CardTitle>
            <CardDescription>Exclusive premium challenges with special rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=Community+Challenges"
                alt="Community challenges"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Premium-only fitness challenges</li>
              <li>• Exclusive digital rewards</li>
              <li>• Global leaderboards</li>
              <li>• Partner brand prizes</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <FileText className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Detailed PDF Reports</CardTitle>
            <CardDescription>Professional fitness reports for progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=200&width=400&text=PDF+Reports"
                alt="PDF reports"
                fill
                className="object-cover"
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Weekly and monthly summaries</li>
              <li>• Customizable report parameters</li>
              <li>• Beautiful data visualizations</li>
              <li>• Sharable with trainers/doctors</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/20 to-primary/5">
          <CardHeader className="pb-2">
            <UserPlus className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Premium Access Guarantee</CardTitle>
            <CardDescription>Unlock all premium features with one subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-medium mb-4">As a Premium member, you're guaranteed access to:</p>
              <div className="grid gap-4 md:grid-cols-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>All current premium features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>All future premium updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Priority access to new tools</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Exclusive workout collections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Premium-only challenges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Advanced health metrics</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Unlimited storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Export capabilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">✓</span>
                    <span>Premium support team access</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Save Time</h3>
            <p className="text-sm text-muted-foreground mt-1">Streamlined workflows and automated planning</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Stay Consistent</h3>
            <p className="text-sm text-muted-foreground mt-1">Better tracking and accountability features</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Expert Guidance</h3>
            <p className="text-sm text-muted-foreground mt-1">Access to professional fitness knowledge</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Award className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Achieve More</h3>
            <p className="text-sm text-muted-foreground mt-1">Reach your fitness goals faster and easier</p>
          </div>
        </div>
      </div>
    </div>
  )
}

