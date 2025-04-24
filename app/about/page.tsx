import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Users, Award, Code } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | FitLife Pro",
  description: "Learn about FitLife Pro and our mission to help you achieve your fitness goals",
}

export default function AboutPage() {
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">About FitLife Pro</h1>
        <p className="text-muted-foreground">
          Our mission is to empower you on your fitness journey
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Our Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7">
              FitLife Pro was born from a simple vision: to make fitness accessible, personalized, and effective for everyone.
              We believe that everyone deserves access to high-quality fitness guidance tailored to their unique needs and goals.
              What started as a small project has grown into a comprehensive fitness platform that helps thousands of users
              track their workouts, plan their nutrition, and achieve their health goals.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Our Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7 mb-4">
              Behind FitLife Pro is a dedicated team of fitness enthusiasts, developers, designers, and health specialists
              who are passionate about creating technology that positively impacts people's lives. Our diverse backgrounds
              and expertise allow us to approach fitness from multiple angles, ensuring that our platform is both
              scientifically sound and user-friendly.
            </p>
            <Button asChild variant="outline">
              <Link href="/about/acknowledgments">
                Meet Our Team <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" /> Technology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-7">
              We leverage cutting-edge technology to provide you with the best possible fitness experience. From advanced
              analytics that track your progress to AI-powered recommendations that adapt to your needs, we're constantly
              innovating to help you achieve more. Our platform is built with security and privacy in mind, ensuring that
              your personal data is always protected.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
        
        <Button asChild>
          <Link href="/terms">
            Terms & Conditions <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 