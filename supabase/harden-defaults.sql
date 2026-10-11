-- Supabase's optional auto-RLS event trigger is administrative, never a browser API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
