import { CheckCircle, Clock, Target, Lightbulb } from "lucide-react"

export function BenefitsShowcase() {
  const benefits = [
    {
      icon: Clock,
      title: "Save 40+ Hours of Research",
      description:
        "Stop scrolling through hundreds of irrelevant scholarships. Our algorithm finds opportunities that actually match your background and circumstances.",
    },
    {
      icon: Target,
      title: "Get Personalized Matches",
      description:
        "Your Inclusivity Index reveals opportunities specifically designed for students with your background, learning style, and circumstances.",
    },
    {
      icon: Lightbulb,
      title: "Access Hidden Opportunities",
      description:
        "Discover scholarships and programs that don't require perfect grades, standardized tests, or extensive extracurriculars.",
    },
    {
      icon: CheckCircle,
      title: "Track Your Progress",
      description:
        "Stay organized with application deadlines, requirements, and status updates. Never miss an opportunity because you forgot a deadline.",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-balance mb-6">
            How We Help You
            <span className="text-accent"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Real students. Real barriers. Real solutions. See how our platform transforms the scholarship search from
            overwhelming to empowering.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-accent/20"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <benefit.icon className="h-7 w-7 text-accent" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-3xl p-8 max-w-4xl mx-auto border border-accent/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Path?</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Join students who have found their path to success through Pathways.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-sm text-muted-foreground">
                ✓ 100% Free Forever ✓ No Hidden Fees ✓ Privacy Protected
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
