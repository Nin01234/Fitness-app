import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { GraduationCap, Clock, Star, PlayCircle, Bookmark, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Premium Courses - FitLife",
  description: "Access advanced training courses with expert instructors",
}

const coursesData = [
  {
    id: "c1",
    title: "Advanced Strength Training",
    description: "Master advanced strength training techniques with expert coach Mike Johnson.",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Strength+Training",
    duration: "8 weeks",
    level: "Advanced",
    modules: 12,
    rating: 4.9,
    students: 2843,
    instructor: "Mike Johnson",
    category: "strength",
  },
  {
    id: "c2",
    title: "Yoga for Athletes",
    description: "Improve flexibility, recovery, and performance with yoga practices designed for athletes.",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Yoga+For+Athletes",
    duration: "6 weeks",
    level: "Intermediate",
    modules: 10,
    rating: 4.8,
    students: 1987,
    instructor: "Sarah Chen",
    category: "mobility",
  },
  {
    id: "c3",
    title: "Sports Nutrition Mastery",
    description: "Learn advanced nutritional strategies to optimize performance and recovery.",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Sports+Nutrition",
    duration: "4 weeks",
    level: "All Levels",
    modules: 8,
    rating: 4.7,
    students: 3245,
    instructor: "Dr. Emily Roberts",
    category: "nutrition",
  },
  {
    id: "c4",
    title: "HIIT Programming Specialist",
    description: "Design effective high-intensity interval training programs for any fitness level.",
    thumbnail: "/placeholder.svg?height=200&width=400&text=HIIT+Programming",
    duration: "5 weeks",
    level: "Intermediate",
    modules: 9,
    rating: 4.8,
    students: 2156,
    instructor: "Carlos Mendez",
    category: "cardio",
  },
  {
    id: "c5",
    title: "Mobility & Recovery Techniques",
    description: "Master advanced recovery techniques to prevent injury and improve performance.",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Mobility+Recovery",
    duration: "3 weeks",
    level: "All Levels",
    modules: 6,
    rating: 4.9,
    students: 1879,
    instructor: "Dr. James Wilson",
    category: "mobility",
  },
  {
    id: "c6",
    title: "Hypertrophy Training Specialist",
    description: "Learn the science and practical application of muscle building programs.",
    thumbnail: "/placeholder.svg?height=200&width=400&text=Hypertrophy+Training",
    duration: "8 weeks",
    level: "Advanced",
    modules: 14,
    rating: 4.9,
    students: 2564,
    instructor: "Kim Taylor",
    category: "strength",
  },
]

export default function PremiumCoursesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Advanced Training Courses"
        text="Premium courses led by industry experts to level up your fitness knowledge and skills."
      />
      
      <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-muted/10 rounded-xl border border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="rounded-full bg-primary/20 p-3">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-medium">Unlock Premium Knowledge</h2>
            <p className="text-muted-foreground mt-1">Access all courses with your Premium subscription or purchase individual courses.</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90">
            <Link href="/premium">Upgrade to Premium</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coursesData.map((course) => (
          <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-video">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <Badge className="bg-primary/80">{course.category}</Badge>
                <Badge variant="outline" className="bg-black/50 text-white border-none">
                  <Clock className="h-3 w-3 mr-1" /> {course.duration}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-between text-sm pb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="fill-amber-500 h-4 w-4 mr-1" />
                  <span>{course.rating}</span>
                  <span className="text-muted-foreground ml-1">({course.students} students)</span>
                </div>
                <div className="text-muted-foreground">{course.level}</div>
              </div>
              
              <div className="flex justify-between pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  By <span className="font-medium text-foreground">{course.instructor}</span>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link href={`/premium/courses/${course.id}`}>
                    <PlayCircle className="h-4 w-4" />
                    <span>Start Course</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
} 