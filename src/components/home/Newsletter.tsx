"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { isValidEmail } from "@/lib/masks";

export function Newsletter() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Digite um e-mail válido.");
      return;
    }
    setLoading(true);
    // Mock: no futuro grava em `newsletter_subscribers` (Supabase).
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setDone(true);
    toast.success("Pronto! Você receberá nossas novidades.");
    setEmail("");
  }

  return (
    <section className="border-t border-stone-200 bg-canvas">
      <Container className="flex flex-col items-center gap-6 py-14 text-center md:flex-row md:justify-between md:text-left">
        <div className="max-w-md">
          <h2 className="text-2xl text-stone-900">Receba 10% na primeira compra</h2>
          <p className="mt-2 text-sm text-stone-500">
            Assine a newsletter e seja o primeiro a saber de lançamentos, guias
            de decoração e ofertas exclusivas.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            aria-label="E-mail para newsletter"
            className="h-12 flex-1 rounded-full border border-stone-300 bg-white px-5 text-sm outline-none focus:border-stone-900"
          />
          <Button type="submit" loading={loading} disabled={done}>
            {done ? "Inscrito" : "Quero receber"}
          </Button>
        </form>
      </Container>
    </section>
  );
}
