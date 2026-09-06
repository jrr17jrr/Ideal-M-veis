import type { ShippingOption } from "@/types";

/**
 * Opções de frete mockadas.
 *
 * Futuro: substituir por cálculo real (Correios / transportadora / frete
 * próprio) dentro de `src/services/shipping.ts`. A assinatura da função de
 * serviço já está preparada para receber CEP + itens.
 */
export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "economic",
    label: "Econômica",
    description: "Transportadora parceira",
    price: 129.9,
    etaDays: 12,
  },
  {
    id: "standard",
    label: "Padrão",
    description: "Entrega agendada",
    price: 189.9,
    etaDays: 7,
  },
  {
    id: "express",
    label: "Expressa",
    description: "Prioritária, com montagem",
    price: 349.9,
    etaDays: 3,
  },
];

/** Frete grátis acima deste valor (regra mockada). */
export const FREE_SHIPPING_THRESHOLD = 4000;
