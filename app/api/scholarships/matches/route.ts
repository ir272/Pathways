import { type NextRequest, NextResponse } from "next/server"
import { ServerSurveyService } from "@/lib/services/server-survey"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] API: Fetching scholarship matches")
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] API: User not authenticated")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] API: User authenticated:", user.id)

    const surveyService = new ServerSurveyService()
    const matches = await surveyService.getScholarshipMatches(user.id)

    console.log("[v0] API: Found", matches?.length || 0, "matches")

    return NextResponse.json({ data: matches })
  } catch (error) {
    console.error("[v0] API: Error fetching scholarship matches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
