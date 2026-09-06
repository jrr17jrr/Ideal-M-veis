"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon, ShieldIcon } from "@/components/ui/icons";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";

export function CartPageContent() {
  const { items, totals, hydrated, clear } = useCart();

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon className="h-6 w-6" />}
        title="Sua sacola está vazia"
        description="Adicione produtos ao carrinho para continuar a compra."
        action={<Button href="/produtos">Explorar catálogo</Button>}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {totals.itemsCount} {totals.itemsCount === 1 ? "item" : "itens"}
          </p>
          <button
            onClick={clear}
            className="text-xs text-stone-500 underline-offset-2 hover:underline"
          >
            Esvaziar sacola
          </button>
        </div>

        <ul className="mt-2 divide-y divide-stone-200 border-y border-stone-200">
          {items.map((item) => (
            <li key={`${item.productId}-${JSON.stringify(item.options ?? {})}`}>
              <CartLineItem item={item} />
            </li>
          ))}
        </ul>

        <Link
          href="/produtos"
          className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
        >
          ← Continuar comprando
        </Link>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <CartSummary totals={totals}>
          <Button href="/checkout" fullWidth size="lg">
            Ir para o checkout
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-400">
            <ShieldIcon className="h-3.5 w-3.5" />
            Compra 100% segura
          </p>
        </CartSummary>
      </div>
    </div>
  );
}
