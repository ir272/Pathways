-- Create database schema for scholarship platform
-- This script creates all necessary tables with proper relationships and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  bio TEXT,
  location TEXT,
  preferred_language TEXT DEFAULT 'en',
  accessibility_needs TEXT[],
  notification_preferences JSONB DEFAULT '{"email": true, "push": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  income_level TEXT NOT NULL CHECK (income_level IN ('low', 'moderate', 'middle', 'prefer-not-to-say')),
  device_access TEXT NOT NULL CHECK (device_access IN ('smartphone-only', 'smartphone-tablet', 'smartphone-computer', 'all-devices')),
  internet_access TEXT NOT NULL CHECK (internet_access IN ('limited', 'mobile-only', 'home-wifi', 'multiple-locations')),
  language_support TEXT NOT NULL CHECK (language_support IN ('english-first', 'english-second', 'multilingual', 'need-translation')),
  learning_needs TEXT NOT NULL CHECK (learning_needs IN ('none', 'adhd', 'dyslexia', 'other', 'prefer-not-to-say')),
  gpa_range TEXT NOT NULL CHECK (gpa_range IN ('3.5-4.0', '3.0-3.4', '2.5-2.9', 'below-2.5', 'not-applicable')),
  location TEXT,
  education_level TEXT NOT NULL CHECK (education_level IN ('high-school', 'community-college', 'undergraduate', 'graduate', 'other')),
  barriers TEXT,
  goals TEXT,
  inclusivity_index INTEGER NOT NULL CHECK (inclusivity_index >= 0 AND inclusivity_index <= 100),
  index_breakdown JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  eligibility_criteria TEXT[] NOT NULL,
  scholarship_type TEXT NOT NULL CHECK (scholarship_type IN ('need-based', 'merit-based', 'first-gen', 'stem', 'international', 'community-service', 'arts', 'athletics')),
  application_url TEXT,
  requirements TEXT[],
  tags TEXT[],
  target_demographics JSONB,
  matching_criteria JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_scholarships table (user's saved/bookmarked scholarships)
CREATE TABLE IF NOT EXISTS public.saved_scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  notes TEXT,
  application_status TEXT DEFAULT 'saved' CHECK (application_status IN ('saved', 'in-progress', 'submitted', 'accepted', 'rejected')),
  application_deadline_reminder BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- Create scholarship_matches table (calculated matches for users)
CREATE TABLE IF NOT EXISTS public.scholarship_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons TEXT[],
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- Create application_tracking table
CREATE TABLE IF NOT EXISTS public.application_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'submitted', 'under-review', 'accepted', 'rejected', 'waitlisted')),
  application_data JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE,
  deadline_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for survey_responses
CREATE POLICY "Users can view their own survey responses" ON public.survey_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON public.survey_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON public.survey_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for scholarships (public read access)
CREATE POLICY "Anyone can view active scholarships" ON public.scholarships
  FOR SELECT USING (is_active = true);

-- Create RLS policies for saved_scholarships
CREATE POLICY "Users can view their own saved scholarships" ON public.saved_scholarships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved scholarships" ON public.saved_scholarships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved scholarships" ON public.saved_scholarships
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved scholarships" ON public.saved_scholarships
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for scholarship_matches
CREATE POLICY "Users can view their own scholarship matches" ON public.scholarship_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scholarship matches" ON public.scholarship_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for application_tracking
CREATE POLICY "Users can view their own applications" ON public.application_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" ON public.application_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.application_tracking
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" ON public.application_tracking
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON public.survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_inclusivity_index ON public.survey_responses(inclusivity_index);
CREATE INDEX IF NOT EXISTS idx_scholarships_type ON public.scholarships(scholarship_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_active ON public.scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user_id ON public.saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_matches_user_id ON public.scholarship_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_matches_score ON public.scholarship_matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_application_tracking_user_id ON public.application_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_application_tracking_status ON public.application_tracking(status);
