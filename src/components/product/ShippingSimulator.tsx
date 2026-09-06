"use client";

import { useState } from "react";
import { maskCEP } from "@/lib/masks";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { MapPinIcon } from "@/components/ui/icons";
import { simulateShipping } from "@/services/shipping";
import type { ShippingOption } from "@/types";

/**
 * Simulação de frete — hoje 100% mockada (`services/shipping.ts`).
 * A função já recebe CEP + valor, formato compatível com API real.
 */
export function ShippingSimulator({ price }: { price: number }) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const quote = await simulateShipping({
      cep,
      items: [],
      subtotal: price,
    });
    setLoading(false);
    if (quote.options.length === 0) {
      setError("Digite um CEP válido (8 números).");
      setOptions(null);
      return;
    }
    setOptions(quote.options);
  }

  return (
    <div className="rounded-xl border border-stone-200 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-stone-900">
        <MapPinIcon className="h-4 w-4 text-brand" />
        Calcular frete e prazo
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(maskCEP(e.target.value))}
          inputMode="numeric"
          placeholder="00000-000"
          aria-label="Seu CEP"
          className="h-11 w-36 rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-stone-900"
        />
        <Button type="submit" variant="outline" loading={loading}>
          Calcular
        </Button>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="self-center text-xs text-stone-400 underline-offset-2 hover:underline"
        >
          Não sei meu CEP
        </a>
      </form>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {options && (
        <ul className="mt-3 divide-y divide-stone-100 border-t border-stone-100">
          {options.map((o) => (
            <li key={o.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium text-stone-900">{o.label}</p>
                <p className="text-xs text-stone-500">
                  {o.description} · até {o.etaDays} dias úteis
                </p>
              </div>
              <span className="font-medium text-stone-900">
                {o.price === 0 ? "Grátis" : formatCurrency(o.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-stone-400">
        Valores simulados para demonstração. A integração com a transportadora
        será feita depois.
      </p>
    </div>
  );
}
