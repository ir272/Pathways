import { type NextRequest, NextResponse } from "next/server"
import { ServerSurveyService } from "@/lib/services/server-survey"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const surveyService = new ServerSurveyService()
    const response = await surveyService.getSurveyResponse(user.id)

    return NextResponse.json({ data: response })
  } catch (error) {
    console.error("[v0] Error fetching survey response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
