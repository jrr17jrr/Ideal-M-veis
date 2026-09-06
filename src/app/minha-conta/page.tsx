import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "Meus dados",
  robots: { index: false, follow: false },
};

export default function MinhaContaPage() {
  return (
    <AccountShell title="Meus dados">
      <ProfileForm />
    </AccountShell>
  );
}
