import { createClient } from "@/lib/supabase/client"

// Client-side survey service - only uses browser client
export class SurveyService {
  private supabase = createClient()

  async submitSurvey(surveyData: {
    incomeLevel: string
    deviceAccess: string
    internetAccess: string
    languageSupport: string
    learningNeeds: string
    gpaRange: string
    location?: string
    educationLevel: string
    barriers?: string
    goals?: string
  }) {
    console.log("[v0] Starting survey submission")
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    console.log("[v0] User authenticated:", user.id)

    // Calculate inclusivity index
    const inclusivityIndex = this.calculateInclusivityIndex(surveyData)
    const indexBreakdown = this.calculateIndexBreakdown(surveyData)

    console.log("[v0] Calculated inclusivity index:", inclusivityIndex)

    // Convert camelCase to snake_case for database
    const dbData = {
      user_id: user.id,
      income_level: surveyData.incomeLevel,
      device_access: surveyData.deviceAccess,
      internet_access: surveyData.internetAccess,
      language_support: surveyData.languageSupport,
      learning_needs: surveyData.learningNeeds,
      gpa_range: surveyData.gpaRange,
      location: surveyData.location,
      education_level: surveyData.educationLevel,
      barriers: surveyData.barriers,
      goals: surveyData.goals,
      inclusivity_index: inclusivityIndex,
      index_breakdown: indexBreakdown,
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] Submitting survey data to database")

    const { data, error } = await this.supabase
      .from("survey_responses")
      .upsert(dbData, { onConflict: "user_id" })
      .select()
      .single()

    if (error) {
      console.error("[v0] Survey submission error:", error.message)
      throw new Error(`Failed to save survey results: ${error.message}`)
    }

    console.log("[v0] Survey submitted successfully")

    // Generate scholarship matches via API
    try {
      const response = await fetch("/api/scholarships/generate-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          inclusivityIndex,
          surveyData,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to generate matches:", response.statusText)
      } else {
        console.log("[v0] Scholarship matches generated via API")
      }
    } catch (error) {
      console.error("[v0] Error calling generate matches API:", error)
    }

    return data
  }

  async getSurveyResponse(userId?: string) {
    if (!userId) {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return null
      userId = user.id
    }

    const { data, error } = await this.supabase.from("survey_responses").select("*").eq("user_id", userId).maybeSingle()

    if (error) {
      console.error("[v0] Error fetching survey response:", error.message)
      throw error
    }

    console.log("[v0] Survey response fetched:", data ? "found" : "not found")
    return data
  }

  private calculateInclusivityIndex(data: any): number {
    let score = 0
    const maxScore = 100

    // Income level scoring (0-25 points)
    if (data.incomeLevel === "low") score += 25
    else if (data.incomeLevel === "moderate") score += 20
    else if (data.incomeLevel === "middle") score += 15
    else score += 10

    // Device access scoring (0-20 points)
    if (data.deviceAccess === "smartphone-only") score += 20
    else if (data.deviceAccess === "smartphone-tablet") score += 15
    else if (data.deviceAccess === "smartphone-computer") score += 10
    else score += 5

    // Internet access scoring (0-20 points)
    if (data.internetAccess === "limited") score += 20
    else if (data.internetAccess === "mobile-only") score += 15
    else if (data.internetAccess === "home-wifi") score += 10
    else score += 5

    // Language support scoring (0-20 points)
    if (data.languageSupport === "need-translation") score += 20
    else if (data.languageSupport === "english-second") score += 15
    else if (data.languageSupport === "multilingual") score += 10
    else score += 5

    // Learning needs scoring (0-15 points)
    if (data.learningNeeds === "adhd" || data.learningNeeds === "dyslexia" || data.learningNeeds === "other")
      score += 15
    else score += 5

    return Math.round((score / maxScore) * 100)
  }

  private calculateIndexBreakdown(data: any) {
    const breakdown = {
      access: 0,
      financial: 0,
      language: 0,
      academic: 0,
    }

    // Access (device + internet)
    let accessScore = 0
    if (data.deviceAccess === "smartphone-only") accessScore += 20
    else if (data.deviceAccess === "smartphone-tablet") accessScore += 15
    else if (data.deviceAccess === "smartphone-computer") accessScore += 10
    else accessScore += 5

    if (data.internetAccess === "limited") accessScore += 20
    else if (data.internetAccess === "mobile-only") accessScore += 15
    else if (data.internetAccess === "home-wifi") accessScore += 10
    else accessScore += 5

    breakdown.access = Math.round((accessScore / 40) * 25)

    // Financial
    if (data.incomeLevel === "low") breakdown.financial = 25
    else if (data.incomeLevel === "moderate") breakdown.financial = 20
    else if (data.incomeLevel === "middle") breakdown.financial = 15
    else breakdown.financial = 10

    // Language
    if (data.languageSupport === "need-translation") breakdown.language = 25
    else if (data.languageSupport === "english-second") breakdown.language = 20
    else if (data.languageSupport === "multilingual") breakdown.language = 15
    else breakdown.language = 10

    // Academic (learning needs)
    if (data.learningNeeds === "adhd" || data.learningNeeds === "dyslexia" || data.learningNeeds === "other")
      breakdown.academic = 25
    else breakdown.academic = 10

    return breakdown
  }
}
