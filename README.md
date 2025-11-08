# 🎲 CertifyRPG

Sistema de certificação e gestão de campanhas de RPG com IA

## 📋 Visão Geral

**CertifyRPG** é uma plataforma completa para mestres e jogadores de RPG que permite:
- 📜 Gerar certificados personalizados de campanhas com 3 templates
- 📥 Exportar certificados em PDF profissional
- 🤖 Criar NPCs, itens, localizações e histórias com IA (GPT-4)
- 📊 Gerenciar campanhas e organizar conteúdo
- 💳 Sistema de créditos com pagamentos via Stripe
- 🎨 Upload de imagens de perfil e certificados
- 🏆 Sistema de tiers e gamificação

## 🚀 Stack Tecnológica

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript 5.9 + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **IA:** OpenAI GPT-4
- **PDF:** @react-pdf/renderer
- **Pagamentos:** Stripe
- **Deploy:** Vercel
- **Monorepo:** Turborepo + pnpm

## 📁 Estrutura do Projeto

```
certify-rpg/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # API services
│   ├── ai-service/       # Serviço de IA
│   └── pdf-service/      # Geração de PDFs
├── packages/
│   ├── ui/               # Componentes compartilhados
│   ├── database/         # Schema e queries do Supabase
│   ├── core/             # Lógica de negócio
│   ├── types/            # TypeScript types
│   └── config/           # Configurações compartilhadas
└── supabase/             # Migrations e functions
```

## 🛠️ Setup do Ambiente

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- Conta no Supabase
- Conta no Vercel
- API Key da OpenAI

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/pfraquete/certify-rpg.git
cd certify-rpg

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp apps/web/.env.example apps/web/.env.local
# Editar .env.local com suas credenciais

# 4. Inicializar Supabase
cd apps/web
supabase init
supabase start

# 5. Rodar migrações
supabase db push

# 6. Iniciar desenvolvimento
pnpm dev
```

## 📦 Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Iniciar todos os apps
pnpm dev:web          # Iniciar apenas web
pnpm dev:api          # Iniciar apenas API

# Build e Deploy
pnpm build            # Build de produção
pnpm start            # Iniciar produção local
pnpm deploy           # Deploy para Vercel

# Testes
pnpm test             # Rodar testes unitários
pnpm e2e              # Rodar testes E2E
pnpm test:watch       # Testes em modo watch

# Banco de dados
pnpm db:migrate       # Rodar migrações
pnpm db:seed          # Popular banco
pnpm db:reset         # Reset completo

# Utilidades
pnpm lint             # Verificar linting
pnpm format           # Formatar código
pnpm type-check       # Verificar tipos
```

## 🔐 Variáveis de Ambiente

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

## 📚 Documentação

### Guias de Desenvolvimento
- [Getting Started](./GETTING_STARTED.md) - Setup local e primeiros passos
- [Contributing](./CONTRIBUTING.md) - Guia de contribuição
- [Setup Status](./SETUP_STATUS.md) - Status da configuração do projeto

### Guias de Produção
- [Production Checklist](./PRODUCTION_CHECKLIST.md) - ✅ Checklist completo de deploy
- [Deployment Guide](./DEPLOYMENT.md) - 🚀 Guia detalhado de deploy
- [Stripe Setup](./STRIPE_SETUP.md) - 💳 Configuração de pagamentos

## 🎯 Roadmap

### ✅ Fase 1 - Core (Completo)
- [x] Setup inicial do projeto
- [x] Sistema de autenticação (Email/Password + OAuth)
- [x] Dashboard principal
- [x] Banco de dados com RLS
- [x] Migrations do Supabase

### ✅ Fase 2 - Features Principais (Completo)
- [x] Geração de certificados personalizados
- [x] 3 templates de certificados (Classic, Fantasy, Modern)
- [x] Export de certificados em PDF
- [x] Integração com IA (GPT-4)
- [x] 5 tipos de conteúdo IA (NPC, Item, Location, Story, Quest)
- [x] Sistema de créditos e transações
- [x] Tiers de usuário (Bronze, Silver, Gold, Platinum)
- [x] Gerenciamento de campanhas

### ✅ Fase 3 - Monetização (Completo)
- [x] Integração com Stripe
- [x] Checkout de créditos
- [x] Webhook para confirmação de pagamento
- [x] 4 pacotes de créditos

### ✅ Fase 4 - Upload e Storage (Completo)
- [x] Supabase Storage buckets
- [x] Upload de avatar de usuário
- [x] Políticas RLS para storage
- [x] Componente reutilizável de upload

### 🚧 Fase 5 - Melhorias (Próximo)
- [ ] Preview de certificados antes de gerar PDF
- [ ] Editor visual de templates
- [ ] Mais opções de customização (cores, fontes)
- [ ] Sistema de badges e conquistas
- [ ] Compartilhamento em redes sociais
- [ ] Testes unitários e E2E
- [ ] Internacionalização (i18n)

### 🔮 Fase 6 - Escala (Futuro)
- [ ] API pública com chaves
- [ ] Webhooks para integrações
- [ ] Mobile app (React Native)
- [ ] Integração com Discord/Roll20
- [ ] Marketplace de templates
- [ ] Sistema de afiliados

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para mais detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [guia de contribuição](./CONTRIBUTING.md) antes de submeter PRs.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

Feito com ❤️ para a comunidade de RPG
