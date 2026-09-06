import type { Product, ProductVariant } from "./product";
import { variantPrice } from "./product";

/**
 * Item do carrinho — snapshot mínimo do produto (renderizável mesmo se o
 * catálogo mudar) + `productId`/`slug` para revalidar, e a variação escolhida.
 */
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  /** Preço unitário efetivo no momento em que foi adicionado */
  unitPrice: number;
  /** Preço cheio unitário (para exibir economia) */
  listPrice: number;
  quantity: number;
  /** Cor escolhida (variação com imagem própria) */
  color?: string;
  colorHex?: string;
  /** Outras opções: { Tamanho: "Queen", Tecido: "Linho" } */
  options?: Record<string, string>;
}

export interface CartTotals {
  itemsCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

export interface CartSelection {
  variant?: ProductVariant;
  options?: Record<string, string>;
}

/** Chave que identifica uma linha do carrinho (produto + cor + opções). */
export function cartLineKey(
  productId: string,
  color?: string,
  options?: Record<string, string>,
): string {
  return `${productId}::${color ?? ""}::${JSON.stringify(options ?? {})}`;
}

export function createCartItem(
  product: Product,
  quantity: number,
  selection: CartSelection = {},
): CartItem {
  const { variant, options } = selection;
  const { price, salePrice } = variantPrice(product, variant);
  const image =
    variant?.images?.[0] ?? product.images[0];

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image,
    unitPrice: salePrice ?? price,
    listPrice: price,
    quantity,
    color: variant?.color,
    colorHex: variant?.colorHex,
    options: options && Object.keys(options).length > 0 ? options : undefined,
  };
}
