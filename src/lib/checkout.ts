import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/store/app-store";

export async function getCheckoutUrl(pacote: any, user: Profile | null) {
  let checkoutUrl = pacote.checkout_url;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("afiliado_id")
      .eq("id", user.id)
      .single();

    if (profile && profile.afiliado_id) {
      const { data: affiliate } = await supabase
        .from("afiliados")
        .select("link_pagamento")
        .eq("id", profile.afiliado_id)
        .single();

      if (affiliate && affiliate.link_pagamento) {
        const links = affiliate.link_pagamento as any;
        let linkKey: "avulso" | "pacote_5" | "pacote_10" | null = null;
        if (pacote.credits === 1) linkKey = "avulso";
        if (pacote.credits === 5) linkKey = "pacote_5";
        if (pacote.credits === 10) linkKey = "pacote_10";
        
        if (linkKey && links[linkKey]) {
          checkoutUrl = links[linkKey];
        }
      }
    }
    return checkoutUrl;
  }

  return checkoutUrl;
}
