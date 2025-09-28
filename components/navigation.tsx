import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-foreground">
          PATHWAYS
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/saved"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Saved
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/survey">
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
