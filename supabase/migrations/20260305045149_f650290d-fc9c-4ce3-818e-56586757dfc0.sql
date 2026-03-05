
-- Drop all restrictive policies and recreate as permissive

-- team_members
DROP POLICY IF EXISTS "Admins can delete team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can insert team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can read team_members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update team_members" ON public.team_members;

CREATE POLICY "Admins can select team_members" ON public.team_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert team_members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update team_members" ON public.team_members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete team_members" ON public.team_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- team_applications
DROP POLICY IF EXISTS "Admins can delete team applications" ON public.team_applications;
DROP POLICY IF EXISTS "Admins can read team applications" ON public.team_applications;
DROP POLICY IF EXISTS "Admins can update team applications" ON public.team_applications;
DROP POLICY IF EXISTS "Anyone can submit team applications" ON public.team_applications;

CREATE POLICY "Admins can select team_applications" ON public.team_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update team_applications" ON public.team_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete team_applications" ON public.team_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit team_applications" ON public.team_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

-- project_requests
DROP POLICY IF EXISTS "Admins can read project_requests" ON public.project_requests;
DROP POLICY IF EXISTS "Admins can update project_requests" ON public.project_requests;
DROP POLICY IF EXISTS "Anyone can submit project requests" ON public.project_requests;

CREATE POLICY "Admins can select project_requests" ON public.project_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project_requests" ON public.project_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit project_requests" ON public.project_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- projects
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can read projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;

CREATE POLICY "Admins can select projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- task_assignments
DROP POLICY IF EXISTS "Admins can delete task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Admins can insert task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Admins can read task_assignments" ON public.task_assignments;
DROP POLICY IF EXISTS "Admins can update task_assignments" ON public.task_assignments;

CREATE POLICY "Admins can select task_assignments" ON public.task_assignments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert task_assignments" ON public.task_assignments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update task_assignments" ON public.task_assignments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete task_assignments" ON public.task_assignments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
