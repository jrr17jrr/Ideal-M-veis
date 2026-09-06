"use client";

import { cn } from "@/lib/cn";
import {
  formatCurrency,
  formatInstallment,
  pixPrice,
  PIX_DISCOUNT,
} from "@/lib/format";
import type { CartTotals } from "@/types";

interface Props {
  totals: CartTotals;
  shippingCost?: number | null;
  /** Sem o cartão externo (borda/título) — para embutir em outro bloco. */
  bare?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export function CartSummary({
  totals,
  shippingCost,
  bare = false,
  title = "Resumo",
  children,
}: Props) {
  const grandTotal = totals.total + (shippingCost ?? 0);

  return (
    <div
      className={cn(
        !bare && "rounded-2xl border border-stone-200 bg-white p-6",
      )}
    >
      {!bare && <h2 className="font-display text-lg text-stone-900">{title}</h2>}

      <dl className={cn("space-y-2.5 text-sm", !bare && "mt-4")}>
        <div className="flex justify-between">
          <dt className="text-stone-500">Subtotal</dt>
          <dd className="text-stone-900">{formatCurrency(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>Descontos</dt>
            <dd>-{formatCurrency(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-stone-500">Frete</dt>
          <dd className="text-stone-900">
            {shippingCost == null
              ? "a calcular"
              : shippingCost === 0
                ? "Grátis"
                : formatCurrency(shippingCost)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
        <span className="text-sm font-medium text-stone-900">Total</span>
        <span className="font-display text-2xl text-stone-900">
          {formatCurrency(grandTotal)}
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-500">{formatInstallment(grandTotal)}</p>
      <p className="mt-0.5 text-xs font-medium text-emerald-700">
        {formatCurrency(pixPrice(grandTotal))} no Pix (
        {Math.round(PIX_DISCOUNT * 100)}% off)
      </p>

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
