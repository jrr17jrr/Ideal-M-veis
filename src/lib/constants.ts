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
    description: "Ambiente protegido e dados criptografados em toda a jornada.",
    icon: "shield",
  },
  {
    title: "Parcele em até 12x",
    description: "Sem juros no cartão ou 10% de desconto no Pix.",
    icon: "card",
  },
  {
    title: "Entrega para todo o Brasil",
    description: "Logística própria nas capitais e transportadora no interior.",
    icon: "truck",
  },
  {
    title: "Atendimento humano",
    description: "Especialistas em ambientação de segunda a sábado.",
    icon: "headset",
  },
];

export const SHOP_BY_ROOM: { label: string; href: string; image: string }[] = [
  { label: "Sala de estar", href: "/categoria/sala", image: "/images/rooms/sala.svg" },
  { label: "Quarto", href: "/categoria/quarto", image: "/images/rooms/quarto.svg" },
  { label: "Cozinha e jantar", href: "/categoria/cozinha", image: "/images/rooms/cozinha.svg" },
  { label: "Home office", href: "/categoria/escritorio", image: "/images/rooms/escritorio.svg" },
];

export const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Institucional",
    links: [
      { label: "Sobre a loja", href: "/" },
      { label: "Nossas lojas", href: "/" },
      { label: "Trabalhe conosco", href: "/" },
      { label: "Blog de decoração", href: "/" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Central de atendimento", href: "/" },
      { label: "Prazos e entregas", href: "/" },
      { label: "Trocas e devoluções", href: "/" },
      { label: "Montagem", href: "/" },
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

/** Chaves usadas no localStorage. */
export const STORAGE_KEYS = {
  cart: "ideal-moveis.cart.v1",
  favorites: "ideal-moveis.favorites.v1",
  session: "ideal-moveis.session.v1",
} as const;
