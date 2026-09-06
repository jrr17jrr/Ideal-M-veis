"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/minha-conta";
  const { signIn, loading } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const err = await signIn(email, password);
    if (err) {
      setError(err);
      return;
    }
    toast.success("Bem-vindo de volta!");
    router.push(redirectTo);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="voce@email.com"
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        error={error ?? undefined}
      />

      <div className="flex justify-end">
        <Link
          href="/esqueci-senha"
          className="text-xs text-stone-500 underline-offset-2 hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Entrar
      </Button>

      <p className="text-center text-[11px] text-stone-400">
        Dica: qualquer e-mail válido e senha com 6+ caracteres funcionam nesta demo.
      </p>
    </form>
  );
}
