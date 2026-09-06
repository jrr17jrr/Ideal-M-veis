import type { Product } from "./product";

/**
 * Item do carrinho. Guardamos um snapshot mínimo do produto para que o
 * carrinho continue renderizável mesmo se o catálogo mudar, mas mantemos
 * `productId`/`slug` para revalidar preço e estoque quando necessário.
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
  /** Variação escolhida, ex.: { Cor: "Bege", Tamanho: "2,00m" } */
  options?: Record<string, string>;
}

export interface CartTotals {
  itemsCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

export function createCartItem(
  product: Product,
  quantity: number,
  options?: Record<string, string>,
): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    unitPrice: product.salePrice ?? product.price,
    listPrice: product.price,
    quantity,
    options,
  };
}
