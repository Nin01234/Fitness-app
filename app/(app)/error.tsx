'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App section error:', error)
  }, [error])

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Dashboard Error</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We encountered an error in the dashboard. You can try again or navigate to another section.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 