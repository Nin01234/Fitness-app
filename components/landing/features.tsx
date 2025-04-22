import { Activity, Award, BarChart, Bell, Calendar, Dumbbell, LineChart, Target, Utensils } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Suspense } from "react"

// Define icon types
type IconName = "dumbbell" | "utensils" | "lineChart" | "target" | "bell" | "award" | "calendar" | "barChart" | "activity";

// Define feature interface
interface Feature {
  icon: IconName;
  title: string;
  description: string;
  order?: number;
}

// Mapping of icon names to icon components
const iconMap = {
  dumbbell: Dumbbell,
  utensils: Utensils,
  lineChart: LineChart,
  target: Target,
  bell: Bell,
  award: Award,
  calendar: Calendar,
  barChart: BarChart,
  activity: Activity
}

// Icon background colors
const iconBgColors: Record<IconName, string> = {
  dumbbell: "bg-primary/10",
  utensils: "bg-secondary/10",
  lineChart: "bg-accent/10",
  target: "bg-purple-500/10",
  bell: "bg-pink-500/10",
  award: "bg-amber-500/10",
  calendar: "bg-cyan-500/10",
  barChart: "bg-emerald-500/10",
  activity: "bg-indigo-500/10"
}

// Icon colors
const iconColors: Record<IconName, string> = {
  dumbbell: "text-primary",
  utensils: "text-secondary",
  lineChart: "text-accent",
  target: "text-purple-500",
  bell: "text-pink-500",
  award: "text-amber-500",
  calendar: "text-cyan-500",
  barChart: "text-emerald-500",
  activity: "text-indigo-500"
}

// Loading skeleton for features
function FeaturesSkeleton() {
  return (
    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="rounded-2xl border bg-card p-8 shadow-sm backdrop-blur-sm">
          <div className="mb-4 rounded-xl bg-primary/10 p-3 w-fit">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
          </div>
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="h-12 w-full animate-pulse rounded bg-muted"></div>
        </div>
      ))}
    </div>
  )
}

// Component to fetch and display features
function FeaturesContent() {
  // Define fallback features
  const fallbackFeatures: Feature[] = [
    {
      icon: "dumbbell",
      title: "Workout Tracking",
      description: "Log and track your workouts with detailed exercise information, sets, reps, and weights.",
    },
    {
      icon: "utensils",
      title: "Nutrition Monitoring",
      description: "Track your daily food intake, calories, and macronutrients to maintain a balanced diet.",
    },
    {
      icon: "lineChart",
      title: "Progress Visualization",
      description: "View your fitness journey with interactive charts and graphs showing your improvements over time.",
    },
    {
      icon: "target",
      title: "Goal Setting",
      description: "Set personalized fitness and nutrition goals with progress tracking to keep you motivated.",
    },
    {
      icon: "bell",
      title: "Reminders & Notifications",
      description: "Never miss a workout or meal with customizable reminders and notifications.",
    },
    {
      icon: "award",
      title: "Achievements & Rewards",
      description: "Earn badges and rewards as you reach milestones and complete challenges.",
    },
    {
      icon: "calendar",
      title: "Workout Planning",
      description: "Plan your workout routines in advance with our easy-to-use calendar interface.",
    },
    {
      icon: "barChart",
      title: "Body Metrics",
      description: "Track weight, body fat percentage, muscle mass, and other important body metrics.",
    },
    {
      icon: "activity",
      title: "Activity Tracking",
      description: "Monitor your daily activities and calculate calories burned throughout the day.",
    },
  ]
  
  // Use fallback features for now (client-side data fetching will be implemented properly later)
  const displayFeatures = fallbackFeatures

  return (
    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {displayFeatures.map((feature, index) => {
        // Get the icon component from the map, or default to Dumbbell
        const IconComponent = iconMap[feature.icon as IconName] || Dumbbell
        const bgColorClass = iconBgColors[feature.icon as IconName] || "bg-primary/10"
        const iconColorClass = iconColors[feature.icon as IconName] || "text-primary"
        
        return (
          <div 
            key={index} 
            className="group rounded-2xl border bg-card/50 p-8 shadow-sm transition-all hover-scale card-hover backdrop-blur-sm relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Dynamic background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Animated spotlight effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -inset-px rounded-2xl [background:radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),theme(colors.primary/10),transparent_55%)] group-hover:opacity-100 opacity-0 transition-opacity duration-500" style={{['--x' as any]: '50%', ['--y' as any]: '50%'}}></div>
            </div>
            
            {/* Animated Icon Container with glow effect */}
            <div className={`mb-4 rounded-xl ${bgColorClass} p-3 w-fit relative transition-all duration-500 group-hover:shadow-glow group-hover:scale-105 z-10`}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-0 blur-xl group-hover:opacity-60 transition-opacity duration-700"></div>
              <IconComponent className={`h-10 w-10 ${iconColorClass} relative z-10 transition-transform duration-500 group-hover:rotate-12`} />
            </div>
            
            {/* Content with subtle animations */}
            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-bold transition-colors duration-500">{feature.title}</h3>
              <p className="text-muted-foreground transition-colors duration-500 group-hover:text-foreground/90">{feature.description}</p>
            </div>
            
            {/* Corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-transparent via-transparent to-primary/10 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        )
      })}
    </div>
  )
}

// Main export component
export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-40 right-[20%] h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute bottom-20 left-[30%] h-72 w-72 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: "1.2s" }}></div>
        <div className="absolute top-20 left-[15%] h-40 w-40 rounded-full bg-accent/10 blur-2xl animate-pulse" style={{ animationDelay: "0.8s" }}></div>
        
        {/* Dynamic grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.primary/5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.primary/5)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 animate-pulse">
            <Award className="h-4 w-4" />
            <span className="animate-in" style={{animationDelay: "0.1s"}}>Comprehensive Features</span>
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl animate-in" style={{animationDelay: "0.2s"}}>
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl animate-in" style={{animationDelay: "0.3s"}}>
            Powerful tools designed to transform your fitness journey and achieve your health goals faster.
          </p>
        </div>
        <Suspense fallback={<FeaturesSkeleton />}>
          <FeaturesContent />
        </Suspense>
      </div>
      
      {/* Add dynamic spotlight effect */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
          const cards = document.querySelectorAll('.card-hover');
          cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              
              const spotlight = card.querySelector('[style*="--x"]');
              if (spotlight) {
                spotlight.style.setProperty('--x', x + '%');
                spotlight.style.setProperty('--y', y + '%');
              }
            });
          });
        });
      ` }} />
    </section>
  )
}

