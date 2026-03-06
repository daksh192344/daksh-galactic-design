
-- Fix ALL RLS policies to be PERMISSIVE instead of RESTRICTIVE

-- project_requests
DROP POLICY IF EXISTS "Admins can select project_requests" ON public.project_requests;
DROP POLICY IF EXISTS "Admins can update project_requests" ON public.project_requests;
DROP POLICY IF EXISTS "Anyone can submit project_requests" ON public.project_requests;

CREATE POLICY "Admins can select project_requests" ON public.project_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update project_requests" ON public.project_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit project_requests" ON public.project_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- projects
DROP POLICY IF EXISTS "Admins can select projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Members can read assigned projects" ON public.projects;

CREATE POLICY "Admins can select projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Members can read assigned projects" ON public.projects FOR SELECT TO authenticated USING (
  id IN (SELECT ta.project_id FROM task_assignments ta WHERE ta.team_member_id IN (SELECT tm.id FROM team_members tm WHERE tm.user_id = auth.uid()))
);

-- task_assignments
DROP POLICY IF EXISTS "Admins can select task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Admins can insert task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Admins can update task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Admins can delete task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Members can read own assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Members can update own assignment status" ON public.task_assignments;

CREATE POLICY "Admins can select task_assignments" ON public.task_assignments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert task_assignments" ON public.task_assignments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update task_assignments" ON public.task_assignments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete task_assignments" ON public.task_assignments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Members can read own assignments" ON public.task_assignments FOR SELECT TO authenticated USING (
  team_member_id IN (SELECT tm.id FROM team_members tm WHERE tm.user_id = auth.uid())
);
CREATE POLICY "Members can update own assignment status" ON public.task_assignments FOR UPDATE TO authenticated USING (
  team_member_id IN (SELECT tm.id FROM team_members tm WHERE tm.user_id = auth.uid())
);

-- team_applications
DROP POLICY IF EXISTS "Admins can select team_applications" ON public.team_applications;
DROP POLICY IF EXISTS "Admins can update team_applications" ON public.team_applications;
DROP POLICY IF EXISTS "Admins can delete team_applications" ON public.team_applications;
DROP POLICY IF EXISTS "Anyone can submit team_applications" ON public.team_applications;

CREATE POLICY "Admins can select team_applications" ON public.team_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update team_applications" ON public.team_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete team_applications" ON public.team_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit team_applications" ON public.team_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

-- team_members
DROP POLICY IF EXISTS "Admins can select team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can insert team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can delete team_members" ON public.team_members;
DROP POLICY IF EXISTS "Members can read own record" ON public.team_members;

CREATE POLICY "Admins can select team_members" ON public.team_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert team_members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update team_members" ON public.team_members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete team_members" ON public.team_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Members can read own record" ON public.team_members FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text,
  video_type text DEFAULT 'youtube',
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolio_items" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert portfolio_items" ON public.portfolio_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update portfolio_items" ON public.portfolio_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete portfolio_items" ON public.portfolio_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for portfolio
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read portfolio files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "Admins can upload portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'::app_role));
