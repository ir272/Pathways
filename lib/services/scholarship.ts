import { createClient } from "@/lib/supabase/client"
import type { ApplicationTracking } from "@/lib/types/database"

export class ScholarshipService {
  private supabase = createClient()

  async getScholarships(filters?: {
    search?: string
    type?: string
    limit?: number
    offset?: number
  }) {
    let query = this.supabase.from("scholarships").select("*").eq("is_active", true)

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,organization.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      )
    }

    if (filters?.type && filters.type !== "all") {
      query = query.eq("scholarship_type", filters.type)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data
  }

  async getScholarshipMatches(userId?: string) {
    if (!userId) {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")
      userId = user.id
    }

    const { data, error } = await this.supabase
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

  async getSavedScholarships(userId?: string) {
    if (!userId) {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")
      userId = user.id
    }

    const { data, error } = await this.supabase
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

  async saveScholarship(scholarshipId: string, notes?: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    console.log("[v0] ScholarshipService: Saving scholarship:", scholarshipId)

    const { data, error } = await this.supabase
      .from("saved_scholarships")
      .upsert(
        {
          user_id: user.id,
          scholarship_id: scholarshipId,
          notes: notes,
          application_status: "saved",
        },
        {
          onConflict: "user_id,scholarship_id", // Specify the unique constraint columns
          ignoreDuplicates: false, // Update existing records instead of ignoring
        },
      )
      .select()

    if (error) {
      console.error("[v0] ScholarshipService: Error saving:", error.message)
      throw error
    }

    console.log("[v0] ScholarshipService: Successfully saved:", data)
    return data
  }

  async updateApplicationStatus(scholarshipId: string, status?: string | null, notes?: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (status !== undefined) {
      updateData.application_status = status
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data, error } = await this.supabase
      .from("saved_scholarships")
      .update(updateData)
      .eq("user_id", user.id)
      .eq("scholarship_id", scholarshipId)
      .select()

    if (error) throw error
    return data
  }

  async unsaveScholarship(scholarshipId: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await this.supabase
      .from("saved_scholarships")
      .delete()
      .eq("user_id", user.id)
      .eq("scholarship_id", scholarshipId)

    if (error) throw error
  }

  async isScholarshipSaved(scholarshipId: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await this.supabase
      .from("saved_scholarships")
      .select("id")
      .eq("user_id", user.id)
      .eq("scholarship_id", scholarshipId)
      .single()

    return !error && !!data
  }

  async trackApplication(scholarshipId: string, applicationData: any) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Get scholarship deadline
    const { data: scholarship } = await this.supabase
      .from("scholarships")
      .select("deadline")
      .eq("id", scholarshipId)
      .single()

    const { data, error } = await this.supabase
      .from("application_tracking")
      .upsert({
        user_id: user.id,
        scholarship_id: scholarshipId,
        status: "draft",
        application_data: applicationData,
        deadline_date: scholarship?.deadline,
      })
      .select()

    if (error) throw error
    return data
  }

  async getApplications(userId?: string) {
    if (!userId) {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")
      userId = user.id
    }

    const { data, error } = await this.supabase
      .from("application_tracking")
      .select(`
        *,
        scholarship:scholarships(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async updateApplicationTracking(applicationId: string, updates: Partial<ApplicationTracking>) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await this.supabase
      .from("application_tracking")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)
      .eq("user_id", user.id)
      .select()

    if (error) throw error
    return data
  }
}
