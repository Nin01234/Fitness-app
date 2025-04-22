import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function AppCreators() {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          About FitLife
        </CardTitle>
        <CardDescription>Created by fitness enthusiasts for fitness enthusiasts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          FitLife was developed by a team of fitness professionals, software engineers, and nutrition experts who are
          passionate about helping people achieve their fitness goals. Our mission is to make fitness tracking
          accessible, intuitive, and effective for everyone.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div>
              <p className="text-sm font-medium">Godfred Osei</p>
              <p className="text-xs text-muted-foreground">Lead Developer & Fitness Coach</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900"
              >
                <Link href="https://github.com/Nin01234" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900"
              >
                <Link href="mailto:innocentgh10@email.com">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div>
              <p className="text-sm font-medium">Beatrice Nettey</p>
              <p className="text-xs text-muted-foreground">Nutrition Specialist & UX Designer</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900"
              >
                <Link href="tel:+233260317190">
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Phone</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
            asChild
          >
            <Link href="https://github.com/Nin01234" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

