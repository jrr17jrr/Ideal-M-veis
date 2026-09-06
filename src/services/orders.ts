/**
 * Serviço de pedidos.
 *
 * HOJE: lê pedidos fictícios de `src/data/orders.ts` e "cria" pedidos apenas
 *       em memória / sessionStorage (para a tela de confirmação do checkout).
 *
 * FUTURO: `orders` + `order_items` no Supabase. A criação real do pedido
 *         acontecerá no servidor (Route Handler de pagamento), não aqui.
 */
import { mockOrders, getOrderById } from "@/data/orders";
import type {
  CartItem,
  CheckoutDraft,
  Order,
  OrderItem,
  Payment,
} from "@/types";
import { SHIPPING_OPTIONS } from "@/data/shipping";
import { mockCustomer } from "@/data/user";

const SESSION_KEY = "atelier.lastOrder.v1";

export async function listOrders(): Promise<Order[]> {
  return [...mockOrders].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function getOrder(idOrNumber: string): Promise<Order | null> {
  const fromSession = readLastOrder();
  if (
    fromSession &&
    (fromSession.id === idOrNumber || fromSession.number === idOrNumber)
  ) {
    return fromSession;
  }
  return getOrderById(idOrNumber) ?? null;
}

function cartItemToOrderItem(item: CartItem): OrderItem {
  return {
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    image: item.image,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    options: item.options,
  };
}

/**
 * Monta o objeto Order localmente para exibir na tela de "pedido confirmado".
 * NÃO persiste em banco — só em sessionStorage.
 */
export function buildLocalOrder(params: {
  orderId: string;
  orderNumber: string;
  draft: CheckoutDraft;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  payment: Payment;
}): Order {
  const shippingOption =
    SHIPPING_OPTIONS.find((o) => o.id === params.draft.shippingOptionId) ??
    SHIPPING_OPTIONS[1];

  const order: Order = {
    id: params.orderId,
    number: params.orderNumber,
    createdAt: new Date().toISOString(),
    status:
      params.payment.method === "pix" ? "payment_pending" : "payment_approved",
    customer: {
      ...mockCustomer,
      firstName: params.draft.identification.firstName,
      lastName: params.draft.identification.lastName,
      email: params.draft.identification.email,
      phone: params.draft.identification.phone,
      cpf: params.draft.identification.cpf,
    },
    shippingAddress: { ...params.draft.address, id: "addr-checkout" },
    shippingOption,
    items: params.items.map(cartItemToOrderItem),
    subtotal: params.subtotal,
    discount: params.discount,
    shippingCost: params.shippingCost,
    total: params.subtotal - params.discount + params.shippingCost,
    payment: params.payment,
  };
  return order;
}

export function saveLastOrder(order: Order): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function readLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
