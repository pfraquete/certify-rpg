# 🚀 Deployment Guide - CertifyRPG

Guia completo para fazer deploy do CertifyRPG em produção.

## 📋 Pré-Deploy Checklist

Antes de fazer deploy, certifique-se de que:

- [ ] Todas as migrations do Supabase foram aplicadas
- [ ] As variáveis de ambiente estão configuradas
- [ ] A chave OpenAI está ativa e com créditos
- [ ] O projeto passa em `pnpm build` sem erros
- [ ] Você testou as funcionalidades principais localmente

## 🌐 Deploy no Vercel

### 1. Conectar ao GitHub

```bash
# Certifique-se de que está na branch correta
git checkout main  # ou sua branch de produção
git merge claude/analyze-and-start-011CUuTDUR2YdiCRiaucGjcR
git push origin main
```

### 2. Criar Projeto no Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New Project"**
3. Importe o repositório `pfraquete/certify-rpg`
4. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build --filter=web`
   - **Install Command**: `pnpm install`

### 3. Configurar Variáveis de Ambiente

No dashboard do Vercel, vá em **Settings** > **Environment Variables** e adicione:

```env
# Supabase (produção)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# App
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

### 4. Deploy

Clique em **"Deploy"** e aguarde o build.

O Vercel irá:
1. Instalar dependências
2. Fazer build do Next.js
3. Deploy automático
4. Gerar URL de produção

---

## 🗄️ Configurar Supabase (Produção)

### 1. Criar Projeto

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: CertifyRPG
   - **Database Password**: (gere uma senha forte)
   - **Region**: Escolha a mais próxima dos usuários
4. Aguarde 2-3 minutos para o projeto ser criado

### 2. Aplicar Migrations

```bash
# Link com o projeto
npx supabase link --project-ref seu-project-ref

# Aplicar todas as migrations
npx supabase db push
```

### 3. Configurar Auth Providers

#### Email/Password (já está configurado)

#### Google OAuth (opcional)

1. Vá em **Authentication** > **Providers** > **Google**
2. Habilite o provider
3. Configure:
   - **Client ID**: Do Google Cloud Console
   - **Client Secret**: Do Google Cloud Console
   - **Redirect URL**: `https://seu-projeto.supabase.co/auth/v1/callback`

4. Configure no Google Cloud Console:
   - Crie um projeto
   - Ative a API do Google+
   - Crie credenciais OAuth 2.0
   - Adicione redirect URI autorizada

### 4. Configurar RLS Policies

Verifique se todas as RLS policies estão ativas:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Todas as tabelas devem ter `rowsecurity = true`.

---

## 🔧 Build de Produção Local

Teste o build de produção antes de fazer deploy:

```bash
# Build
pnpm build

# Testar produção localmente
pnpm start
```

Acesse: http://localhost:3000

---

## 📊 Monitoramento

### Vercel Analytics

1. No dashboard do Vercel, vá em **Analytics**
2. Ative o Vercel Analytics (gratuito até 100k eventos/mês)
3. Monitore:
   - Page views
   - Performance
   - Erros
   - Top pages

### Supabase Monitoring

1. No dashboard do Supabase, vá em **Reports**
2. Monitore:
   - Database usage
   - API requests
   - Storage
   - Auth users

---

## 🔐 Segurança em Produção

### Checklist de Segurança

- [ ] **RLS** habilitado em todas as tabelas
- [ ] **HTTPS** forçado (Vercel faz automaticamente)
- [ ] **Environment variables** nunca commitadas
- [ ] **API keys** rotacionadas regularmente
- [ ] **CORS** configurado corretamente
- [ ] **Rate limiting** no Supabase (configure se necessário)

### Configurar Rate Limiting

No Supabase, vá em **Settings** > **API**:

```
Rate Limits:
- Anonymous: 100 requests/minute
- Authenticated: 500 requests/minute
```

---

## 📈 Escalabilidade

### Database Indexes

Verifique se os indexes estão criados (já estão nas migrations):

```sql
-- Indexes importantes
\d+ certificates
\d+ ai_generations
\d+ campaigns
```

### Caching

Considere adicionar:
- **Next.js ISR** (Incremental Static Regeneration)
- **Redis** para cache de queries frequentes
- **CDN** para assets estáticos (Vercel já faz isso)

---

## 🚨 Troubleshooting Produção

### Build Failed

**Erro comum**: `Module not found`

```bash
# Limpe e reinstale
rm -rf node_modules .next
pnpm install
pnpm build
```

### Supabase Connection Error

Verifique:
1. URL e keys corretas
2. Projeto do Supabase está ativo
3. Migrations foram aplicadas
4. RLS policies estão corretas

### OpenAI API Error

Verifique:
1. API key é válida
2. Tem créditos disponíveis
3. Não está bloqueada por região
4. Rate limits não foram excedidos

---

## 📝 Pós-Deploy

### 1. Teste Completo

Teste todas as funcionalidades:
- [ ] Registro de usuário
- [ ] Login
- [ ] Criar campanha
- [ ] Criar certificado
- [ ] Gerar conteúdo com IA
- [ ] Ver créditos
- [ ] Atualizar perfil

### 2. Configurar Domínio Customizado (Opcional)

No Vercel:
1. Vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Configure DNS:
   ```
   CNAME: www -> cname.vercel-dns.com
   A: @ -> 76.76.21.21
   ```

### 3. Configurar Email (Supabase)

1. No Supabase, vá em **Authentication** > **Email Templates**
2. Customize os templates de:
   - Confirmação de email
   - Recuperação de senha
   - Magic link

---

## 💰 Custos Estimados

### Tier Gratuito

- **Vercel**: 100GB bandwidth/mês
- **Supabase**: 500MB database, 1GB storage, 2GB bandwidth
- **OpenAI**: Pay-as-you-go (~$0.03/1K tokens GPT-4)

### Tier Pago (Small App)

- **Vercel Pro**: $20/mês
- **Supabase Pro**: $25/mês
- **OpenAI**: ~$50-100/mês (dependendo do uso)

**Total estimado**: $95-145/mês para ~1000 usuários ativos

---

## 🔄 CI/CD

### GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
```

---

## 📞 Suporte

- **Vercel**: [Documentação](https://vercel.com/docs)
- **Supabase**: [Documentação](https://supabase.com/docs)
- **Next.js**: [Documentação](https://nextjs.org/docs)
- **OpenAI**: [Documentação](https://platform.openai.com/docs)

---

**Boa sorte com o deploy!** 🚀
