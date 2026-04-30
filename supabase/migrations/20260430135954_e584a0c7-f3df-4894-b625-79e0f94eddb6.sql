
alter table public.queries replica identity full;
alter table public.credit_transactions replica identity full;
alter publication supabase_realtime add table public.queries;
alter publication supabase_realtime add table public.credit_transactions;
