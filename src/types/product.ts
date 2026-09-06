/**
 * Entidades de catálogo.
 *
 * Estes tipos são a "fonte da verdade" do domínio no front-end. Quando o
 * Supabase entrar, as tabelas `products` / `product_images` / `product_variants`
 * devem ser mapeadas para estes mesmos formatos dentro de `services/products.ts`,
 * de modo que os componentes nunca precisem mudar.
 */

export type CategorySlug =
  | "sala"
  | "quarto"
  | "cozinha"
  | "escritorio"
  | "decoracao";

export type EnvironmentSlug =
  | "sala"
  | "quarto"
  | "cozinha"
  | "escritorio"
  | "varanda"
  | "home-office";

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export type FurnitureStyle =
  | "moderno"
  | "minimalista"
  | "classico"
  | "industrial"
  | "contemporaneo"
  | "rustico";

export interface ProductDimensions {
  /** Largura em centímetros */
  width: number;
  /** Altura em centímetros */
  height: number;
  /** Profundidade em centímetros */
  depth: number;
}

export interface ProductVariantOption {
  /** Ex.: "Cor", "Tamanho", "Acabamento" */
  name: string;
  /** Valores possíveis, ex.: ["Bege", "Cinza", "Verde"] */
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: CategorySlug;
  /** Preço "de" (cheio), sempre em reais */
  price: number;
  /** Preço "por" (promocional). Ausente quando não há desconto. */
  salePrice?: number;
  images: string[];
  stock: number;
  featured: boolean;
  bestSeller?: boolean;
  new?: boolean;
  material?: string;
  colors?: string[];
  environment?: EnvironmentSlug;
  style?: FurnitureStyle;
  dimensions?: ProductDimensions;

  /* Campos extras usados pela página de produto (mockados por enquanto) */
  weightKg?: number;
  warranty?: string;
  assembly?: string;
  variants?: ProductVariantOption[];
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

/* ---------- Parâmetros de consulta do catálogo ---------- */

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "best_sellers"
  | "newest";

export interface ProductFilters {
  category?: CategorySlug;
  environment?: EnvironmentSlug;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  materials?: string[];
  styles?: FurnitureStyle[];
  availability?: Availability[];
  onSaleOnly?: boolean;
  search?: string;
}

export interface ProductQuery {
  filters?: ProductFilters;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
