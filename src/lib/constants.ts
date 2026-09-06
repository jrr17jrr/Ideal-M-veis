import type { CategorySlug } from "@/types";

/** Nome da loja. */
export const STORE_NAME = "Ideal Móveis";
export const STORE_TAGLINE = "Móveis de design para viver bem";
export const STORE_DESCRIPTION =
  "Loja de móveis e decoração com curadoria de design. Sofás, mesas, cadeiras, guarda-roupas e peças de decoração com entrega para todo o Brasil.";

/**
 * URL pública canônica do site — usada em `metadataBase`, Open Graph, sitemap e
 * JSON-LD.
 *
 * Ordem de resolução (o primeiro valor válido vence):
 *  1. `NEXT_PUBLIC_SITE_URL` — definida manualmente; adiciona `https://` se faltar
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — domínio de produção na Vercel (sempre https)
 *  3. `VERCEL_URL` — URL do deploy atual na Vercel (preview, sempre https)
 *  4. `http://localhost:3000` — desenvolvimento / fallback seguro
 *
 * Nunca retorna string vazia nem valor inválido, então `new URL(SITE_URL)` é
 * sempre seguro (não usamos `new URL("")`).
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;
    try {
      // Normaliza (valida a URL e remove barra final).
      return new URL(withProtocol).toString().replace(/\/$/, "");
    } catch {
      // valor malformado — tenta o próximo candidato
    }
  }

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export interface NavItem {
  label: string;
  href: string;
  categorySlug?: CategorySlug;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Sofás", href: "/categoria/sofas", categorySlug: "sofas" },
  { label: "Poltronas", href: "/categoria/poltronas", categorySlug: "poltronas" },
  { label: "Mesas", href: "/categoria/mesas", categorySlug: "mesas" },
  { label: "Cadeiras", href: "/categoria/cadeiras", categorySlug: "cadeiras" },
  { label: "Camas", href: "/categoria/camas", categorySlug: "camas" },
  { label: "Guarda-roupas", href: "/categoria/guarda-roupas", categorySlug: "guarda-roupas" },
  { label: "Racks e Painéis", href: "/categoria/racks-paineis", categorySlug: "racks-paineis" },
  { label: "Escritório", href: "/categoria/escritorio", categorySlug: "escritorio" },
  { label: "Decoração", href: "/categoria/decoracao", categorySlug: "decoracao" },
  { label: "Ambientes", href: "/#ambientes" },
  { label: "Ofertas", href: "/ofertas" },
];

export interface Benefit {
  title: string;
  description: string;
  icon: "shield" | "card" | "truck" | "headset" | "percent";
}

export const BENEFITS: Benefit[] = [
  {
    title: "Entrega para todo o Brasil",
    description: "Com segurança e agilidade",
    icon: "truck",
  },
  {
    title: "Até 12x sem juros",
    description: "No cartão de crédito",
    icon: "card",
  },
  {
    title: "5% de desconto no Pix",
    description: "Mais economia para você",
    icon: "percent",
  },
  {
    title: "Atendimento especializado",
    description: "Antes e depois da sua compra",
    icon: "headset",
  },
];

/** Itens da barrinha superior do header. */
export const TOP_BAR_ITEMS = [
  "Entrega para todo o Brasil",
  "Até 12x sem juros",
  "Compra segura",
  "Atendimento especializado",
];

/** Seção "Compre por categoria" da home — cards com foto por tipo de produto. */
export const CATEGORY_SHOWCASE: {
  label: string;
  href: string;
  image: string;
}[] = [
  { label: "Sofás", href: "/categoria/sofas", image: "/images/categories/sofas.jpg" },
  { label: "Poltronas", href: "/categoria/poltronas", image: "/images/categories/poltronas.jpg" },
  { label: "Mesas", href: "/categoria/mesas", image: "/images/categories/mesas.jpg" },
  { label: "Cadeiras", href: "/categoria/cadeiras", image: "/images/categories/cadeiras.jpg" },
  { label: "Camas", href: "/categoria/camas", image: "/images/categories/camas.jpg" },
  { label: "Guarda-roupas", href: "/categoria/guarda-roupas", image: "/images/categories/guarda-roupas.jpg" },
  { label: "Racks e Painéis", href: "/categoria/racks-paineis", image: "/images/categories/racks-paineis.jpg" },
  { label: "Escritório", href: "/categoria/escritorio", image: "/images/categories/escritorio.jpg" },
];

/** Seção "Compre por ambiente" da home — cards grandes de ambiente. */
export const SHOP_BY_ROOM: { label: string; href: string; image: string }[] = [
  { label: "Sala de estar", href: "/produtos?ambiente=sala-de-estar", image: "/images/rooms/sala.jpg" },
  { label: "Sala de jantar", href: "/produtos?ambiente=sala-de-jantar", image: "/images/rooms/jantar.jpg" },
  { label: "Quarto", href: "/produtos?ambiente=quarto", image: "/images/rooms/quarto.jpg" },
  { label: "Escritório", href: "/produtos?ambiente=escritorio", image: "/images/rooms/escritorio.jpg" },
  { label: "Área externa", href: "/produtos?ambiente=area-externa", image: "/images/rooms/varanda.jpg" },
];

export const STORE_FOOTER_TAGLINE =
  "Transformando sua casa em um lugar ainda melhor.";

export const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Categorias",
    links: [
      { label: "Sofás", href: "/categoria/sofas" },
      { label: "Poltronas", href: "/categoria/poltronas" },
      { label: "Mesas e cadeiras", href: "/categoria/mesas" },
      { label: "Camas e guarda-roupas", href: "/categoria/camas" },
      { label: "Escritório", href: "/categoria/escritorio" },
      { label: "Ofertas", href: "/ofertas" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { label: "Central de atendimento", href: "/" },
      { label: "Prazos e entregas", href: "/" },
      { label: "Trocas e devoluções", href: "/" },
      { label: "Montagem", href: "/" },
      { label: "Perguntas frequentes", href: "/" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre a Ideal Móveis", href: "/" },
      { label: "Nossas lojas", href: "/" },
      { label: "Trabalhe conosco", href: "/" },
      { label: "Blog de decoração", href: "/" },
    ],
  },
  {
    title: "Minha conta",
    links: [
      { label: "Entrar", href: "/login" },
      { label: "Meus pedidos", href: "/pedidos" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Endereços", href: "/minha-conta" },
    ],
  },
];

/** Formas de pagamento exibidas no footer (apenas visual). */
export const PAYMENT_METHODS = [
  "Pix",
  "Visa",
  "Mastercard",
  "Elo",
  "American Express",
  "Boleto",
];

/** Chaves usadas no localStorage. */
export const STORAGE_KEYS = {
  cart: "ideal-moveis.cart.v1",
  favorites: "ideal-moveis.favorites.v1",
  session: "ideal-moveis.session.v1",
} as const;
