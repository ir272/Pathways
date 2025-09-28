import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Award, Globe } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-primary rounded-full animate-pulse delay-1500" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Heading */}
        <div className="max-w-5xl mx-auto mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-balance mb-6">
            <span className="block text-foreground">FIND</span>
            <span className="block text-foreground">YOUR</span>
            <span className="block text-accent">PATH</span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium text-balance max-w-3xl mx-auto leading-relaxed">
            Find opportunities designed for students like you.
            <span className="text-foreground font-semibold"> Discover scholarships, programs, and communities</span>{" "}
            that understand your unique journey.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-16">
          <Link href="/survey">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full font-semibold group">
              Get Your Inclusivity Index
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Takes just 2 minutes • Completely free</p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Scholarships</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover funding opportunities that don't require standardized tests and support first-generation
              students.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Programs</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access STEM camps, enrichment programs, and initiatives designed for neurodiverse learners.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Communities</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with local organizations, mentorship networks, and peer support groups.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
