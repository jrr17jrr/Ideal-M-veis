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
  { label: "Sala", href: "/categoria/sala", categorySlug: "sala" },
  { label: "Quarto", href: "/categoria/quarto", categorySlug: "quarto" },
  { label: "Cozinha", href: "/categoria/cozinha", categorySlug: "cozinha" },
  {
    label: "Escritório",
    href: "/categoria/escritorio",
    categorySlug: "escritorio",
  },
  {
    label: "Decoração",
    href: "/categoria/decoracao",
    categorySlug: "decoracao",
  },
  { label: "Ofertas", href: "/ofertas" },
];

export interface Benefit {
  title: string;
  description: string;
  icon: "shield" | "card" | "truck" | "headset";
}

export const BENEFITS: Benefit[] = [
  {
    title: "Compra segura",
    description: "Ambiente protegido e dados criptografados.",
    icon: "shield",
  },
  {
    title: "Até 12x sem juros",
    description: "No cartão, ou 10% de desconto no Pix.",
    icon: "card",
  },
  {
    title: "Entrega para todo o Brasil",
    description: "Logística própria nas capitais.",
    icon: "truck",
  },
  {
    title: "Atendimento especializado",
    description: "Consultoria de ambientação de seg. a sáb.",
    icon: "headset",
  },
];

/** Seção "Compre por categoria" da home — cards com foto por tipo de produto. */
export const CATEGORY_SHOWCASE: {
  label: string;
  href: string;
  image: string;
}[] = [
  { label: "Sofás", href: "/produtos?q=sof%C3%A1", image: "/images/categories/sofas.jpg" },
  { label: "Mesas", href: "/produtos?q=mesa", image: "/images/categories/mesas.jpg" },
  { label: "Cadeiras", href: "/produtos?q=cadeira", image: "/images/categories/cadeiras.jpg" },
  { label: "Racks e painéis", href: "/produtos?q=rack", image: "/images/categories/racks-paineis.jpg" },
  { label: "Quartos", href: "/categoria/quarto", image: "/images/categories/quartos.jpg" },
  { label: "Escritório", href: "/categoria/escritorio", image: "/images/categories/escritorio.jpg" },
  { label: "Decoração", href: "/categoria/decoracao", image: "/images/categories/decoracao.jpg" },
];

/** Seção "Compre por ambiente" da home — cards grandes de ambiente. */
export const SHOP_BY_ROOM: { label: string; href: string; image: string }[] = [
  { label: "Sala de estar", href: "/categoria/sala", image: "/images/rooms/sala.jpg" },
  { label: "Quarto", href: "/categoria/quarto", image: "/images/rooms/quarto.jpg" },
  { label: "Cozinha e Jantar", href: "/categoria/cozinha", image: "/images/rooms/cozinha.jpg" },
  { label: "Home Office", href: "/categoria/escritorio", image: "/images/rooms/escritorio.jpg" },
];

export const STORE_FOOTER_TAGLINE =
  "Transformando sua casa em um lugar ainda melhor.";

export const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Categorias",
    links: [
      { label: "Sala", href: "/categoria/sala" },
      { label: "Quarto", href: "/categoria/quarto" },
      { label: "Cozinha e Jantar", href: "/categoria/cozinha" },
      { label: "Escritório", href: "/categoria/escritorio" },
      { label: "Decoração", href: "/categoria/decoracao" },
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
