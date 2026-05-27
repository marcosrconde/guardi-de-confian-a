-- Exclui completamente qualquer gatilho e função antigos para evitar conflitos.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP FUNCTION IF EXISTS public.handle_new_user_and_affiliate;

-- Cria a função correta e única que será executada no cadastro de um novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user_and_affiliate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  affiliate_id_to_set UUID;
BEGIN
  -- 1. Busca o ID do afiliado usando o código de referência dos metadados do usuário.
  --    A busca é feita ANTES da inserção no perfil.
  SELECT id INTO affiliate_id_to_set
  FROM public.afiliados
  WHERE codigo = NEW.raw_user_meta_data->>'affiliate_code'
  LIMIT 1;

  -- 2. Insere a nova linha na tabela 'profiles', criando o perfil do usuário.
  --    Este comando insere o ID do usuário (vindo de auth.users), o nome completo,
  --    e o ID do afiliado que acabamos de encontrar.
  --    Se nenhum afiliado foi encontrado, o campo affiliate_id ficará nulo.
  INSERT INTO public.profiles (id, full_name, affiliate_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', affiliate_id_to_set);

  RETURN NEW;
END;
$$;

-- Cria o gatilho que executa a função acima DEPOIS que um novo usuário é inserido em auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_and_affiliate();
