# Ideal Móveis — Front-end do e-commerce

Loja de móveis e decoração construída com **Next.js (App Router) + TypeScript +
Tailwind CSS**. Toda a experiência de compra funciona localmente (catálogo,
filtros, busca, carrinho, favoritos, checkout). Banco de dados, autenticação
real e pagamentos serão conectados depois — a arquitetura já está preparada
para isso.

> O logo tipográfico e as cores ainda são **provisórios**. Ajuste o nome/textos
> em `src/lib/constants.ts` e a paleta em `src/app/globals.css` (bloco `@theme`).

---

## Requisitos

- Node.js 18.18+ (recomendado 20+)
- npm

## Instalação e execução

```bash
npm install
npm run fetch:photos   # (opcional) rebaixa as fotos de public/images/ — já versionadas
npm run dev            # http://localhost:3000
```

Outros comandos:

```bash
npm run build          # build de produção
npm run start          # sobe o build
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
```

---

## Estrutura do projeto

```
src/
├── app/                        # Rotas (App Router)
│   ├── layout.tsx              # Header + Footer + Providers globais
│   ├── page.tsx                # Home
│   ├── produtos/               # Catálogo completo (/produtos)
│   ├── categoria/[slug]/       # Catálogo por categoria (sala, quarto, ...)
│   ├── ofertas/                # Catálogo filtrado só em promoção
│   ├── busca/                  # Resultados de busca (?q=)
│   ├── produto/[slug]/         # Página de produto (galeria, variações, frete, abas)
│   ├── carrinho/               # Carrinho completo
│   ├── checkout/               # Fluxo de checkout em 4 etapas
│   ├── favoritos/              # Lista de favoritos
│   ├── login/ cadastro/ esqueci-senha/
│   ├── minha-conta/            # Área do cliente (dados, endereços)
│   ├── pedidos/  pedido/[id]/  # Lista e detalhe de pedidos
│   ├── api/payments/           # PLACEHOLDER da rota de pagamento (Mercado Pago)
│   ├── sitemap.ts  robots.ts
│   └── loading.tsx  error.tsx  not-found.tsx
│
├── components/
│   ├── layout/                 # Header, Footer, MobileMenu, SearchOverlay, Logo
│   ├── home/                   # HeroVideo, HeroSearch, CategoryShowcase, PromoBanner, ...
│   ├── product/                # ProductCard, ProductGallery, ProductPurchase, ...
│   ├── catalog/                # CatalogView (filtros/ordenação/paginação) + FilterPanel
│   ├── cart/                   # CartDrawer (mini-cart), CartLineItem, CartSummary
│   ├── checkout/               # CheckoutFlow + etapas + confirmação
│   ├── account/                # AccountShell, OrdersList, OrderDetail, ProfileForm
│   ├── auth/                   # Formulários de login/cadastro/recuperação
│   └── ui/                     # Primitivos: Button, Badge, Price, Drawer, Accordion, ...
│
├── context/                    # Estado global (client)
│   ├── Providers.tsx           # Agrupa todos os providers
│   ├── CartContext.tsx         # Carrinho + persistência em localStorage + mini-cart
│   ├── FavoritesContext.tsx    # Favoritos + localStorage
│   ├── AuthContext.tsx         # Sessão (fake por enquanto)
│   └── ToastContext.tsx        # Notificações (toast)
│
├── services/                   # ÚNICA fronteira com "back-end"
│   ├── products.ts             # hoje: data/products.ts · amanhã: Supabase
│   ├── auth.ts                 # signIn/signUp/signOut/resetPassword (mock)
│   ├── shipping.ts             # lookupAddressByCEP / simulateShipping (mock)
│   ├── payment.ts              # createPayment (mock — ver comentários)
│   └── orders.ts               # listOrders / getOrder / buildLocalOrder
│
├── data/                       # Dados MOCKADOS (não usar direto nos componentes!)
│   ├── products.ts             # 31 produtos fictícios
│   ├── categories.ts  reviews.ts  orders.ts  user.ts  shipping.ts
│
├── lib/
│   ├── catalog.ts              # filtro/ordenação/busca (puro, sem React)
│   ├── format.ts               # moeda, parcelamento, desconto, Pix
│   ├── masks.ts                # CPF, telefone, CEP, cartão
│   ├── constants.ts            # nome da loja, menu, benefícios, chaves do localStorage
│   ├── cn.ts                   # helper de classes
│   └── supabase/               # PLACEHOLDER da camada Supabase (client/server/types/env)
│
├── hooks/                      # useMediaQuery, useDebouncedValue, useBodyScrollLock
└── types/                      # Product, CartItem, Order, OrderItem, Address, Customer, Payment...

scripts/fetch-photos.mjs        # baixa as fotos reais (Pexels) para public/images/
docs/backend-plan.md            # plano de tabelas do Supabase + fluxo do Mercado Pago
```

---

## O que já funciona (mock, no navegador)

| Recurso | Onde |
| --- | --- |
| Catálogo com filtros (categoria, preço, cor, material, ambiente, disponibilidade, promoção) | `/produtos`, `/categoria/[slug]` |
| Ordenação (relevância, preço, mais vendidos, lançamentos) | idem |
| Filtros em drawer no mobile | idem |
| Paginação "Carregar mais" + sincronização com a URL | idem |
| Busca por nome / categoria / material | ícone de busca no header, `/busca` |
| Página de produto: galeria, miniaturas, variações, quantidade | `/produto/[slug]` |
| Simulação de frete por CEP (dados fake) | página de produto e checkout |
| Abas de informações (descrição, dimensões, garantia, avaliações) | página de produto |
| Carrinho: adicionar/remover/quantidade, subtotal, desconto, frete grátis | `/carrinho` + mini-cart |
| Carrinho persistido em `localStorage` e sincronizado entre abas | `CartContext` |
| Favoritos persistidos em `localStorage` | `/favoritos`, coração nos cards |
| Checkout em 4 etapas (identificação → entrega → frete → pagamento) | `/checkout` |
| Preenchimento de endereço ao digitar o CEP (fake) | etapa de entrega |
| Tela de pedido confirmado + "código Pix" fictício | pós-checkout |
| Login / cadastro / recuperação de senha (sessão fake em `localStorage`) | `/login`, `/cadastro`, `/esqueci-senha` |
| Área do cliente com dados, endereços e pedidos fictícios | `/minha-conta`, `/pedidos`, `/pedido/[id]` |
| Toasts, skeletons, estados vazios, breadcrumbs, loading em botões | vários |
| SEO: metadata por página, Open Graph, JSON-LD de produto, sitemap, robots | `app/**` |

---

## O que falta integrar

| Item | Situação | Onde ligar |
| --- | --- | --- |
| **Banco de dados (Supabase)** | não iniciado | `src/lib/supabase/*` + reescrever `src/services/*` |
| **Autenticação real (Supabase Auth)** | mock | `src/services/auth.ts` + `src/context/AuthContext.tsx` |
| **Pagamentos (Mercado Pago)** | mock + placeholder | `src/app/api/payments/` + `src/services/payment.ts` |
| **Frete real** | mock | `src/services/shipping.ts` (ViaCEP + transportadora) |
| **Pedidos reais** | mock | `src/services/orders.ts` |
| **Painel administrativo** | fora do escopo agora | novo módulo — arquitetura já separada |
| **Newsletter** | mock | `src/components/home/Newsletter.tsx` |

Passo a passo detalhado em [`docs/backend-plan.md`](docs/backend-plan.md).

### Onde configurar o Supabase (futuro)

1. `npm install @supabase/supabase-js @supabase/ssr`
2. Preencher `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`)
3. Implementar `src/lib/supabase/client.ts` e `server.ts` (instruções no arquivo)
4. Trocar o corpo das funções em `src/services/*` — **os componentes não mudam**

### Onde configurar o Mercado Pago (futuro)

1. Implementar `src/app/api/payments/route.ts` e `.../webhook/route.ts`
   (esqueleto e fluxo em `src/app/api/payments/README.md`)
2. `.env.local`: `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET` **(server-only, nunca `NEXT_PUBLIC_`)**
3. Trocar `createPayment()` em `src/services/payment.ts` para chamar `/api/payments`

> ⚠️ O Access Token / segredos do Mercado Pago **nunca** podem ir para o client.

---

## Imagens

As imagens em `public/images/**` são **fotos reais do [Pexels](https://www.pexels.com)**
(licença livre para uso, sem atribuição obrigatória), baixadas e versionadas no
repositório por `scripts/fetch-photos.mjs` (o manifesto de IDs fica no próprio
script). Organização:

```
public/images/
├── hero/          # foto grande da home
├── banners/       # banners promocionais
├── rooms/         # "compre por ambiente"
├── categories/    # "compre por categoria" + cards de categoria do catálogo
└── products/      # 2 fotos por produto: <slug>.jpg e <slug>-2.jpg
```

Para trocar uma foto: mude o ID no `MANIFEST` de `scripts/fetch-photos.mjs`,
apague o arquivo antigo e rode `npm run fetch:photos`.

Quando as fotos definitivas do cliente existirem, basta substituir os arquivos
em `public/images/` mantendo os mesmos nomes — nenhum código muda. Para servir de
CDN externo (Supabase Storage etc.), os domínios já estão liberados em
`next.config.ts` (`images.remotePatterns`).

### Vídeo do hero

O hero da home tem um **vídeo de fundo** (`<video autoPlay muted loop playsInline>`):

```
public/videos/
├── hero-moveis.mp4       # 720p (~3 MB) — usado no desktop
└── hero-moveis-360.mp4   # 360p (~0,7 MB) — usado no mobile
public/images/hero/hero-poster.jpg  # poster / fallback
```

- Fonte atual: [Mixkit](https://mixkit.co) (Mixkit License — uso livre, inclusive
  comercial, permitido como fundo de site). Baixado por `npm run fetch:photos`.
- **Para trocar o vídeo:** substitua `public/videos/hero-moveis.mp4`
  (e opcionalmente `hero-moveis-360.mp4` e `public/images/hero/hero-poster.jpg`)
  mantendo os nomes. Nada no código muda.
- Componente: `src/components/home/HeroVideo.tsx`. Respeita
  `prefers-reduced-motion` (mostra só o poster), usa a versão 360p no mobile, tem
  controles próprios de pausar/reproduzir e som/sem-som, e o poster é sempre a
  camada base (a página nunca fica com vídeo "quebrado").

---

## Identidade visual

- **Nome, textos e SEO base:** `src/lib/constants.ts`
- **Cores e fontes:** `src/app/globals.css` — bloco `@theme` (`--color-brand`,
  `--color-canvas`, `--font-display`, `--font-sans`)
- **Logo:** `src/components/layout/Logo.tsx` (hoje é tipográfico)

Fontes atuais: **Fraunces** (títulos) + **Inter** (texto), via `next/font`.

---

## Notas técnicas

- Estado global via React Context (`CartContext`, `FavoritesContext`,
  `AuthContext`, `ToastContext`). Carrinho e favoritos persistem em `localStorage`
  (chaves em `src/lib/constants.ts`).
- Regras de negócio (filtro/ordenação, formatação, máscaras) ficam em `src/lib/*`,
  puras e testáveis.
- Componentes nunca importam `src/data/*` diretamente — sempre via `src/services/*`.
- Sem `any` desnecessário; sem componentes gigantes; UI, dados e regras separados.
