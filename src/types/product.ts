/**
 * Entidades de catálogo — "fonte da verdade" do domínio no front-end.
 *
 * O formato foi pensado para mapear 1:1 com as futuras tabelas do Supabase:
 *   products          -> Product
 *   product_images    -> ProductImage
 *   product_variants  -> ProductVariant       (variação de COR, com imagens próprias)
 *   (json em products)-> ProductOptionGroup   (tamanho, tecido, acabamento…)
 *   categories        -> ProductCategory
 *   (json/tabela)     -> ProductRoom           (ambiente)
 *
 * Quando o Supabase entrar, basta o `services/products.ts` montar estes objetos
 * a partir das linhas do banco — nenhum componente precisa mudar.
 */

export type CategorySlug =
  | "sofas"
  | "poltronas"
  | "mesas"
  | "cadeiras"
  | "camas"
  | "guarda-roupas"
  | "racks-paineis"
  | "escritorio"
  | "decoracao";

export type RoomSlug =
  | "sala-de-estar"
  | "sala-de-jantar"
  | "quarto"
  | "escritorio"
  | "area-externa";

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export type FurnitureStyle =
  | "moderno"
  | "minimalista"
  | "classico"
  | "industrial"
  | "contemporaneo"
  | "rustico";

export interface ProductDimensions {
  /** cm */
  width: number;
  /** cm */
  height: number;
  /** cm */
  depth: number;
}

/** Uma foto do produto. `color` liga a foto a uma variação de cor. */
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  /** Nome da cor a que esta imagem pertence (opcional) */
  color?: string;
  position: number;
}

/**
 * Variação de COR — cada cor pode ter estoque, ajuste de preço e imagens próprias.
 * A galeria da página de produto acompanha a variação selecionada.
 */
export interface ProductVariant {
  id: string;
  color: string;
  /** Hex para o swatch (ex.: "#8a8f99") */
  colorHex: string;
  material?: string;
  stock: number;
  /** Imagens específicas desta cor (se vazio, usa as imagens base) */
  images: string[];
  /** Ajuste sobre o preço base, em reais (pode ser 0 ou negativo) */
  priceAdjustment: number;
}

/**
 * Grupo de opção NÃO relacionada a cor (tamanho, tecido, acabamento, nº de portas).
 * Só valores — não altera imagem nem, por ora, preço.
 */
export interface ProductOptionGroup {
  /** Ex.: "Tamanho", "Tecido", "Acabamento" */
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: CategorySlug;
  room?: RoomSlug;
  style?: FurnitureStyle;

  /** Preço "de" (cheio) */
  price: number;
  /** Preço "por" (promocional) — ausente quando não há desconto */
  salePrice?: number;

  /** Galeria base (usada quando não há variação de cor selecionada) */
  images: string[];
  stock: number;

  featured: boolean;
  bestSeller?: boolean;
  new?: boolean;

  material?: string;
  /** Lista simples de nomes de cor (deriva de `variants` quando houver) */
  colors?: string[];
  dimensions?: ProductDimensions;

  /** Variações de cor com imagens próprias */
  variants?: ProductVariant[];
  /** Outras opções (tamanho, tecido…) */
  options?: ProductOptionGroup[];

  weightKg?: number;
  warranty?: string;
  assembly?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface ProductCategory {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  /** Para o menu / ordenação */
  position?: number;
}

export interface ProductRoom {
  slug: RoomSlug;
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
  categories?: CategorySlug[];
  rooms?: RoomSlug[];
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

/* ---------- Helpers de domínio ---------- */

/** Preço efetivo considerando a variação selecionada. */
export function variantPrice(
  product: Product,
  variant?: ProductVariant,
): { price: number; salePrice?: number } {
  const adj = variant?.priceAdjustment ?? 0;
  return {
    price: product.price + adj,
    salePrice:
      product.salePrice != null ? product.salePrice + adj : undefined,
  };
}

/** Imagens efetivas para a galeria: as da variação, senão as base. */
export function galleryImages(
  product: Product,
  variant?: ProductVariant,
): string[] {
  if (variant && variant.images.length > 0) {
    // fotos da cor primeiro + fotos base como contexto (sem duplicar)
    return [...variant.images, ...product.images.filter((i) => !variant.images.includes(i))];
  }
  return product.images;
}
