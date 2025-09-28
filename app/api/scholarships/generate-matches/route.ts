import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, inclusivityIndex, surveyData } = await request.json()

    if (!userId || !inclusivityIndex || !surveyData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    console.log("[v0] API: Starting scholarship matching for user:", userId)
    console.log("[v0] API: Inclusivity index:", inclusivityIndex)

    const supabase = await createClient()

    // Get all active scholarships
    const { data: scholarships, error } = await supabase.from("scholarships").select("*").eq("is_active", true)

    if (error) {
      console.error("[v0] API: Error fetching scholarships:", error)
      return NextResponse.json({ error: "Failed to fetch scholarships" }, { status: 500 })
    }

    if (!scholarships || scholarships.length === 0) {
      console.log("[v0] API: No active scholarships found")
      return NextResponse.json({ matches: 0 })
    }

    console.log("[v0] API: Found", scholarships.length, "active scholarships")

    const matches = []

    for (const scholarship of scholarships) {
      console.log("[v0] API: Evaluating scholarship:", scholarship.title)
      const matchScore = calculateMatchScore(scholarship, inclusivityIndex, surveyData)
      const matchReasons = getMatchReasons(scholarship, surveyData)

      console.log("[v0] API: Match score for", scholarship.title, ":", matchScore)

      if (matchScore > 30) {
        // Only save matches above 30%
        matches.push({
          user_id: userId,
          scholarship_id: scholarship.id,
          match_score: matchScore,
          match_reasons: matchReasons,
        })
        console.log("[v0] API: Added match:", scholarship.title, "with score", matchScore)
      }
    }

    console.log("[v0] API: Total matches found:", matches.length)

    // Upsert matches
    if (matches.length > 0) {
      const { error: upsertError } = await supabase
        .from("scholarship_matches")
        .upsert(matches, { onConflict: "user_id,scholarship_id" })

      if (upsertError) {
        console.error("[v0] API: Error upserting matches:", upsertError)
        return NextResponse.json({ error: "Failed to save matches" }, { status: 500 })
      } else {
        console.log("[v0] API: Successfully saved", matches.length, "matches")
      }
    } else {
      console.log("[v0] API: No matches above threshold to save")
    }

    return NextResponse.json({ matches: matches.length })
  } catch (error) {
    console.error("[v0] API: Error in generate-matches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateMatchScore(scholarship: any, inclusivityIndex: number, surveyData: any): number {
  console.log("[v0] API: Calculating match score for:", scholarship.title)
  console.log("[v0] API: Scholarship type:", scholarship.scholarship_type)
  console.log("[v0] API: Matching criteria:", scholarship.matching_criteria)

  let score = 0
  const criteria = scholarship.matching_criteria || {}

  // Base score from inclusivity index alignment
  if (scholarship.scholarship_type === "need-based" && inclusivityIndex > 60) {
    score += 30
    console.log("[v0] API: Added 30 points for need-based + high inclusivity")
  } else if (scholarship.scholarship_type === "merit-based" && inclusivityIndex < 40) {
    score += 20
    console.log("[v0] API: Added 20 points for merit-based + low inclusivity")
  } else if (scholarship.scholarship_type === "first-gen") {
    score += 25
    console.log("[v0] API: Added 25 points for first-gen scholarship")
  } else if (scholarship.scholarship_type === "stem") {
    score += 20
    console.log("[v0] API: Added 20 points for STEM scholarship")
  } else if (scholarship.scholarship_type === "diversity") {
    score += 25
    console.log("[v0] API: Added 25 points for diversity scholarship")
  }

  // Income level matching
  if (criteria.income_level) {
    const incomeScore = criteria.income_level[surveyData.incomeLevel] || 0
    score += incomeScore
    console.log("[v0] API: Added", incomeScore, "points for income level match")
  }

  // Education level matching
  if (criteria.education_level) {
    const eduScore = criteria.education_level[surveyData.educationLevel] || 0
    score += eduScore
    console.log("[v0] API: Added", eduScore, "points for education level match")
  }

  // GPA range matching
  if (criteria.gpa_range) {
    const gpaScore = criteria.gpa_range[surveyData.gpaRange] || 0
    score += gpaScore
    console.log("[v0] API: Added", gpaScore, "points for GPA range match")
  }

  // Language support matching
  if (criteria.language_support) {
    const langScore = criteria.language_support[surveyData.languageSupport] || 0
    score += langScore
    console.log("[v0] API: Added", langScore, "points for language support match")
  }

  // Device/internet access matching
  if (criteria.device_access) {
    const deviceScore = criteria.device_access[surveyData.deviceAccess] || 0
    score += deviceScore
    console.log("[v0] API: Added", deviceScore, "points for device access match")
  }

  if (criteria.internet_access) {
    const internetScore = criteria.internet_access[surveyData.internetAccess] || 0
    score += internetScore
    console.log("[v0] API: Added", internetScore, "points for internet access match")
  }

  // Learning needs matching
  if (criteria.learning_needs) {
    const learningScore = criteria.learning_needs[surveyData.learningNeeds] || 0
    score += learningScore
    console.log("[v0] API: Added", learningScore, "points for learning needs match")
  }

  const finalScore = Math.min(100, Math.max(0, score))
  console.log("[v0] API: Final match score:", finalScore)
  return finalScore
}

function getMatchReasons(scholarship: any, surveyData: any): string[] {
  const reasons = []
  const demographics = scholarship.target_demographics || {}

  if (demographics.income_levels?.includes(surveyData.incomeLevel)) {
    reasons.push("Income level match")
  }

  if (demographics.education_levels?.includes(surveyData.educationLevel)) {
    reasons.push("Education level match")
  }

  if (demographics.language_support?.includes(surveyData.languageSupport)) {
    reasons.push("Language support needs")
  }

  if (demographics.learning_needs?.includes(surveyData.learningNeeds)) {
    reasons.push("Learning differences support")
  }

  if (scholarship.scholarship_type === "first-gen") {
    reasons.push("First-generation college student support")
  }

  if (scholarship.scholarship_type === "stem" && surveyData.goals?.toLowerCase().includes("stem")) {
    reasons.push("STEM career goals")
  }

  return reasons
}
