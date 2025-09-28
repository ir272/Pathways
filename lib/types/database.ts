// Database type definitions for the scholarship platform
// These types match the database schema created in the SQL scripts

export interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  bio?: string
  location?: string
  preferred_language?: string
  accessibility_needs?: string[]
  notification_preferences?: {
    email: boolean
    push: boolean
  }
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id: string
  user_id: string
  income_level: "low" | "moderate" | "middle" | "prefer-not-to-say"
  device_access: "smartphone-only" | "smartphone-tablet" | "smartphone-computer" | "all-devices"
  internet_access: "limited" | "mobile-only" | "home-wifi" | "multiple-locations"
  language_support: "english-first" | "english-second" | "multilingual" | "need-translation"
  learning_needs: "none" | "adhd" | "dyslexia" | "other" | "prefer-not-to-say"
  gpa_range: "3.5-4.0" | "3.0-3.4" | "2.5-2.9" | "below-2.5" | "not-applicable"
  location?: string
  education_level: "high-school" | "community-college" | "undergraduate" | "graduate" | "other"
  barriers?: string
  goals?: string
  inclusivity_index: number
  index_breakdown: {
    access: number
    financial: number
    language: number
    academic: number
  }
  completed_at: string
  created_at: string
  updated_at: string
}

export interface Scholarship {
  id: string
  title: string
  organization: string
  amount: string
  deadline: string
  description: string
  eligibility_criteria: string[]
  scholarship_type:
    | "need-based"
    | "merit-based"
    | "first-gen"
    | "stem"
    | "international"
    | "community-service"
    | "arts"
    | "athletics"
  application_url?: string
  requirements?: string[]
  tags?: string[]
  target_demographics?: Record<string, any>
  matching_criteria?: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SavedScholarship {
  id: string
  user_id: string
  scholarship_id: string
  notes?: string
  application_status: "saved" | "in-progress" | "submitted" | "accepted" | "rejected"
  application_deadline_reminder: boolean
  created_at: string
  updated_at: string
  scholarship?: Scholarship
}

export interface ScholarshipMatch {
  id: string
  user_id: string
  scholarship_id: string
  match_score: number
  match_reasons: string[]
  calculated_at: string
  scholarship?: Scholarship
}

export interface ApplicationTracking {
  id: string
  user_id: string
  scholarship_id: string
  status: "draft" | "in-progress" | "submitted" | "under-review" | "accepted" | "rejected" | "waitlisted"
  application_data?: Record<string, any>
  submitted_at?: string
  deadline_date?: string
  notes?: string
  created_at: string
  updated_at: string
  scholarship?: Scholarship
}

// Utility types for API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}
