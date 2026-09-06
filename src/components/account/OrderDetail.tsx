"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Order } from "@/types";
import { getOrder } from "@/services/orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const TIMELINE: OrderStatus[] = [
  "payment_approved",
  "processing",
  "shipped",
  "delivered",
];

export function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    getOrder(id).then((o) => setOrder(o));
  }, [id]);

  if (order === undefined) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  if (!order) {
    return (
      <EmptyState
        title="Pedido não encontrado"
        description="Verifique o número do pedido ou volte para a lista."
        action={<Button href="/pedidos">Ver meus pedidos</Button>}
      />
    );
  }

  const currentIdx =
    order.status === "payment_pending"
      ? -1
      : TIMELINE.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link href="/pedidos" className="text-sm text-brand hover:underline">
        ← Voltar aos pedidos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl text-stone-900">Pedido {order.number}</h2>
          <p className="text-xs text-stone-500">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Linha do tempo */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        {order.status === "payment_pending" ? (
          <p className="text-sm text-amber-700">
            Aguardando confirmação do pagamento{" "}
            {order.payment.method === "pix" ? "via Pix" : "no cartão"}.
          </p>
        ) : (
          <ol className="flex items-center">
            {TIMELINE.map((status, i) => {
              const reached = i <= currentIdx;
              return (
                <li key={status} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "flex h-3 w-3 rounded-full",
                        reached ? "bg-stone-900" : "bg-stone-300",
                      )}
                    />
                    <span
                      className={cn(
                        "max-w-16 text-center text-[11px] leading-tight",
                        reached ? "text-stone-900" : "text-stone-400",
                      )}
                    >
                      {ORDER_STATUS_LABEL[status]}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <span
                      className={cn(
                        "mx-1 h-px flex-1",
                        i < currentIdx ? "bg-stone-900" : "bg-stone-300",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Itens */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="font-display text-base text-stone-900">Itens</h3>
        <ul className="mt-3 divide-y divide-stone-100">
          {order.items.map((item) => (
            <li key={item.productId} className="flex gap-3 py-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/produto/${item.slug}`}
                  className="line-clamp-2 text-sm font-medium text-stone-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-stone-500">
                  Qtd. {item.quantity}
                  {item.options
                    ? ` · ${Object.values(item.options).join(" · ")}`
                    : ""}
                </p>
              </div>
              <span className="text-sm font-medium text-stone-900">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm">
          <h3 className="font-display text-base text-stone-900">Entrega</h3>
          <p className="mt-2 text-stone-600">
            {order.shippingAddress.recipient}
            <br />
            {order.shippingAddress.street}, {order.shippingAddress.number}
            {order.shippingAddress.complement
              ? ` — ${order.shippingAddress.complement}`
              : ""}
            <br />
            {order.shippingAddress.district} · {order.shippingAddress.city}/
            {order.shippingAddress.state}
            <br />
            CEP {order.shippingAddress.zipCode}
          </p>
          <p className="mt-3 text-stone-600">
            {order.shippingOption.label} — até {order.shippingOption.etaDays} dias
            úteis
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm">
          <h3 className="font-display text-base text-stone-900">Pagamento</h3>
          <p className="mt-2 text-stone-600">
            {order.payment.method === "pix"
              ? "Pix"
              : `Cartão de crédito · ${order.payment.installments}x`}
          </p>
          <dl className="mt-3 space-y-1.5">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            {order.discount > 0 && (
              <Row label="Descontos" value={`-${formatCurrency(order.discount)}`} />
            )}
            <Row
              label="Frete"
              value={
                order.shippingCost === 0
                  ? "Grátis"
                  : formatCurrency(order.shippingCost)
              }
            />
            <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex gap-3">
        <Button href="/produtos" variant="outline" size="sm">
          Comprar novamente
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-stone-600">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
