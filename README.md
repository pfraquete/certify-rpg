# 🎲 CertifyRPG

Sistema de certificação e gestão de campanhas de RPG com IA

## 📋 Visão Geral

**CertifyRPG** é uma plataforma completa para mestres e jogadores de RPG que permite:
- 📜 Gerar certificados personalizados de campanhas
- 🤖 Criar NPCs, itens e histórias com IA
- 📊 Gerenciar projetos e campanhas
- 💳 Sistema de créditos e gamificação

## 🚀 Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **IA:** OpenAI GPT-4 + DALL-E 3
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

- [Arquitetura](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Guia de Contribuição](./CONTRIBUTING.md)

## 🎯 Roadmap

- [x] Setup inicial do projeto
- [ ] Sistema de autenticação
- [ ] Dashboard principal
- [ ] Geração de certificados
- [ ] Integração com IA
- [ ] Sistema de créditos
- [ ] Deploy em produção

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para mais detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [guia de contribuição](./CONTRIBUTING.md) antes de submeter PRs.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

Feito com ❤️ para a comunidade de RPG
