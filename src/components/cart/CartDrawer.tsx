"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";
import { cartLineKey } from "@/types";
import { formatCurrency, formatInstallment } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/data/shipping";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const { items, totals, isDrawerOpen, closeDrawer } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.total);
  const progress = Math.min(100, (totals.total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      title={`Sacola (${totals.itemsCount})`}
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-700">
                <span>Você economiza</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-stone-500">Subtotal</span>
              <span className="text-lg font-semibold text-stone-900">
                {formatCurrency(totals.total)}
              </span>
            </div>
            <p className="text-xs text-stone-500">{formatInstallment(totals.total)}</p>
            <Button href="/checkout" fullWidth onClick={closeDrawer}>
              Finalizar compra
            </Button>
            <Button href="/carrinho" variant="ghost" fullWidth onClick={closeDrawer}>
              Ver sacola completa
            </Button>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<BagIcon className="h-6 w-6" />}
            title="Sua sacola está vazia"
            description="Explore o catálogo e adicione peças que combinam com você."
            action={
              <Button href="/produtos" onClick={closeDrawer}>
                Ver produtos
              </Button>
            }
          />
        </div>
      ) : (
        <div className="px-5">
          <div className="py-4">
            {remaining > 0 ? (
              <p className="text-xs text-stone-600">
                Faltam <strong>{formatCurrency(remaining)}</strong> para frete
                grátis na entrega econômica
              </p>
            ) : (
              <p className="text-xs font-medium text-emerald-700">
                Você ganhou frete grátis na entrega econômica 🎉
              </p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-stone-100">
            {items.map((item) => (
              <li key={cartLineKey(item.productId, item.color, item.options)}>
                <CartLineItem item={item} compact onNavigate={closeDrawer} />
              </li>
            ))}
          </ul>

          <Link
            href="/produtos"
            onClick={closeDrawer}
            className="mb-4 mt-2 inline-block text-sm font-medium text-brand hover:underline"
          >
            Continuar comprando
          </Link>
        </div>
      )}
    </Drawer>
  );
}
