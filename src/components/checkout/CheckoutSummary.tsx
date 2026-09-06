"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/format";
import { CartSummary } from "@/components/cart/CartSummary";

export function CheckoutSummary({
  shippingCost,
}: {
  shippingCost?: number | null;
}) {
  const { items, totals } = useCart();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg text-stone-900">Seu pedido</h2>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={`${item.productId}-${JSON.stringify(item.options ?? {})}`}
            className="flex gap-3"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
              <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-medium text-stone-900">
                {item.name}
              </p>
              {item.options && (
                <p className="text-[11px] text-stone-500">
                  {Object.values(item.options).join(" · ")}
                </p>
              )}
            </div>
            <span className="text-xs font-medium text-stone-900">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-stone-200 pt-5">
        <CartSummary totals={totals} shippingCost={shippingCost} bare />
      </div>
    </div>
  );
}
