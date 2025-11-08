# 🚀 Getting Started - CertifyRPG

Guia completo para configurar e rodar o CertifyRPG localmente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ ([Instalação](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))
- **Conta no Supabase** ([Criar conta grátis](https://supabase.com))
- **Chave API da OpenAI** ([Obter chave](https://platform.openai.com/api-keys))

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/pfraquete/certify-rpg.git
cd certify-rpg
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o Supabase

#### Opção A: Supabase Local (Desenvolvimento)

```bash
# Iniciar Supabase local
npx supabase start

# Aplicar migrations
npx supabase db push
```

Após executar `npx supabase start`, você verá:
```
API URL: http://127.0.0.1:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

#### Opção B: Supabase Cloud (Produção)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto
3. Aguarde a criação (2-3 minutos)
4. Vá em **Settings** > **API**
5. Copie:
   - Project URL
   - anon/public key
   - service_role key

Aplique as migrations:
```bash
npx supabase link --project-ref seu-project-ref
npx supabase db push
```

### 4. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp apps/web/.env.example apps/web/.env.local
```

Edite `apps/web/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321  # ou URL do projeto cloud
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# OpenAI
OPENAI_API_KEY=sk-...  # Sua chave da OpenAI

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O app estará rodando em:
- **Frontend**: http://localhost:3000
- **Supabase Studio** (local): http://127.0.0.1:54323

## 📦 Estrutura do Projeto

```
certify-rpg/
├── apps/
│   └── web/                    # Next.js App
│       ├── app/                # Pages (App Router)
│       │   ├── dashboard/      # Dashboard pages
│       │   ├── login/          # Login page
│       │   ├── register/       # Register page
│       │   └── api/            # API routes
│       ├── components/         # React components
│       ├── lib/                # Utilities
│       │   ├── auth/           # Auth context & actions
│       │   ├── ai/             # AI integration
│       │   ├── credits/        # Credits system
│       │   ├── hooks/          # Custom hooks
│       │   └── types/          # TypeScript types
│       └── .env.local          # Environment variables
├── supabase/
│   └── migrations/             # Database migrations
└── package.json                # Root package.json
```

## 🧪 Testando o Sistema

### 1. Criar uma conta

1. Acesse http://localhost:3000
2. Clique em "Começar Grátis"
3. Preencha o formulário de registro
4. Faça login

### 2. Verificar créditos iniciais

- Ao criar a conta, você recebe **100 créditos** de boas-vindas
- Verifique em `/dashboard/credits`

### 3. Criar um certificado

1. Vá para `/dashboard/certificates`
2. Clique em "Novo Certificado"
3. Preencha os dados
4. Confirme (custo: 5 créditos)

### 4. Gerar conteúdo com IA

1. Vá para `/dashboard/ai`
2. Selecione um tipo (NPC, Item, etc)
3. Preencha o formulário
4. Clique em "Gerar" (custo varia por tipo)

### 5. Criar uma campanha

1. Vá para `/dashboard/campaigns`
2. Clique em "Nova Campanha"
3. Preencha os dados
4. Salve a campanha

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                 # Inicia o dev server
pnpm build               # Build de produção
pnpm start               # Inicia produção local

# Supabase
npx supabase start       # Inicia Supabase local
npx supabase stop        # Para Supabase local
npx supabase db push     # Aplica migrations
npx supabase db reset    # Reset completo do banco

# Linting
pnpm lint                # Verifica código
pnpm format              # Formata código
```

## 🐛 Troubleshooting

### Erro: "OpenAI API key not configured"

**Solução**: Adicione `OPENAI_API_KEY` no arquivo `.env.local`

### Erro: "Supabase connection failed"

**Soluções**:
1. Verifique se o Supabase está rodando: `npx supabase status`
2. Confirme as credenciais em `.env.local`
3. Tente reiniciar: `npx supabase stop && npx supabase start`

### Erro: "Insufficient credits"

**Solução**:
- Verifique seu saldo em `/dashboard/credits`
- Novos usuários recebem 100 créditos automaticamente
- Verifique se a migration foi aplicada corretamente

### Erro ao instalar dependências

```bash
# Limpe o cache e reinstale
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## 📚 Próximos Passos

Agora que está tudo configurado:

1. **Explore o Dashboard** - Navegue pelas páginas
2. **Teste a IA** - Gere NPCs, itens, histórias
3. **Crie Certificados** - Para suas campanhas
4. **Organize Campanhas** - Agrupe seu conteúdo
5. **Customize** - Adapte às suas necessidades

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para diretrizes de contribuição.

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/pfraquete/certify-rpg/issues)
- **Documentação**: [README.md](./README.md)

---

**Feito com ❤️ para a comunidade de RPG**
