import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: true },
};

export default function EsqueciSenhaPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link de redefinição para o seu e-mail."
      footer={
        <>
          Lembrou a senha?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Voltar para o login
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
