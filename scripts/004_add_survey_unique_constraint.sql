-- Add unique constraint on user_id for survey_responses table
-- This allows upsert operations to work properly

ALTER TABLE public.survey_responses 
ADD CONSTRAINT survey_responses_user_id_unique UNIQUE (user_id);
