
-- profiles
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuária vê apenas seu próprio perfil"
  on public.profiles for select using (auth.uid() = id);
create policy "Usuária atualiza apenas seu próprio perfil"
  on public.profiles for update using (auth.uid() = id);
create policy "Usuária insere apenas seu próprio perfil"
  on public.profiles for insert with check (auth.uid() = id);

-- credit_packages
create table public.credit_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  credits integer not null,
  price_brl numeric(10,2) not null,
  checkout_url text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

alter table public.credit_packages enable row level security;

create policy "Usuárias autenticadas podem ver pacotes ativos"
  on public.credit_packages for select
  to authenticated
  using (is_active = true);

-- credit_transactions
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  email text not null,
  type text not null check (type in ('purchase', 'bonus', 'adjustment')),
  amount integer not null,
  description text,
  created_at timestamp with time zone not null default now()
);

alter table public.credit_transactions enable row level security;

create policy "Usuária vê apenas suas transações"
  on public.credit_transactions for select using (auth.uid() = user_id);

-- queries
create table public.queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  email text not null,
  query_type text not null check (query_type in ('cpf', 'form')),
  input_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'error')),
  output_data jsonb,
  risk_level text check (risk_level in ('low', 'medium', 'high', 'unknown')),
  created_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone
);

alter table public.queries enable row level security;

create policy "Usuária vê apenas suas consultas"
  on public.queries for select using (auth.uid() = user_id);
create policy "Usuária cria apenas suas consultas"
  on public.queries for insert with check (auth.uid() = user_id);

-- Function: handle new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function: updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Seed credit packages
insert into public.credit_packages (name, description, credits, price_brl, checkout_url) values
  ('Essencial', '5 consultas para começar com tranquilidade', 5, 49.90, 'https://checkout.example.com/jusmulher-essencial'),
  ('Cuidado', '10 consultas — o mais escolhido', 10, 89.90, 'https://checkout.example.com/jusmulher-cuidado'),
  ('Proteção', '20 consultas com o melhor custo por consulta', 20, 159.90, 'https://checkout.example.com/jusmulher-protecao');
