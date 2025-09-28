-- Add unique constraint to survey_responses table for user_id
-- This ensures each user can only have one survey response

ALTER TABLE public.survey_responses 
ADD CONSTRAINT survey_responses_user_id_unique UNIQUE (user_id);
