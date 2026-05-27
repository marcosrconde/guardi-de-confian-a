-- Function to handle new user signup and create a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  affiliate_id_to_set int;
  affiliate_code_to_check text;
begin
  -- Extract affiliate_code from metadata
  affiliate_code_to_check := new.raw_user_meta_data->>'affiliate_code';

  -- Find affiliate_id based on the code
  if affiliate_code_to_check is not null then
    select id into affiliate_id_to_set
    from public.afiliados
    where codigo = affiliate_code_to_check;
  end if;

  -- Insert into public.profiles
  insert into public.profiles (id, full_name, affiliate_id)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    affiliate_id_to_set
  );
  return new;
end;
$$;

-- Trigger to call the function after a new user is created.
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
