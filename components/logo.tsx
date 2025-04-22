import { Dumbbell } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary via-accent to-secondary shadow-md transition-all duration-300 group-hover:shadow-glow">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"></div>
        <Dumbbell className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold gradient-text transition-colors">
          FitLife<span className="font-extrabold">Pro</span>
        </span>
        <span className="text-xs text-muted-foreground -mt-1 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Your Fitness Journey
        </span>
      </div>
    </Link>
  )
}

