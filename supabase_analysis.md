# Análise de Integração Supabase - CertifyRPG

## Estrutura do Projeto

O projeto **CertifyRPG** é um sistema de certificação e gestão de campanhas de RPG com IA, estruturado como um monorepo usando Turborepo e pnpm.

### Stack Tecnológica Identificada

- **Frontend:** Next.js 16.0.0 (App Router) + React 19 + TypeScript 5.9.2 + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **IA:** OpenAI GPT-4 + DALL-E 3
- **Deploy:** Vercel
- **Monorepo:** Turborepo 2.6.0 + pnpm 9.0.0

## Configurações do Supabase Encontradas

### 1. Dependências Instaladas

No arquivo `apps/web/package.json`:
- `@supabase/supabase-js`: ^2.80.0
- `@supabase/ssr`: ^0.7.0

No arquivo raiz `package.json`:
- `supabase` (CLI): ^2.54.11

### 2. Clientes Supabase Configurados

#### Cliente Browser (`apps/web/lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### Cliente Server (`apps/web/lib/supabase/server.ts`)
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 3. Configuração Local (`supabase/config.toml`)

Principais configurações:
- **Project ID:** certify-rpg
- **API Port:** 54321
- **Database Port:** 54322
- **Studio Port:** 54323
- **Database Version:** PostgreSQL 17
- **Auth:** Habilitado com site_url em http://127.0.0.1:3000
- **Storage:** Habilitado com limite de 50MiB
- **Realtime:** Habilitado
- **Edge Runtime:** Habilitado (Deno 2)

### 4. Schema do Banco de Dados

Arquivo de migração: `supabase/migrations/20250101000000_initial_schema.sql`

#### Extensões Habilitadas
- `uuid-ossp` - Geração de UUIDs
- `vector` - Suporte a vetores (para IA)
- `pg_cron` - Agendamento de tarefas

#### Tabela `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  credits INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  role TEXT DEFAULT 'user',
  referral_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 0, 9),
  referred_by UUID REFERENCES profiles(id),
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Row Level Security (RLS)
- Política de visualização: usuários podem ver apenas seu próprio perfil
- Política de atualização: usuários podem atualizar apenas seu próprio perfil

#### Trigger Automático
Função `handle_new_user()` que cria automaticamente um perfil quando um novo usuário é criado no sistema de autenticação.

## Variáveis de Ambiente Necessárias

Conforme documentado no README:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Vercel (opcional para desenvolvimento)
VERCEL_URL=
```

## Status Atual do Projeto

Conforme `SETUP_STATUS.md`:

### ✅ Concluído
- Estrutura do monorepo
- Configuração do Turborepo
- Dependências do Supabase instaladas
- Clientes Supabase criados (browser e server)
- Migração inicial criada
- Supabase CLI instalado

### ⏳ Pendente
- Criar projeto no Supabase Dashboard
- Obter credenciais (URL, ANON_KEY, SERVICE_ROLE_KEY)
- Configurar arquivo `.env.local`
- Executar migrações no banco remoto
- Testar conexão com Supabase
- Implementar sistema de autenticação
- Criar páginas de login/registro
- Implementar dashboard

## Próximos Passos Recomendados

1. **Criar/Conectar Projeto Supabase:**
   - Listar projetos existentes ou criar novo projeto
   - Obter credenciais do projeto
   - Configurar variáveis de ambiente

2. **Aplicar Migrações:**
   - Executar migração inicial no banco de dados
   - Verificar criação da tabela `profiles`
   - Validar políticas RLS

3. **Configurar Autenticação:**
   - Implementar páginas de login/registro
   - Configurar middleware de proteção de rotas
   - Testar fluxo de autenticação

4. **Deploy:**
   - Conectar ao Vercel
   - Configurar variáveis de ambiente no Vercel
   - Realizar primeiro deploy
