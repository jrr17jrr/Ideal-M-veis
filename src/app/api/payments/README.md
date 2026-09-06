# `app/api/payments/` — Placeholder de pagamentos

Esta pasta existe para deixar o caminho pronto para a integração com o
**Mercado Pago**. **Nada aqui está ativo hoje.**

## Arquivos previstos

| Rota | Responsabilidade |
| --- | --- |
| `POST /api/payments` | Recebe o checkout do client, valida preços no Supabase, cria pagamento/preferência no Mercado Pago, grava `orders`/`order_items`/`payments`. Retorna `{ orderId, status, pixCode?, initPoint? }`. |
| `POST /api/payments/webhook` | Recebe notificações do Mercado Pago, valida a assinatura, atualiza o status do pedido no Supabase. |

## Fluxo seguro

```
Cliente (checkout)
  └─> POST /api/payments            (Next.js — servidor)
        ├─ valida carrinho/preços no Supabase
        ├─ cria pagamento no Mercado Pago (MP_ACCESS_TOKEN, server-only)
        └─ grava pedido no Supabase (status: pending)
  <─ { orderId, status, pixCode? / initPoint? }

Mercado Pago
  └─> POST /api/payments/webhook
        ├─ valida x-signature
        └─ atualiza orders.status / payments.status no Supabase
```

**Nunca** chamar o Mercado Pago direto do browser com o Access Token.

## Variáveis de ambiente (futuro, server-only)

```
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
```

Detalhes completos em `docs/backend-plan.md`.
