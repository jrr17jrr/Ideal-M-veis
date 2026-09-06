import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressList } from "@/components/account/AddressList";

export const metadata: Metadata = {
  title: "Endereços",
  robots: { index: false, follow: false },
};

export default function EnderecosPage() {
  return (
    <AccountShell title="Endereços">
      <AddressList />
    </AccountShell>
  );
}
