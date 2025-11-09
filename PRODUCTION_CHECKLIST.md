# ✅ Checklist de Produção - CertifyRPG

Guia rápido para colocar o CertifyRPG em produção.

## 📦 1. Supabase (Banco de Dados)

### Criar Projeto

- [ ] Acessar [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Criar novo projeto "CertifyRPG"
- [ ] Escolher região (Brasil: São Paulo ou mais próxima)
- [ ] Definir senha forte do banco
- [ ] Aguardar criação (2-3 min)

### Aplicar Migrations

```bash
# Link com o projeto
npx supabase link --project-ref seu-project-ref

# Aplicar todas as migrations (2 migrations)
npx supabase db push
```

### Copiar Credenciais

No Supabase Dashboard > Settings > API:

- [ ] Copiar **Project URL**: `https://xxx.supabase.co`
- [ ] Copiar **anon/public key**: `eyJhbGciOi...`
- [ ] Copiar **service_role key**: `eyJhbGciOi...`

### Verificar Setup

- [ ] Ir em **Database** > **Tables** - deve ter 6 tabelas
- [ ] Ir em **Storage** - deve ter 2 buckets (avatars, certificates)
- [ ] Ir em **Authentication** > **Policies** - todas as tabelas com RLS

## 🤖 2. OpenAI (IA)

- [ ] Acessar [OpenAI Platform](https://platform.openai.com/api-keys)
- [ ] Criar API Key
- [ ] Copiar chave: `sk-proj-...`
- [ ] Adicionar créditos à conta OpenAI (mínimo $5)

## 💳 3. Stripe (Pagamentos)

Siga o guia completo: [STRIPE_SETUP.md](./STRIPE_SETUP.md)

### Criar Produtos

- [ ] Acessar [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Mudar para modo **Test**
- [ ] Criar 4 produtos (Starter, Basic, Pro, Ultimate)
- [ ] Copiar os 4 Price IDs: `price_...`

### Configurar Webhook

- [ ] Ir em Developers > Webhooks
- [ ] Adicionar endpoint: `https://seu-dominio.vercel.app/api/stripe/webhook`
- [ ] Selecionar eventos: `checkout.session.completed`, `payment_intent.payment_failed`
- [ ] Copiar Webhook Secret: `whsec_...`

### Copiar Chaves

- [ ] Copiar Secret Key (test): `sk_test_...`
- [ ] Copiar Secret Key (live): `sk_live_...`

## 🚀 4. Vercel (Deploy)

### Criar Projeto

- [ ] Acessar [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Import Git Repository: `pfraquete/certify-rpg`
- [ ] Configurar:
  - Root Directory: `apps/web`
  - Build Command: `cd ../.. && pnpm build --filter=web`
  - Install Command: `pnpm install`

### Adicionar Variáveis de Ambiente

Settings > Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Stripe (Test para Preview, Live para Production)
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ULTIMATE=price_...

# App
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

Marque para quais ambientes:
- [x] Production
- [x] Preview
- [x] Development

### Deploy

- [ ] Clicar em **Deploy**
- [ ] Aguardar build (3-5 min)
- [ ] Verificar se deploy foi bem-sucedido

## 🧪 5. Testes Pós-Deploy

### Funcionalidades Básicas

- [ ] Acessar URL do Vercel
- [ ] Registrar novo usuário
- [ ] Fazer login
- [ ] Verificar dashboard (deve mostrar 0 certificados, 100 créditos)

### Upload de Imagens

- [ ] Ir em Configurações
- [ ] Fazer upload de foto de perfil
- [ ] Verificar se imagem aparece

### Certificados

- [ ] Criar novo certificado
- [ ] Verificar se 5 créditos foram debitados
- [ ] Baixar PDF do certificado
- [ ] Verificar se PDF está correto
- [ ] Testar os 3 templates (Classic, Fantasy, Modern)

### IA

- [ ] Ir em IA
- [ ] Gerar um NPC (10 créditos)
- [ ] Verificar se conteúdo foi gerado
- [ ] Verificar se créditos foram debitados
- [ ] Ir em Histórico de IA
- [ ] Verificar se geração aparece

### Pagamentos (Modo Test)

- [ ] Ir em Créditos
- [ ] Clicar em "Comprar" em qualquer pacote
- [ ] Usar cartão de teste: `4242 4242 4242 4242`
- [ ] Completar checkout
- [ ] Verificar se foi redirecionado de volta
- [ ] Verificar se créditos foram adicionados
- [ ] No Stripe Dashboard > Payments, verificar se pagamento aparece
- [ ] No Stripe Dashboard > Webhooks > seu endpoint, verificar evento

## 🔄 6. Migrar para Modo Live (Produção Real)

Quando estiver pronto para aceitar pagamentos reais:

### Stripe

- [ ] No Stripe Dashboard, mudar para **Live mode**
- [ ] Ativar conta (fornecer informações da empresa)
- [ ] Criar os mesmos 4 produtos no modo Live
- [ ] Copiar novos Price IDs (live)
- [ ] Criar novo webhook endpoint (live)
- [ ] Copiar Secret Key (live): `sk_live_...`
- [ ] Copiar Webhook Secret (live): `whsec_...`

### Vercel

- [ ] Atualizar variáveis de ambiente de **Production** com chaves Live
- [ ] Fazer redeploy

### Testar

- [ ] Fazer teste com cartão real (valor pequeno)
- [ ] Verificar se créditos foram adicionados
- [ ] Fazer refund do teste no Stripe Dashboard

## 📊 7. Monitoramento

### Vercel

- [ ] Ativar Vercel Analytics
- [ ] Configurar alertas de erro
- [ ] Monitorar logs: `vercel logs`

### Supabase

- [ ] Ir em Reports
- [ ] Monitorar:
  - Database usage
  - API requests
  - Storage usage
  - Auth users

### Stripe

- [ ] Configurar notificações de email
- [ ] Monitorar:
  - Payments
  - Failed payments
  - Webhooks events

## 🔒 8. Segurança

- [ ] Verificar que todas as chaves secretas estão no Vercel (não no código)
- [ ] Confirmar que RLS está habilitado em todas as tabelas
- [ ] Testar que usuários só veem seus próprios dados
- [ ] Verificar que webhook do Stripe valida assinatura
- [ ] Configurar rate limiting no Supabase (Settings > API)

## 🎯 9. Performance

- [ ] Verificar Core Web Vitals no Vercel Analytics
- [ ] Otimizar imagens se necessário
- [ ] Configurar cache headers
- [ ] Monitorar tempo de resposta das APIs

## 📞 10. Suporte

### Documentação

- [ ] Atualizar README com URL de produção
- [ ] Criar guia de uso para usuários
- [ ] Documentar processos de troubleshooting

### Links Úteis

- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs
- Stripe Docs: https://stripe.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

## ✨ Pronto!

Seu CertifyRPG está em produção! 🎉

**Próximos passos:**
1. Compartilhar URL com beta testers
2. Coletar feedback
3. Iterar e melhorar
4. Adicionar mais funcionalidades
5. Crescer a base de usuários

---

**Custos Estimados Mensais:**

| Serviço | Tier Gratuito | Tier Pago |
|---------|---------------|-----------|
| Vercel | 100GB bandwidth | $20/mês (Pro) |
| Supabase | 500MB DB, 1GB storage | $25/mês (Pro) |
| OpenAI | Pay-as-you-go | ~$50-100/mês |
| Stripe | Sem custo fixo | 2.9% + $0.30 por transação |

**Total estimado:** $0-20/mês (gratuito) ou $95-145/mês (pago) para ~1000 usuários ativos
