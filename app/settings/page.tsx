import { Navigation } from "@/components/navigation"
import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <SettingsPage />
      </main>
    </div>
  )
}
