import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { HeroCarousel } from "@/components/landing/hero-carousel"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, Star, Trophy, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="gradient" size="sm" className="shadow-glow">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20">
          <div className="absolute inset-0 opacity-30 transition-all duration-1000">
            {/* Dynamic animated background elements */}
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-pulse" style={{ animationDelay: "0.7s" }}></div>
            <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: "1.4s" }}></div>
            
            {/* Additional animated elements */}
            <div className="absolute top-1/4 right-1/4 h-40 w-40 rounded-full bg-primary/10 blur-xl animate-pulse" style={{ animationDelay: "0.3s" }}></div>
            <div className="absolute bottom-1/3 right-1/3 h-60 w-60 rounded-full bg-secondary/10 blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            
            {/* Dynamic grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.primary/5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.primary/5)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
            
            {/* Floating particles */}
            <div className="particles absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="particle absolute rounded-full bg-primary/20 backdrop-blur-sm"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.3 + Math.random() * 0.5,
                    animation: `float ${5 + Math.random() * 10}s linear infinite, pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4 animate-in" style={{animationDelay: "0.1s"}}>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>Revolutionize your fitness journey</span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Transform Your{" "}
                    <span className="gradient-text font-bold">
                      Fitness Journey
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Track workouts, monitor nutrition, and achieve your fitness goals with FitLife's comprehensive
                    tools.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row animate-in" style={{animationDelay: "0.2s"}}>
                  <Link href="/signup">
                    <Button variant="glowing" size="xl" animation="glow" className="w-full sm:w-auto">
                      Get Started <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto hover-scale">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 animate-in" style={{animationDelay: "0.3s"}}>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-10 w-10 overflow-hidden rounded-full border-2 border-background shadow-lg"
                      >
                        <Image
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={`User ${i}`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    Join <span className="font-medium text-primary">2,000+</span> users transforming their fitness
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 animate-in" style={{animationDelay: "0.4s"}}>
                  {[
                    { icon: <Star className="text-yellow-500" />, text: "4.9/5 on App Store" },
                    { icon: <Zap className="text-secondary" />, text: "Lightning fast tracking" },
                    { icon: <Trophy className="text-accent" />, text: "Award-winning design" }
                  ].map((item, i) => (
                    <div key={i} className="inline-flex items-center gap-2 rounded-full bg-background/80 border px-4 py-2 text-sm shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:bg-background/90">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mx-auto max-w-[500px] lg:mx-0 animate-in" style={{animationDelay: "0.5s"}}>
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-xl rounded-[32px] animate-pulse" style={{animationDelay: "1s"}}></div>
                <div className="rounded-[20px] border bg-background/50 p-2 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-glow">
                  <HeroCarousel />
                </div>
              </div>
            </div>
            
            <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: "Active Users", value: "100K+" },
                { label: "Workouts Completed", value: "2M+" },
                { label: "Calories Tracked", value: "500M+" },
                { label: "Countries", value: "50+" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center rounded-lg border bg-background/50 p-6 backdrop-blur-sm shadow-sm card-hover transition-all">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

