
-- Create application role enum
CREATE TYPE public.application_role AS ENUM ('cold_caller', 'social_media_marketer', 'nocode_builder', 'web_developer', 'designer', 'digital_marketer');

-- Create application status enum  
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create team applications table
CREATE TABLE public.team_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  role application_role NOT NULL,
  role_specific_answers JSONB DEFAULT '{}'::jsonb,
  portfolio_links JSONB DEFAULT '[]'::jsonb,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit applications
CREATE POLICY "Anyone can submit team applications"
ON public.team_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can read all applications
CREATE POLICY "Admins can read team applications"
ON public.team_applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update applications
CREATE POLICY "Admins can update team applications"
ON public.team_applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete applications
CREATE POLICY "Admins can delete team applications"
ON public.team_applications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_team_applications_updated_at
  BEFORE UPDATE ON public.team_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
