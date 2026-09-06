import type { Address, Customer } from "./user";

/**
 * Entidades de pedido / pagamento / frete.
 *
 * Mapeiam para as futuras tabelas do Supabase:
 *  - `orders`       -> Order
 *  - `order_items`  -> OrderItem
 *  - `payments`     -> Payment
 */

export type OrderStatus =
  | "payment_pending"
  | "payment_approved"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  payment_pending: "Pagamento pendente",
  payment_approved: "Pagamento aprovado",
  processing: "Em separação",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
};

export type PaymentMethod = "pix" | "credit_card";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "refunded";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options?: Record<string, string>;
}

export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  price: number;
  /** Prazo estimado em dias úteis */
  etaDays: number;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  installments: number;
  /** Preenchido pelo Mercado Pago no futuro (id da transação) */
  providerPaymentId?: string;
  /** Só para Pix — payload copia-e-cola / QR (mockado) */
  pixCode?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  customer: Customer;
  shippingAddress: Address;
  shippingOption: ShippingOption;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  payment: Payment;
}

/* ---------- Payload de criação (checkout -> serviço) ---------- */

export interface CheckoutIdentification {
  firstName: string;
  lastName: string;
  cpf: string;
  email: string;
  phone: string;
}

export interface CheckoutDraft {
  identification: CheckoutIdentification;
  address: Omit<Address, "id">;
  shippingOptionId: string;
  paymentMethod: PaymentMethod;
  installments: number;
}
