-- Remove o gatilho e a função de afiliado para adotar uma abordagem client-side
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
