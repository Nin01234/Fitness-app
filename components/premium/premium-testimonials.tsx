import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"

export function PremiumTestimonials() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">What Our Premium Members Say</h2>
        <p className="mt-2 text-muted-foreground">
          Join thousands of satisfied members who have transformed their fitness journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm">
              "The premium features have completely transformed my workouts. The AI recommendations helped me break
              through plateaus I've been stuck at for months. Worth every penny!"
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center">
              <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image src="/placeholder.svg?height=40&width=40&text=JS" alt="John S." fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">John S.</p>
                <p className="text-xs text-muted-foreground">Premium member for 8 months</p>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm">
              "The meal planning feature alone is worth the subscription. I've saved so much time and money on
              groceries, and my nutrition has improved dramatically. Love it!"
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center">
              <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image src="/placeholder.svg?height=40&width=40&text=SM" alt="Sarah M." fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">Sarah M.</p>
                <p className="text-xs text-muted-foreground">Premium member for 1 year</p>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm">
              "The advanced analytics have been a game-changer for my training. Being able to see detailed progress over
              time has kept me motivated and on track with my goals."
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center">
              <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image src="/placeholder.svg?height=40&width=40&text=DT" alt="David T." fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">David T.</p>
                <p className="text-xs text-muted-foreground">Premium member for 6 months</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

