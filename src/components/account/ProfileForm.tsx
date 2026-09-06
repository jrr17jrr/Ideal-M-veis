"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { maskCPF, maskPhone } from "@/lib/masks";
import { mockCustomer } from "@/data/user";

export function ProfileForm() {
  const { user } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? mockCustomer.firstName,
    lastName: user?.lastName ?? mockCustomer.lastName,
    email: user?.email ?? mockCustomer.email,
    phone: mockCustomer.phone ?? "",
    cpf: mockCustomer.cpf ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Futuro: supabase.from("profiles").update(...).eq("id", user.id)
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Dados atualizados (simulado).");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-lg space-y-4 rounded-2xl border border-stone-200 bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        <Input label="Sobrenome" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
      </div>
      <Input label="E-mail" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Telefone"
          value={form.phone}
          onChange={(e) => set("phone", maskPhone(e.target.value))}
        />
        <Input
          label="CPF"
          value={form.cpf}
          onChange={(e) => set("cpf", maskCPF(e.target.value))}
        />
      </div>
      <div className="pt-2">
        <Button type="submit" loading={saving}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
