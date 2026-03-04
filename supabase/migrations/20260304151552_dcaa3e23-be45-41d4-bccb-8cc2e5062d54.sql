CREATE TABLE public.project_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  has_logo BOOLEAN DEFAULT false,
  has_content TEXT DEFAULT 'no',
  pages TEXT NOT NULL,
  priority TEXT NOT NULL,
  social_links JSONB DEFAULT '{}',
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  preferred_contact_time TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit project requests"
ON public.project_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "No public reads"
ON public.project_requests
FOR SELECT
USING (false);