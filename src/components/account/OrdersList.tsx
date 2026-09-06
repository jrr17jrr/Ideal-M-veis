"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Order } from "@/types";
import { listOrders, readLastOrder } from "@/services/orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageIcon } from "@/components/ui/icons";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    listOrders().then((list) => {
      const last = readLastOrder();
      const merged =
        last && !list.some((o) => o.id === last.id) ? [last, ...list] : list;
      setOrders(merged);
    });
  }, []);

  if (orders === null) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<PackageIcon className="h-6 w-6" />}
        title="Você ainda não tem pedidos"
        description="Quando finalizar uma compra, ela aparece aqui."
        action={<Button href="/produtos">Começar a comprar</Button>}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-2xl border border-stone-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <p className="text-sm font-medium text-stone-900">
                Pedido {order.number}
              </p>
              <p className="text-xs text-stone-500">
                {formatDate(order.createdAt)} · {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "itens"}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center gap-2 py-4">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.productId}
                className="relative h-14 w-14 overflow-hidden rounded-lg bg-stone-100"
              >
                <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
            ))}
            {order.items.length > 4 && (
              <span className="text-xs text-stone-500">
                +{order.items.length - 4}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
            <p className="text-sm">
              <span className="text-stone-500">Total: </span>
              <span className="font-semibold text-stone-900">
                {formatCurrency(order.total)}
              </span>
            </p>
            <Button href={`/pedido/${order.id}`} variant="outline" size="sm">
              Ver detalhes
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
