import { Button } from "../ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Streamline Your Projects with TaskFlow
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl text-balance">
            The modern project management tool that helps teams collaborate seamlessly, track progress effortlessly, and
            deliver results faster than ever before.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base px-8">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
