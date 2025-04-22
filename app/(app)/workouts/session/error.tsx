'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCcw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function WorkoutSessionError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Workout session error:', error)
  }, [error])

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Workout Session Error</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We encountered an error with your workout session. This might be due to missing workout data or a network issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/workouts">
              <ArrowLeft className="h-4 w-4" />
              Back to Workouts
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 