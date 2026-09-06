# Plano de back-end — Supabase + Mercado Pago

Este documento descreve como o back-end **vai** ser ligado. Nada disso está
implementado ainda — o front-end funciona 100% com dados mockados.

Princípio central: **os componentes só falam com `src/services/*`.**
Trocar mock → Supabase é reescrever o corpo dos serviços, sem tocar na UI.

---

## 1. Camadas

```
Componentes (UI)
      │  (só conhecem os serviços)
      ▼
src/services/*.ts            products · auth · shipping · payment · orders
      │  hoje: src/data/*.ts (mock)
      │  amanhã: src/lib/supabase/* + Route Handlers
      ▼
Supabase (Postgres + Auth + Storage) / Mercado Pago
```

Arquivos já preparados:

| Arquivo | Hoje | Futuro |
| --- | --- | --- |
| `src/lib/supabase/client.ts` | retorna `null` | `createBrowserClient` |
| `src/lib/supabase/server.ts` | retorna `null` | `createServerClient` (cookies) |
| `src/lib/supabase/types.ts` | placeholder | `supabase gen types` |
| `src/services/products.ts` | lê `data/products.ts` | `from("products").select()` |
| `src/services/auth.ts` | sessão fake | `supabase.auth.*` |
| `src/services/shipping.ts` | CEP/frete fake | ViaCEP + transportadora |
| `src/services/payment.ts` | simula pagamento | `fetch("/api/payments")` |
| `src/app/api/payments/` | placeholder 501 | Mercado Pago + webhook |

---

## 2. Modelo de dados (Supabase)

### `profiles`
Extensão de `auth.users`. `id uuid PK → auth.users.id`.
Campos: `first_name`, `last_name`, `phone`, `cpf`, `created_at`.

### `addresses`
Endereços do cliente. `id uuid PK`, `user_id → profiles.id`.
Campos: `label`, `recipient`, `zip_code`, `street`, `number`, `complement`,
`district`, `city`, `state`, `is_default bool`.
Relação: **profiles 1—N addresses**.

### `categories`
`id uuid PK`, `slug text unique`, `name`, `description`, `image_url`, `position int`.

### `products`
`id uuid PK`, `slug text unique`, `sku text unique`, `name`, `description`,
`category_id → categories.id`, `price numeric`, `sale_price numeric null`,
`stock int`, `featured bool`, `best_seller bool`, `is_new bool`,
`material text`, `environment text`,
`width_cm`, `height_cm`, `depth_cm`, `weight_kg`,
`warranty text`, `assembly text`, `rating numeric`, `reviews_count int`,
`created_at`.
Relação: **categories 1—N products**.

### `product_images`
`id uuid PK`, `product_id → products.id`, `url`, `alt`, `position int`.
Relação: **products 1—N product_images**. Arquivos no Supabase Storage
(bucket `product-images`).

### `product_variants`
`id uuid PK`, `product_id → products.id`, `name text` (ex.: "Cor"),
`value text` (ex.: "Bege"), `price_delta numeric default 0`, `stock int null`,
`sku_suffix text null`.
Relação: **products 1—N product_variants**.

### `favorites`
`user_id → profiles.id`, `product_id → products.id`, `created_at`.
PK composta `(user_id, product_id)`. **N—N** entre profiles e products.
> Hoje isso vive no `localStorage` (`FavoritesContext`). Ao logar, fazer merge.

### `carts`
`id uuid PK`, `user_id → profiles.id null` (carrinho anônimo permitido),
`created_at`, `updated_at`.

### `cart_items`
`id uuid PK`, `cart_id → carts.id`, `product_id → products.id`,
`variant_selection jsonb`, `quantity int`, `unit_price numeric`.
Relação: **carts 1—N cart_items**.
> Hoje vive no `localStorage` (`CartContext`).

### `orders`
`id uuid PK`, `number text unique`, `user_id → profiles.id`,
`status text` (`payment_pending` | `payment_approved` | `processing` |
`shipped` | `delivered` | `canceled`),
`shipping_address jsonb` (snapshot), `shipping_method text`,
`shipping_cost numeric`, `subtotal numeric`, `discount numeric`,
`total numeric`, `created_at`.
Relação: **profiles 1—N orders**.

### `order_items`
`id uuid PK`, `order_id → orders.id`, `product_id → products.id`,
`name` (snapshot), `image_url` (snapshot), `unit_price numeric`,
`quantity int`, `variant_selection jsonb`.
Relação: **orders 1—N order_items**.

### `payments`
`id uuid PK`, `order_id → orders.id`, `method text` (`pix` | `credit_card`),
`status text` (`pending` | `approved` | `rejected` | `refunded`),
`amount numeric`, `installments int`,
`provider text default 'mercadopago'`, `provider_payment_id text`,
`pix_qr_code text null`, `raw jsonb`, `created_at`, `updated_at`.
Relação: **orders 1—1 payments** (ou 1—N se permitir retentativas).

### Diagrama de relações

```
auth.users ─1:1─ profiles ─1:N─ addresses
                    │
                    ├─1:N─ orders ─1:N─ order_items ─N:1─ products
                    │         └─1:1─ payments
                    ├─1:N─ favorites ─N:1─ products
                    └─1:N─ carts ─1:N─ cart_items ─N:1─ products

categories ─1:N─ products ─1:N─ product_images
                          └─1:N─ product_variants
```

### RLS (resumo)
- `profiles`, `addresses`, `favorites`, `carts`, `cart_items`, `orders`,
  `order_items`, `payments`: `user_id = auth.uid()`.
- `categories`, `products`, `product_images`, `product_variants`: leitura pública,
  escrita só para `service_role` (painel admin, no futuro).

---

## 3. Fluxo de pagamento (Mercado Pago)

**Recomendado:**

```
Cliente → Checkout
        → POST /api/payments  (Next.js Route Handler — SERVIDOR)
             1. valida itens/preços contra a tabela products (nunca confia no client)
             2. cria order + order_items (status payment_pending) no Supabase
             3. chama o Mercado Pago com MP_ACCESS_TOKEN (env server-only)
                - Pix: cria payment, retorna QR Code / copia-e-cola
                - Cartão: recebe card token do client (Public Key) e cria payment
             4. cria registro em payments (status pending)
        ← { orderId, status, pixQrCode? , initPoint? }

Mercado Pago → POST /api/payments/webhook
             1. valida assinatura (x-signature + MP_WEBHOOK_SECRET)
             2. consulta o pagamento na API do MP
             3. atualiza payments.status e orders.status no Supabase
             4. (opcional) dispara e-mail de confirmação
```

**Nunca:**

```
Cliente → Mercado Pago  usando Access Token privado  ❌
```

O Access Token privado só existe no servidor. No client, no máximo a
**Public Key** (`NEXT_PUBLIC_MP_PUBLIC_KEY`) para tokenizar o cartão com o
SDK do MP antes de mandar o token para `/api/payments`.

### Recursos desejados
- Pix (com desconto à vista — hoje mockado em `lib/format.ts` `PIX_DISCOUNT`)
- Cartão de crédito
- Parcelamento (regra atual mockada: até 12x, parcela mínima R$100)
- Webhook para atualização automática do status do pedido

### Variáveis de ambiente
```
MP_ACCESS_TOKEN=          # server-only
MP_WEBHOOK_SECRET=        # server-only
NEXT_PUBLIC_MP_PUBLIC_KEY=  # pode ser exposta
```

---

## 4. Ordem sugerida de implementação

1. Criar projeto Supabase, rodar as migrations das tabelas acima.
2. Popular `categories` / `products` / `product_images` (seed a partir de
   `src/data/products.ts`).
3. Instalar `@supabase/supabase-js` + `@supabase/ssr`, implementar
   `lib/supabase/client.ts` e `server.ts`.
4. Reescrever `services/products.ts` para consultar o Supabase.
5. Ligar Supabase Auth em `services/auth.ts` + `AuthContext`.
6. Migrar carrinho/favoritos para as tabelas (com merge do `localStorage` no login).
7. Implementar `app/api/payments/route.ts` + `webhook/route.ts` (Mercado Pago).
8. Trocar `services/payment.ts` para chamar `/api/payments`.
9. Reescrever `services/orders.ts` (listagem/detalhe vindos de `orders`).
10. Construir o painel administrativo (produtos, estoque, pedidos, cupons, banners).
