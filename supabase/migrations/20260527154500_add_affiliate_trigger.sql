-- Cria a função que será executada pelo gatilho
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  affiliate_id_to_set uuid;
begin
  -- Busca o ID do afiliado usando o código fornecido nos metadados do usuário
  select id into affiliate_id_to_set
  from public.afiliados
  where codigo = new.raw_user_meta_data->>'affiliate_code'
  limit 1;

  -- Insere um novo perfil para o usuário, incluindo o ID do afiliado se encontrado
  insert into public.profiles (id, full_name, affiliate_id)
  values (new.id, new.raw_user_meta_data->>'full_name', affiliate_id_to_set);

  return new;
end;
$$;

-- Cria o gatilho que executa a função após a criação de um novo usuário
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
