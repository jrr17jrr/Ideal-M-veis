import type { Order } from "@/types";
import { mockCustomer, mockAddresses } from "./user";
import { SHIPPING_OPTIONS } from "./shipping";

/**
 * Pedidos fictícios da área do cliente.
 * Futuro: tabelas `orders`, `order_items`, `payments`.
 */
export const mockOrders: Order[] = [
  {
    id: "ord-1042",
    number: "#10042",
    createdAt: "2026-08-21T10:12:00.000Z",
    status: "delivered",
    customer: mockCustomer,
    shippingAddress: mockAddresses[0],
    shippingOption: SHIPPING_OPTIONS[1],
    items: [
      {
        productId: "p-001",
        slug: "sofa-retratil-copenhague-3-lugares",
        name: "Sofá Retrátil e Reclinável Copenhague 3 Lugares",
        image: "/images/products/sofa-retratil-copenhague-3-lugares-1.svg",
        unitPrice: 3990,
        quantity: 1,
        options: { Cor: "Cinza", Tamanho: "2,20 m (3 lug.)" },
      },
      {
        productId: "p-010",
        slug: "mesa-centro-tokyo-redonda",
        name: "Mesa de Centro Tokyo Redonda",
        image: "/images/products/mesa-centro-tokyo-redonda-1.svg",
        unitPrice: 1290,
        quantity: 1,
      },
    ],
    subtotal: 6280,
    discount: 1500,
    shippingCost: 189.9,
    total: 6469.9,
    payment: {
      id: "pay-1042",
      method: "credit_card",
      status: "approved",
      amount: 6469.9,
      installments: 10,
      providerPaymentId: "mp_demo_1042",
      createdAt: "2026-08-21T10:12:30.000Z",
    },
  },
  {
    id: "ord-1067",
    number: "#10067",
    createdAt: "2026-08-30T18:45:00.000Z",
    status: "shipped",
    customer: mockCustomer,
    shippingAddress: mockAddresses[0],
    shippingOption: SHIPPING_OPTIONS[2],
    items: [
      {
        productId: "p-024",
        slug: "cadeira-escritorio-ergonomica-ergo-pro",
        name: "Cadeira de Escritório Ergonômica Ergo Pro",
        image: "/images/products/cadeira-escritorio-ergonomica-ergo-pro-1.svg",
        unitPrice: 1590,
        quantity: 2,
        options: { Cor: "Preto" },
      },
    ],
    subtotal: 3180,
    discount: 800,
    shippingCost: 349.9,
    total: 3529.9,
    payment: {
      id: "pay-1067",
      method: "pix",
      status: "approved",
      amount: 3176.91,
      installments: 1,
      pixCode: "00020126360014BR.GOV.BCB.PIX0114+55119888812345204000053039865802BR5920IDEAL MOVEIS LTDA6009SAO PAULO62070503***6304ABCD",
      createdAt: "2026-08-30T18:46:10.000Z",
    },
  },
  {
    id: "ord-1090",
    number: "#10090",
    createdAt: "2026-09-04T09:05:00.000Z",
    status: "processing",
    customer: mockCustomer,
    shippingAddress: mockAddresses[1],
    shippingOption: SHIPPING_OPTIONS[0],
    items: [
      {
        productId: "p-013",
        slug: "kit-2-cadeiras-wishbone-trigo",
        name: "Kit 2 Cadeiras Wishbone Trigo",
        image: "/images/products/kit-2-cadeiras-wishbone-trigo-1.svg",
        unitPrice: 1490,
        quantity: 2,
        options: { Cor: "Natural" },
      },
      {
        productId: "p-027",
        slug: "espelho-redondo-sol-80",
        name: "Espelho Redondo Sol Ø 80 cm",
        image: "/images/products/espelho-redondo-sol-80-1.svg",
        unitPrice: 690,
        quantity: 1,
        options: { Cor: "Dourado" },
      },
    ],
    subtotal: 3670,
    discount: 580,
    shippingCost: 129.9,
    total: 3219.9,
    payment: {
      id: "pay-1090",
      method: "credit_card",
      status: "pending",
      amount: 3219.9,
      installments: 6,
      createdAt: "2026-09-04T09:05:40.000Z",
    },
  },
];

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id || o.number === id);
}
