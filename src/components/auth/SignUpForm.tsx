"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function SignUpForm() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const err = await signUp(form);
    if (err) {
      setError(err);
      return;
    }
    toast.success("Conta criada com sucesso!");
    router.push("/minha-conta");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nome"
          required
          value={form.firstName}
          onChange={(e) => set("firstName", e.target.value)}
        />
        <Input
          label="Sobrenome"
          required
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
        />
      </div>
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="new-password"
        required
        value={form.password}
        onChange={(e) => set("password", e.target.value)}
        hint="Mínimo de 6 caracteres"
        error={error ?? undefined}
      />

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Criar conta
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-stone-400">
        Ao criar a conta você concorda com os Termos de Uso e a Política de
        Privacidade (páginas de exemplo).
      </p>
    </form>
  );
}
