/**
 * Serviço de frete e CEP.
 *
 * HOJE: tudo mockado no front.
 *   - `lookupAddressByCEP` devolve um endereço fake determinístico.
 *   - `simulateShipping` devolve as opções fixas de `data/shipping.ts`,
 *     aplicando frete grátis acima de um limite.
 *
 * FUTURO:
 *   - `lookupAddressByCEP` -> ViaCEP / BrasilAPI (`https://viacep.com.br/ws/<cep>/json/`).
 *   - `simulateShipping`   -> API dos Correios / Melhor Envio / frete próprio,
 *     provavelmente via Route Handler em `app/api/shipping/`.
 *
 * As assinaturas já recebem o que a API real precisa (CEP + itens + subtotal).
 */
import { SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD } from "@/data/shipping";
import { isValidCEP, onlyDigits } from "@/lib/masks";
import type { CartItem } from "@/types";
import type { ShippingOption } from "@/types";

export interface AddressLookup {
  street: string;
  district: string;
  city: string;
  state: string;
  error: string | null;
}

const DELAY = 600;
const wait = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), DELAY));

/** Base fake de bairros/cidades por prefixo de CEP, só para dar realismo. */
const CEP_SEED: Record<string, Omit<AddressLookup, "error">> = {
  "01": { street: "Rua da Consolação", district: "Consolação", city: "São Paulo", state: "SP" },
  "04": { street: "Rua Vergueiro", district: "Vila Mariana", city: "São Paulo", state: "SP" },
  "20": { street: "Avenida Rio Branco", district: "Centro", city: "Rio de Janeiro", state: "RJ" },
  "30": { street: "Avenida Afonso Pena", district: "Centro", city: "Belo Horizonte", state: "MG" },
  "40": { street: "Avenida Sete de Setembro", district: "Vitória", city: "Salvador", state: "BA" },
  "80": { street: "Rua XV de Novembro", district: "Centro", city: "Curitiba", state: "PR" },
  "90": { street: "Avenida Borges de Medeiros", district: "Centro Histórico", city: "Porto Alegre", state: "RS" },
};

export async function lookupAddressByCEP(cep: string): Promise<AddressLookup> {
  if (!isValidCEP(cep)) {
    return wait({
      street: "",
      district: "",
      city: "",
      state: "",
      error: "CEP inválido. Digite os 8 números.",
    });
  }
  const prefix = onlyDigits(cep).slice(0, 2);
  const seed = CEP_SEED[prefix] ?? {
    street: "Rua das Acácias",
    district: "Jardim Primavera",
    city: "Campinas",
    state: "SP",
  };
  return wait({ ...seed, error: null });
}

export interface ShippingQuote {
  options: ShippingOption[];
  freeShipping: boolean;
}

export async function simulateShipping(params: {
  cep: string;
  items: CartItem[];
  subtotal: number;
}): Promise<ShippingQuote> {
  const { cep, subtotal } = params;
  if (!isValidCEP(cep)) {
    return wait({ options: [], freeShipping: false });
  }

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  // Pequena variação por região só para não parecer estático.
  const regionFactor =
    onlyDigits(cep).startsWith("0") || onlyDigits(cep).startsWith("1")
      ? 1
      : 1.35;

  const options = SHIPPING_OPTIONS.map((o) => ({
    ...o,
    price: freeShipping && o.id === "economic" ? 0 : Number((o.price * regionFactor).toFixed(2)),
    etaDays: Math.round(o.etaDays * regionFactor),
  }));

  return wait({ options, freeShipping });
}
