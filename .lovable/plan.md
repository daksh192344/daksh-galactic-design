

## Problem Analysis

The admin and team dashboards get stuck after ~15-20 seconds because of two compounding issues:

1. **All RLS policies are RESTRICTIVE** -- In PostgreSQL, RESTRICTIVE policies require ALL policies to pass (AND logic). Since there's no base PERMISSIVE policy granting access, RESTRICTIVE policies alone effectively deny everything. This is why queries silently return empty data or fail.

2. **Auth race condition in `useAuth.tsx`** -- The `onAuthStateChange` callback runs an `async` function (`checkAdmin`) that awaits a Supabase query. This blocks the auth lock, causing the "Lock not released within 5000ms" warning seen in console logs. When token refresh fails (as seen in the network logs), the app enters an infinite retry loop, freezing the UI.

3. **No error recovery** -- When `getSession()` or token refresh fails, the `loading` state never resolves, leaving users on an infinite spinner.

## Plan

### 1. Fix all RLS policies (database migration)

Drop all RESTRICTIVE policies and recreate them as PERMISSIVE on every table: `portfolio_items`, `project_requests`, `projects`, `task_assignments`, `team_applications`, `team_members`, `user_roles`.

### 2. Rewrite `useAuth.tsx` to prevent deadlocks

- Remove `async` from the `onAuthStateChange` callback -- use fire-and-forget for `checkAdmin`
- Add error handling around `getSession()` and `checkAdmin()` so that failures set `loading = false` instead of hanging
- Add a timeout fallback: if auth hasn't resolved in 8 seconds, set `loading = false` and clear the broken session
- On failed session restore, show a retry mechanism instead of infinite spinner

### 3. Add error recovery to `TeamDashboard.tsx` and `TeamLogin.tsx`

- Wrap `getSession()` calls in try/catch
- If session restore fails, sign out and redirect to login instead of hanging
- Add retry-in-place UI when data fetch fails

### 4. Add error recovery to `AdminDashboard.tsx`

- Show a retry button if the page gets stuck instead of infinite redirect loops

## Technical Details

**Auth hook rewrite pattern:**
```typescript
// Don't await inside onAuthStateChange
onAuthStateChange((_event, session) => {
  setSession(session);
  if (session?.user) {
    // Fire and forget - don't block the callback
    checkAdmin(session.user.id).then(setIsAdmin).catch(() => setIsAdmin(false));
  } else {
    setIsAdmin(false);
  }
  setLoading(false); // Always resolve loading
});
```

**RLS fix pattern:**
```sql
-- Drop restrictive, recreate as permissive
DROP POLICY "policy_name" ON public.table_name;
CREATE POLICY "policy_name" ON public.table_name
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
-- No RESTRICTIVE keyword = defaults to PERMISSIVE
```

