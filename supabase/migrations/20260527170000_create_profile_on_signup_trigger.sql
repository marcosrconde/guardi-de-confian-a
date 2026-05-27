-- Function to handle new user signup and create a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  affiliate_id_to_set uuid;
  affiliate_code_to_check text;
  user_full_name text;
begin
  -- Extract data from metadata
  affiliate_code_to_check := new.raw_user_meta_data->>'affiliate_code';
  user_full_name := new.raw_user_meta_data->>'full_name';

  -- Default value for full_name if it is null
  if user_full_name is null or user_full_name = '' then
    user_full_name := 'Nome não informado';
  end if;

  -- Find affiliate_id based on the code
  if affiliate_code_to_check is not null and affiliate_code_to_check <> '' then
    select id into affiliate_id_to_set
    from public.afiliados
    where codigo = affiliate_code_to_check
    limit 1;
  end if;

  -- Insert into public.profiles
  begin
    insert into public.profiles (id, full_name, email, afiliado_id)
    values (
      new.id,
      user_full_name,
      new.email,
      affiliate_id_to_set
    );
  end;

  return new;
end;
$$;

-- Trigger to call the function after a new user is created.
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
