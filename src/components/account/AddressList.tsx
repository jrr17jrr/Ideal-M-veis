"use client";

import { mockAddresses } from "@/data/user";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export function AddressList() {
  const toast = useToast();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {mockAddresses.map((addr) => (
          <div
            key={addr.id}
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-900">
                {addr.label}
              </span>
              {addr.isDefault && <Badge tone="neutral">Padrão</Badge>}
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {addr.street}, {addr.number}
              {addr.complement ? ` — ${addr.complement}` : ""}
              <br />
              {addr.district} · {addr.city}/{addr.state}
              <br />
              CEP {addr.zipCode}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.notify("Edição de endereço — em breve.")}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast.notify("Remoção de endereço — em breve.")}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => toast.notify("Cadastro de endereço — em breve.")}
      >
        + Adicionar endereço
      </Button>

      <p className="text-xs text-stone-400">
        Dados de exemplo. No futuro virão da tabela <code>addresses</code> do
        Supabase.
      </p>
    </div>
  );
}
