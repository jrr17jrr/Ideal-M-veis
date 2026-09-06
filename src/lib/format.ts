/** Formatação de valores para pt-BR. */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number): string {
  return BRL.format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Percentual de desconto arredondado (ex.: 23 -> "-23%"). */
export function discountPercent(price: number, salePrice?: number): number | null {
  if (!salePrice || salePrice >= price) return null;
  return Math.round((1 - salePrice / price) * 100);
}

export const MAX_INSTALLMENTS = 12;
/** Valor mínimo de parcela sem juros (regra comum de e-commerce). */
export const MIN_INSTALLMENT_VALUE = 100;

export interface InstallmentInfo {
  count: number;
  value: number;
}

/**
 * Calcula o melhor parcelamento "sem juros" para um valor.
 * Regra mockada: até 12x, respeitando parcela mínima de R$100.
 */
export function bestInstallment(total: number): InstallmentInfo {
  if (total <= 0) return { count: 1, value: 0 };
  const maxByValue = Math.floor(total / MIN_INSTALLMENT_VALUE);
  const count = Math.max(1, Math.min(MAX_INSTALLMENTS, maxByValue || 1));
  return { count, value: total / count };
}

export function formatInstallment(total: number): string {
  const { count, value } = bestInstallment(total);
  if (count <= 1) return `${formatCurrency(total)} à vista`;
  return `em até ${count}x de ${formatCurrency(value)} sem juros`;
}

/** Desconto à vista / Pix (mockado). */
export const PIX_DISCOUNT = 0.1;

export function pixPrice(total: number): number {
  return total * (1 - PIX_DISCOUNT);
}
