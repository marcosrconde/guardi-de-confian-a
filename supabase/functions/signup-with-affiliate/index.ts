import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Define os cabeçalhos CORS diretamente para remover a dependência de arquivos compartilhados.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Lida com a requisição preflight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, fullName, affiliateCode } = await req.json()

    // Cria um cliente Supabase com a Service Role Key para ter privilégios de administrador
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Cria o novo usuário no sistema de autenticação
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Mantém a confirmação de e-mail
      user_metadata: { full_name: fullName }
    })

    if (userError) {
      throw userError
    }
    const newUser = userData.user;

    // 2. Busca pelo afiliado usando o código
    let affiliateId = null;
    if (affiliateCode) {
      const { data: affiliate, error: affiliateError } = await supabaseAdmin
        .from('afiliados')
        .select('id')
        .eq('codigo', affiliateCode)
        .single();

      if (affiliateError) {
        // Não trata como erro fatal, apenas loga. O cadastro do usuário é mais importante.
        console.error('Affiliate lookup error:', affiliateError.message);
      } else if (affiliate) {
        affiliateId = affiliate.id;
      }
    }

    // 3. Insere na tabela 'profiles' usando a chave de serviço (bypass RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.id,
        full_name: fullName,
        affiliate_id: affiliateId
      });

    if (profileError) {
      // Este é um erro mais sério, pois o perfil não foi criado
      console.error('Profile creation error:', profileError.message)
      // Opcional: deletar o usuário criado se a criação do perfil for crítica
      // await supabaseAdmin.auth.admin.deleteUser(newUser.id)
      throw profileError
    }

    return new Response(JSON.stringify({ user: newUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
