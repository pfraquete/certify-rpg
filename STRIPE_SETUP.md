# 💳 Configuração do Stripe - CertifyRPG

Guia completo para configurar pagamentos com Stripe no CertifyRPG.

## 📋 Pré-requisitos

- Conta no [Stripe](https://stripe.com)
- Acesso ao [Stripe Dashboard](https://dashboard.stripe.com)
- Stripe CLI instalado (opcional, para testes locais)

## 🏗️ Parte 1: Criar Produtos no Stripe Dashboard

### 1. Acessar o Dashboard

1. Faça login em [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Certifique-se de estar no modo **Test** (canto superior direito)

### 2. Criar Produtos e Preços

Navegue para **Products** > **Add Product** e crie os seguintes produtos:

#### Produto 1: Pacote Iniciante

```
Nome: Pacote Iniciante - 50 Créditos
Descrição: 50 créditos para usar no CertifyRPG
Preço: R$ 9,99 BRL
Tipo: One-time
Nome do Price: starter_pack
```

Após criar, copie o **Price ID** (começa com `price_...`)

#### Produto 2: Pacote Básico

```
Nome: Pacote Básico - 100 Créditos
Descrição: 100 créditos para usar no CertifyRPG
Preço: R$ 17,99 BRL
Tipo: One-time
Nome do Price: basic_pack
```

Copie o **Price ID**

#### Produto 3: Pacote Pro

```
Nome: Pacote Pro - 250 Créditos
Descrição: 250 créditos para usar no CertifyRPG
Preço: R$ 39,99 BRL
Tipo: One-time
Nome do Price: pro_pack
```

Copie o **Price ID**

#### Produto 4: Pacote Ultimate

```
Nome: Pacote Ultimate - 500 Créditos
Descrição: 500 créditos para usar no CertifyRPG
Preço: R$ 69,99 BRL
Tipo: One-time
Nome do Price: ultimate_pack
```

Copie o **Price ID**

### 3. Anotar Price IDs

Você deve ter 4 Price IDs que se parecem com:

```
STRIPE_PRICE_STARTER=price_1A2B3C4D5E6F7G8H9I0J
STRIPE_PRICE_BASIC=price_9I8H7G6F5E4D3C2B1A0J
STRIPE_PRICE_PRO=price_1J2K3L4M5N6O7P8Q9R0S
STRIPE_PRICE_ULTIMATE=price_0S9R8Q7P6O5N4M3L2K1J
```

## 🔐 Parte 2: Obter Chaves API

### 1. Chave Secreta (Secret Key)

1. Vá para **Developers** > **API keys**
2. Em **Test mode**, copie a **Secret key** (começa com `sk_test_...`)
3. Para produção, mude para **Live mode** e copie a **Secret key** (começa com `sk_live_...`)

### 2. Webhook Secret

1. Vá para **Developers** > **Webhooks**
2. Clique em **Add endpoint**
3. Configure:
   ```
   Endpoint URL: https://seu-dominio.vercel.app/api/stripe/webhook
   Eventos para escutar:
   - checkout.session.completed
   - payment_intent.payment_failed
   ```
4. Clique em **Add endpoint**
5. Na página do endpoint, clique em **Reveal** no **Signing secret**
6. Copie o Webhook Secret (começa com `whsec_...`)

## 🔧 Parte 3: Configurar Variáveis de Ambiente

### Desenvolvimento Local

Edite `apps/web/.env.local`:

```env
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_de_teste
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_local
STRIPE_PRICE_STARTER=price_seu_price_id_starter
STRIPE_PRICE_BASIC=price_seu_price_id_basic
STRIPE_PRICE_PRO=price_seu_price_id_pro
STRIPE_PRICE_ULTIMATE=price_seu_price_id_ultimate
```

### Produção (Vercel)

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá no seu projeto CertifyRPG
3. **Settings** > **Environment Variables**
4. Adicione as seguintes variáveis:

```env
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_de_producao
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_de_producao
STRIPE_PRICE_STARTER=price_seu_price_id_starter
STRIPE_PRICE_BASIC=price_seu_price_id_basic
STRIPE_PRICE_PRO=price_seu_price_id_pro
STRIPE_PRICE_ULTIMATE=price_seu_price_id_ultimate
```

**IMPORTANTE:**
- Use as mesmas variáveis para **Production**, **Preview**, e **Development**
- Ou configure separadamente:
  - Production: chaves `sk_live_...`
  - Preview/Development: chaves `sk_test_...`

## 🧪 Parte 4: Testar Webhooks Localmente

### Com Stripe CLI

1. Instale o Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. Faça login:
   ```bash
   stripe login
   ```

3. Encaminhe webhooks para localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Você receberá um Webhook Signing Secret temporário:
   ```
   whsec_...
   ```

5. Adicione ao `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_o_secret_que_voce_recebeu
   ```

6. Em outro terminal, rode o app:
   ```bash
   pnpm dev
   ```

7. Teste o checkout:
   - Vá para http://localhost:3000/dashboard/credits
   - Clique em "Comprar" em qualquer pacote
   - Use cartão de teste: `4242 4242 4242 4242`
   - Data: qualquer data futura
   - CVV: qualquer 3 dígitos
   - CEP: qualquer CEP válido

8. Verifique no terminal do Stripe CLI se o webhook foi recebido

## ✅ Parte 5: Verificar Configuração

### Checklist Pré-Deploy

- [ ] 4 produtos criados no Stripe Dashboard
- [ ] 4 Price IDs copiados e salvos
- [ ] Secret Key copiada (test e live)
- [ ] Webhook endpoint criado no Stripe
- [ ] Webhook Secret copiado
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Testado fluxo completo de compra em modo test

### Testar em Produção

1. Certifique-se de que o webhook endpoint está acessível:
   ```
   https://seu-dominio.vercel.app/api/stripe/webhook
   ```

2. No Stripe Dashboard (Live mode):
   - Vá para **Developers** > **Webhooks**
   - Clique no seu endpoint
   - Clique em **Send test webhook**
   - Selecione `checkout.session.completed`
   - Envie

3. Verifique se não há erros

## 🎯 Parte 6: Cartões de Teste

Use estes cartões para testar em modo **Test**:

| Cenário | Número do Cartão | Resultado |
|---------|-----------------|-----------|
| Sucesso | 4242 4242 4242 4242 | Pagamento aprovado |
| Recusado | 4000 0000 0000 0002 | Cartão recusado |
| Fundos insuficientes | 4000 0000 0000 9995 | Fundos insuficientes |
| 3D Secure | 4000 0027 6000 3184 | Requer autenticação |

**Sempre use:**
- Data: qualquer data futura (ex: 12/25)
- CVV: qualquer 3 dígitos (ex: 123)
- CEP: qualquer CEP válido

## 🚨 Troubleshooting

### Erro: "Webhook signature verification failed"

**Causa:** Webhook secret incorreto ou não configurado

**Solução:**
1. Verifique se `STRIPE_WEBHOOK_SECRET` está no `.env.local`
2. Certifique-se de que copiou o secret correto do Stripe Dashboard
3. Se usando Stripe CLI, use o secret que ele forneceu

### Erro: "No such price"

**Causa:** Price ID incorreto nas variáveis de ambiente

**Solução:**
1. Verifique se os Price IDs estão corretos
2. Certifique-se de estar usando o mesmo modo (test/live) no código e no Stripe

### Créditos não são adicionados após pagamento

**Causa:** Webhook não está sendo recebido

**Solução:**
1. Verifique se o webhook endpoint está correto
2. Vá no Stripe Dashboard > Webhooks > seu endpoint > Recent events
3. Veja se há eventos e se há erros
4. Verifique os logs do servidor (Vercel/console)

### Checkout abre mas dá erro

**Causa:** `NEXT_PUBLIC_APP_URL` incorreto

**Solução:**
1. Verifique se `NEXT_PUBLIC_APP_URL` está configurado
2. Em produção, deve ser: `https://seu-dominio.vercel.app`
3. Localmente: `http://localhost:3000`

## 📊 Monitoramento

### Stripe Dashboard

Monitore:
- **Payments**: Todos os pagamentos
- **Customers**: Clientes que compraram
- **Events**: Eventos do webhook
- **Logs**: Logs de API requests

### Vercel Logs

```bash
vercel logs seu-projeto
```

Procure por:
- Erros no webhook handler
- Chamadas à função `update_user_credits`

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite** chaves secretas no git
2. Use variáveis de ambiente para todas as chaves
3. Mantenha `sk_test_` para desenvolvimento
4. Use `sk_live_` apenas em produção
5. Rotacione as chaves periodicamente
6. Monitore eventos suspeitos no Stripe Dashboard

### Verificação de Webhook

O código já implementa verificação de assinatura:

```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

Isso garante que apenas webhooks legítimos do Stripe sejam processados.

## 📞 Suporte

- **Stripe Docs**: [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Stripe Status**: [https://status.stripe.com](https://status.stripe.com)

---

**Feito!** Seu sistema de pagamentos está configurado! 💳✨
