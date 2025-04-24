import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Acknowledgments | FitLife Pro",
  description: "Meet the team behind FitLife Pro",
}

export default function AcknowledgmentsPage() {
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Acknowledgments</h1>
        <p className="text-muted-foreground">
          Meet the amazing team behind FitLife Pro
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Godfred Osei</CardTitle>
            <CardDescription>Backend Developer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Godfred is the lead backend developer responsible for creating the robust API architecture, 
              database design, and server infrastructure that powers FitLife Pro. His expertise in 
              performance optimization and security ensures that your data is safe and the app runs smoothly.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Beatrice Nettey</CardTitle>
            <CardDescription>UX/UI Designer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Beatrice is the creative mind behind FitLife Pro's intuitive and beautiful interface. 
              Her user-centered design approach and attention to detail have created a seamless, 
              engaging, and accessible experience for all users. She's passionate about creating 
              interfaces that make fitness tracking enjoyable and effective.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground">
          At FitLife Pro, we're dedicated to making fitness accessible, personalized, and effective 
          for everyone. Our diverse team brings together expertise in fitness, technology, and design 
          to create a platform that truly helps you achieve your health goals.
        </p>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button asChild>
          <Link href="/about">
            Back to About <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 