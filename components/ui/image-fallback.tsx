import { AlertTriangle } from "lucide-react"

interface ImageFallbackProps {
  message?: string
  className?: string
}

export function ImageFallback({ message = "Unable to load image", className = "h-[300px]" }: ImageFallbackProps) {
  return (
    <div className={`flex items-center justify-center rounded-md border border-dashed p-8 text-center ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

