"use client";

import Link from "next/link";
import type { Order } from "@/types";
import { formatCurrency } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/types";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

export function OrderConfirmation({ order }: { order: Order }) {
  const isPix = order.payment.method === "pix";

  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckIcon className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl text-stone-900">Pedido recebido!</h1>
      <p className="mt-2 text-sm text-stone-500">
        Pedido <strong className="text-stone-900">{order.number}</strong> ·{" "}
        {ORDER_STATUS_LABEL[order.status]}
      </p>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-left">
        {isPix ? (
          <div>
            <p className="text-sm font-medium text-stone-900">
              Pague com Pix para confirmar
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Valor com desconto: {formatCurrency(order.payment.amount)}
            </p>
            <div className="mt-4 rounded-lg bg-stone-100 p-4">
              <p className="break-all font-mono text-[11px] text-stone-600">
                {order.payment.pixCode}
              </p>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              (Simulação) Em produção, o pagamento seria confirmado por webhook do
              Mercado Pago e o status do pedido atualizado automaticamente.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-stone-900">
              Pagamento aprovado
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {order.payment.installments}x de{" "}
              {formatCurrency(order.payment.amount / order.payment.installments)} no
              cartão · total {formatCurrency(order.payment.amount)}
            </p>
          </div>
        )}

        <div className="mt-5 space-y-1 border-t border-stone-200 pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Entrega</span>
            <span className="text-stone-900">
              {order.shippingOption.label} · até {order.shippingOption.etaDays} dias
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Endereço</span>
            <span className="max-w-[60%] text-right text-stone-900">
              {order.shippingAddress.street}, {order.shippingAddress.number} —{" "}
              {order.shippingAddress.city}/{order.shippingAddress.state}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={`/pedido/${order.id}`}>Ver detalhes do pedido</Button>
        <Button href="/produtos" variant="outline">
          Continuar comprando
        </Button>
      </div>

      <p className="mt-6 text-xs text-stone-400">
        Um e-mail de confirmação foi enviado para{" "}
        {order.customer.email} (simulado).{" "}
        <Link href="/pedidos" className="underline underline-offset-2">
          Ver todos os pedidos
        </Link>
      </p>
    </div>
  );
}
