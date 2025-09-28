import { createClient } from "@/lib/supabase/server"

// Server-side survey service
export class ServerSurveyService {
  async getSurveyResponse(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("survey_responses").select("*").eq("user_id", userId).maybeSingle()

    if (error) throw error
    return data
  }

  async getScholarshipMatches(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("scholarship_matches")
      .select(`
        *,
        scholarship:scholarships(*)
      `)
      .eq("user_id", userId)
      .order("match_score", { ascending: false })

    if (error) throw error
    return data
  }
}
