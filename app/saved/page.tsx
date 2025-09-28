import { Navigation } from "@/components/navigation"
import { SavedOpportunities } from "@/components/saved-opportunities"

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <SavedOpportunities />
      </main>
    </div>
  )
}
