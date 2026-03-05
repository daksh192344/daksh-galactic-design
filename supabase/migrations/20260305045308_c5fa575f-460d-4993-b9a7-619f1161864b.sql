
-- Add user_id to team_members to link with auth users
ALTER TABLE public.team_members ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX team_members_user_id_idx ON public.team_members(user_id) WHERE user_id IS NOT NULL;

-- Allow team members to read their own record
CREATE POLICY "Members can read own record" ON public.team_members FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Allow team members to read their own task assignments
CREATE POLICY "Members can read own assignments" ON public.task_assignments FOR SELECT TO authenticated
USING (team_member_id IN (SELECT id FROM public.team_members WHERE user_id = auth.uid()));

-- Allow team members to update their own task assignment status
CREATE POLICY "Members can update own assignment status" ON public.task_assignments FOR UPDATE TO authenticated
USING (team_member_id IN (SELECT id FROM public.team_members WHERE user_id = auth.uid()));

-- Allow team members to read projects they're assigned to
CREATE POLICY "Members can read assigned projects" ON public.projects FOR SELECT TO authenticated
USING (id IN (SELECT project_id FROM public.task_assignments WHERE team_member_id IN (SELECT id FROM public.team_members WHERE user_id = auth.uid())));
