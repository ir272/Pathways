"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { InclusivityIndexCard } from "@/components/inclusivity-index-card"
import { ScholarshipMatches } from "@/components/scholarship-matches"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthGuard } from "@/components/auth-guard"
import type { SurveyResponse, ScholarshipMatch } from "@/lib/types/database"

export default function DashboardPage() {
  const [surveyResponse, setSurveyResponse] = useState<SurveyResponse | null>(null)
  const [scholarshipMatches, setScholarshipMatches] = useState<ScholarshipMatch[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        // Fetch survey response via API route
        const surveyRes = await fetch("/api/survey/response")
        if (!surveyRes.ok) {
          throw new Error("Failed to fetch survey response")
        }
        const surveyData = await surveyRes.json()

        if (!surveyData.data) {
          // User hasn't taken survey yet, redirect to survey page
          router.push("/survey")
          return
        }
        setSurveyResponse(surveyData.data)

        // Fetch scholarship matches via API route
        const matchesRes = await fetch("/api/scholarships/matches")
        if (!matchesRes.ok) {
          throw new Error("Failed to fetch scholarship matches")
        }
        const matchesData = await matchesRes.json()
        setScholarshipMatches(matchesData.data || [])

        // Load saved scholarships count
        const { data: savedScholarships } = await supabase
          .from("saved_scholarships")
          .select("id")
          .eq("user_id", user.id)

        setSavedCount(savedScholarships?.length || 0)
      } catch (error) {
        console.error("[v0] Error loading dashboard data:", error)
        if (error?.message?.includes("survey") || error?.code === "PGRST116") {
          router.push("/survey")
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router, supabase])

  const handleSaveScholarship = async (scholarshipId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      console.log("[v0] Dashboard: Updating counter for scholarship:", scholarshipId)

      // Just refresh the saved count from database after ScholarshipMatches handles the save/unsave
      const { data: savedScholarships } = await supabase.from("saved_scholarships").select("id").eq("user_id", user.id)

      const actualCount = savedScholarships?.length || 0
      console.log("[v0] Dashboard: Updated saved count to:", actualCount)
      setSavedCount(actualCount)
    } catch (error) {
      console.error("[v0] Error updating saved count:", error)
    }
  }

  const handleShareResults = async () => {
    if (!surveyResponse) return

    const shareData = {
      title: "My Education Pathway Results",
      text: `I found ${scholarshipMatches.length} scholarship matches with an inclusivity index of ${surveyResponse.inclusivity_index}! Check out PATHWAYS to find your personalized education opportunities.`,
      url: window.location.origin,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n\nDiscover your pathway: ${shareData.url}`)
        // You could add a toast notification here
        alert("Results copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n\nDiscover your pathway: ${shareData.url}`)
        alert("Results copied to clipboard!")
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError)
        alert("Unable to share results. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!surveyResponse) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Complete Your Profile</h2>
            <p className="text-muted-foreground">Take our survey to get personalized scholarship matches</p>
            <Button asChild>
              <Link href="/survey">Start Survey</Link>
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-24 space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Your Personalized Education Pathway</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Based on your unique profile, we've found opportunities designed specifically for students like you.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{surveyResponse.inclusivity_index}</div>
                <div className="text-sm text-muted-foreground">Inclusivity Index</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{scholarshipMatches.length}</div>
                <div className="text-sm text-muted-foreground">Scholarship Matches</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {scholarshipMatches.filter((m) => m.match_score > 80).length}
                </div>
                <div className="text-sm text-muted-foreground">High Matches</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{savedCount}</div>
                <div className="text-sm text-muted-foreground">Saved Items</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Inclusivity Index */}
            <div className="lg:col-span-1 space-y-6">
              <InclusivityIndexCard
                score={surveyResponse.inclusivity_index}
                breakdown={surveyResponse.index_breakdown}
              />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/saved">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <BookOpen className="h-4 w-4" />
                      View Saved Items ({savedCount})
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={handleShareResults}
                  >
                    <Share2 className="h-4 w-4" />
                    Share Results
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Scholarship Matches */}
            <div className="lg:col-span-2">
              <ScholarshipMatches matches={scholarshipMatches} onSave={handleSaveScholarship} />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
