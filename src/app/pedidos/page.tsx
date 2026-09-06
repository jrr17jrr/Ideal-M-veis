import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { OrdersList } from "@/components/account/OrdersList";

export const metadata: Metadata = {
  title: "Meus pedidos",
  robots: { index: false, follow: false },
};

export default function PedidosPage() {
  return (
    <AccountShell title="Meus pedidos">
      <OrdersList />
    </AccountShell>
  );
}
