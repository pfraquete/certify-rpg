# 🤝 Guia de Contribuição - CertifyRPG

Obrigado por considerar contribuir com o CertifyRPG! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Como Contribuir

### 1. Faça Fork do Repositório

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/certify-rpg.git
cd certify-rpg

# Adicione o upstream
git remote add upstream https://github.com/pfraquete/certify-rpg.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/nome-da-feature

# Ou para bugfix
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações

- Siga os padrões de código do projeto
- Escreva código limpo e comentado
- Adicione testes se aplicável
- Atualize a documentação

### 4. Commit suas Mudanças

Usamos **Conventional Commits**:

```bash
# Features
git commit -m "feat: adiciona gerador de mapas"

# Bugfixes
git commit -m "fix: corrige erro no login"

# Documentação
git commit -m "docs: atualiza README com exemplos"

# Refatoração
git commit -m "refactor: reorganiza estrutura de pastas"

# Performance
git commit -m "perf: otimiza queries do Supabase"

# Testes
git commit -m "test: adiciona testes para auth"
```

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/nome-da-feature

# Crie um Pull Request no GitHub
```

## 🎯 Tipos de Contribuição

### 🐛 Reportar Bugs

Ao reportar um bug, inclua:

- **Descrição clara** do problema
- **Passos para reproduzir**
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** se aplicável
- **Ambiente** (OS, navegador, versão do Node)

**Template:**

```markdown
**Descrição**
O que aconteceu?

**Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Esperado**
O que deveria acontecer

**Screenshots**
Se aplicável

**Ambiente**
- OS: [e.g. macOS 13]
- Browser: [e.g. Chrome 120]
- Node: [e.g. 18.17.0]
```

### ✨ Sugerir Features

Ao sugerir uma feature:

- **Descreva o problema** que ela resolve
- **Explique a solução** proposta
- **Alternativas consideradas**
- **Impacto** nos usuários

### 💻 Contribuir com Código

**Áreas que precisam de ajuda:**

- [ ] Geração de PDF para certificados
- [ ] Templates customizáveis
- [ ] Sistema de notificações
- [ ] Testes unitários e E2E
- [ ] Melhorias de performance
- [ ] Acessibilidade (a11y)
- [ ] Internacionalização (i18n)

## 🔧 Setup de Desenvolvimento

### Pré-requisitos

```bash
# Node.js 18+
node --version

# pnpm 8+
pnpm --version

# Supabase CLI
npx supabase --version
```

### Instalação

```bash
# 1. Clone e instale
git clone https://github.com/seu-usuario/certify-rpg.git
cd certify-rpg
pnpm install

# 2. Configure .env.local
cp apps/web/.env.example apps/web/.env.local
# Edite com suas keys

# 3. Inicie Supabase
npx supabase start

# 4. Aplique migrations
npx supabase db push

# 5. Rode o projeto
pnpm dev
```

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ BOM
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // ...
}

// ❌ RUIM
function getUser(id: any) {
  // ...
}
```

### React Components

```typescript
// ✅ BOM - Functional component com tipos
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ RUIM - Sem tipos
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Naming Conventions

```typescript
// Components: PascalCase
export function UserProfile() {}

// Functions: camelCase
function calculateCredits() {}

// Constants: UPPER_SNAKE_CASE
const MAX_CREDITS = 1000;

// Files:
// - Components: PascalCase (UserProfile.tsx)
// - Utils: kebab-case (format-date.ts)
// - Hooks: camelCase (useAuth.ts)
```

### Importações

```typescript
// Ordem de imports
import { useState } from "react";          // 1. React
import { useRouter } from "next/navigation"; // 2. Next.js
import { toast } from "sonner";            // 3. External libs
import { Button } from "@/components/ui";  // 4. Internal components
import { useAuth } from "@/lib/auth";      // 5. Internal libs
import type { User } from "@/lib/types";   // 6. Types
```

## 🧪 Testes

### Estrutura de Testes (quando implementado)

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with label", () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## 📚 Documentação

### Comentários no Código

```typescript
/**
 * Calcula o custo em créditos para gerar conteúdo com IA
 * @param type - Tipo de conteúdo (npc, item, location, etc)
 * @param complexity - Complexidade (simple, medium, complex)
 * @returns Custo em créditos
 */
function calculateAICost(
  type: AIGenerationType,
  complexity: "simple" | "medium" | "complex"
): number {
  // Implementation
}
```

### README e Docs

- Atualize README.md se adicionar features
- Adicione exemplos de uso
- Mantenha GETTING_STARTED.md atualizado
- Documente breaking changes

## 🚀 Pull Request Process

### Checklist antes de submeter PR

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (quando implementados)
- [ ] `pnpm build` executa sem erros
- [ ] `pnpm lint` não retorna erros
- [ ] Documentação atualizada
- [ ] Commit messages seguem Conventional Commits
- [ ] Branch está atualizada com main

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como testar
1. Faça checkout da branch
2. Execute `pnpm dev`
3. Vá para `/dashboard/...`
4. Teste X, Y, Z

## Screenshots
Se aplicável

## Checklist
- [ ] Testes passam
- [ ] Build funciona
- [ ] Documentação atualizada
- [ ] Reviewed próprio código
```

## 🎨 Design Guidelines

### UI/UX

- Use componentes do `/components/ui`
- Siga o design system (cores, espaçamentos)
- Garanta responsividade (mobile-first)
- Teste dark mode
- Adicione loading states
- Adicione empty states
- Use toast notifications para feedback

### Acessibilidade

- Use tags semânticas HTML
- Adicione aria-labels
- Garanta contraste de cores
- Teste navegação por teclado
- Teste com screen readers

## 📊 Performance

### Boas Práticas

- Use `React.memo` para componentes pesados
- Implemente lazy loading
- Otimize imagens (Next.js Image)
- Minimize re-renders
- Use Supabase indexes
- Cache queries quando possível

## 🔒 Segurança

### Checklist de Segurança

- [ ] Nunca commite `.env` ou secrets
- [ ] Valide inputs do usuário
- [ ] Use prepared statements (Supabase faz isso)
- [ ] Sanitize HTML/markdown
- [ ] Implemente rate limiting
- [ ] Use HTTPS em produção
- [ ] Valide permissions (RLS)

## 📞 Dúvidas?

- Abra uma **Discussion** no GitHub
- Entre em contato via **Issues**
- Leia a **documentação** existente

## 🙏 Reconhecimento

Todos os contribuidores serão adicionados ao README.md!

---

**Obrigado por contribuir!** 🎉
