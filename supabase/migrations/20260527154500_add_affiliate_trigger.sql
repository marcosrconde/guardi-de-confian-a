-- Cria a função que será executada pelo gatilho
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  affiliate_id_to_set uuid;
begin
  -- Garante que um perfil exista. Se o Supabase já criou um (comportamento padrão), não faz nada.
  -- Se não, insere um básico para que o update funcione.
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;

  -- Busca o ID do afiliado usando o código fornecido nos metadados do usuário
  select id into affiliate_id_to_set
  from public.afiliados
  where codigo = new.raw_user_meta_data->>'affiliate_code'
  limit 1;

  -- Se um afiliado foi encontrado, atualiza o perfil do usuário com o ID do afiliado
  if affiliate_id_to_set is not null then
    update public.profiles
    set affiliate_id = affiliate_id_to_set
    where id = new.id;
  end if;

  return new;
end;
$$;

-- Cria o gatilho que executa a função após a criação de um novo usuário
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
