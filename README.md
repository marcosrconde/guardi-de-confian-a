# JusMulher – Notas de Desenvolvimento

## Feature flag: Presente (R$5 na primeira consulta)

Durante o período promocional (preço diferenciado para todos), o "presente" (oferta de R$5 para quem ainda não fez consulta e cadastrou um contato na Rede de Confiança) pode ser desativado globalmente via variável de ambiente.

Flag:

```
VITE_ENABLE_GIFT="false"
```

Comportamento quando `VITE_ENABLE_GIFT` é "false":
- O hook `use-gift-eligibility` retorna `isEligible = false`, desabilitando o banner `GiftAlert` em:
  - `pages/app/NovaConsulta.tsx`
  - `pages/app/Creditos.tsx`
  - `pages/app/RedeDeConfianca.tsx`
- A página `RedeDeConfianca` não renderiza nem abre o `GiftModal` após o cadastro do primeiro contato.

Como desativar/ativar:
1. Defina no `.env` do ambiente apropriado:
   - Para desativar: `VITE_ENABLE_GIFT="false"`
   - Para ativar novamente: `VITE_ENABLE_GIFT="true"` (ou remova a linha)
2. Rebuild/Restart do front-end é necessário para aplicar a mudança de env.

Arquivos relacionados:
- `src/hooks/use-gift-eligibility.ts` (verificação central do flag)
- `src/pages/app/RedeDeConfianca.tsx` (condição para abrir e renderizar o GiftModal)
- `src/vite-env.d.ts` (tipagem da env `VITE_ENABLE_GIFT`)

Observação
- O comportamento padrão (sem a env ou com qualquer valor diferente de "false") é considerar o presente habilitado.


