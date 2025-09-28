import { createClient } from "@/lib/supabase/server"

export class ServerScholarshipService {
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

  async getSavedScholarships(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("saved_scholarships")
      .select(`
        *,
        scholarship:scholarships(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }
}
