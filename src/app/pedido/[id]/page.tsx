import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderDetail } from "@/components/account/OrderDetail";

export const metadata: Metadata = {
  title: "Detalhes do pedido",
  robots: { index: false, follow: false },
};

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AccountShell title="Detalhes do pedido">
      <OrderDetail id={id} />
    </AccountShell>
  );
}
