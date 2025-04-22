import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WorkoutTips() {
  const tips = [
    {
      title: "Proper Form",
      description: "Focus on maintaining proper form throughout each exercise. Quality over quantity!",
    },
    {
      title: "Breathing",
      description: "Remember to breathe steadily. Exhale during exertion, inhale during the easier phase.",
    },
    {
      title: "Progressive Overload",
      description: "Gradually increase weight, frequency, or reps as you get stronger.",
    },
    {
      title: "Rest Periods",
      description: "Allow adequate rest between sets (30-90 seconds) based on your goals.",
    },
  ]

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Exercise Safety</AlertTitle>
        <AlertDescription>
          Always warm up properly and listen to your body. Stop if you experience pain and consult a professional if
          needed.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

