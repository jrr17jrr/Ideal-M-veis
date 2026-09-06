"use client";

import { useEffect, useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  maskCEP,
  maskCPF,
  maskPhone,
  maskCardNumber,
  maskCardExpiry,
  maskCVV,
  isValidCEP,
} from "@/lib/masks";
import {
  bestInstallment,
  formatCurrency,
  formatInstallment,
  pixPrice,
  PIX_DISCOUNT,
} from "@/lib/format";
import { lookupAddressByCEP, simulateShipping } from "@/services/shipping";
import type { ShippingOption } from "@/types";
import { CreditCardIcon, MapPinIcon } from "@/components/ui/icons";
import {
  validateIdentification,
  validateDelivery,
  validateCard,
  hasErrors,
  type CheckoutState,
  type Errors,
  type IdentificationForm,
  type DeliveryForm,
  type CardForm,
} from "./checkoutTypes";

const BR_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

/* ------------------------- Etapa 1 — Identificação ------------------------- */

export function IdentificationStep({
  value,
  onChange,
  onNext,
}: {
  value: IdentificationForm;
  onChange: (patch: Partial<IdentificationForm>) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Errors<IdentificationForm>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateIdentification(value);
    setErrors(errs);
    if (!hasErrors(errs)) onNext();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nome"
          value={value.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          error={errors.firstName}
        />
        <Input
          label="Sobrenome"
          value={value.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="CPF"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={value.cpf}
          onChange={(e) => onChange({ cpf: maskCPF(e.target.value) })}
          error={errors.cpf}
        />
        <Input
          label="Telefone / WhatsApp"
          inputMode="numeric"
          placeholder="(00) 00000-0000"
          value={value.phone}
          onChange={(e) => onChange({ phone: maskPhone(e.target.value) })}
          error={errors.phone}
        />
      </div>
      <Input
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        value={value.email}
        onChange={(e) => onChange({ email: e.target.value })}
        error={errors.email}
        hint="Enviaremos a confirmação e o rastreio para este e-mail."
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg">
          Continuar para entrega
        </Button>
      </div>
    </form>
  );
}

/* ---------------------------- Etapa 2 — Entrega --------------------------- */

export function DeliveryStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: DeliveryForm;
  onChange: (patch: Partial<DeliveryForm>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Errors<DeliveryForm>>({});
  const [lookingUp, setLookingUp] = useState(false);

  async function handleCep(raw: string) {
    const masked = maskCEP(raw);
    onChange({ zipCode: masked });
    if (isValidCEP(masked)) {
      setLookingUp(true);
      const res = await lookupAddressByCEP(masked);
      setLookingUp(false);
      if (!res.error) {
        onChange({
          street: res.street,
          district: res.district,
          city: res.city,
          state: res.state,
        });
      }
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateDelivery(value);
    setErrors(errs);
    if (!hasErrors(errs)) onNext();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <Input
          label="CEP"
          inputMode="numeric"
          placeholder="00000-000"
          value={value.zipCode}
          onChange={(e) => handleCep(e.target.value)}
          error={errors.zipCode}
          hint={lookingUp ? "Buscando endereço…" : undefined}
        />
      </div>
      <Input
        label="Rua / Logradouro"
        value={value.street}
        onChange={(e) => onChange({ street: e.target.value })}
        error={errors.street}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Número"
          value={value.number}
          onChange={(e) => onChange({ number: e.target.value })}
          error={errors.number}
        />
        <Input
          label="Complemento (opcional)"
          value={value.complement}
          onChange={(e) => onChange({ complement: e.target.value })}
        />
      </div>
      <Input
        label="Bairro"
        value={value.district}
        onChange={(e) => onChange({ district: e.target.value })}
        error={errors.district}
      />
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Input
          label="Cidade"
          value={value.city}
          onChange={(e) => onChange({ city: e.target.value })}
          error={errors.city}
        />
        <Select
          label="Estado"
          value={value.state}
          onChange={(e) => onChange({ state: e.target.value })}
          error={errors.state}
        >
          <option value="">UF</option>
          {BR_STATES.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </Select>
      </div>

      <p className="rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-500">
        O endereço é preenchido automaticamente a partir do CEP (dados simulados).
      </p>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" size="lg">
          Escolher frete
        </Button>
      </div>
    </form>
  );
}

/* ----------------------------- Etapa 3 — Frete --------------------------- */

export function ShippingStep({
  zipCode,
  subtotal,
  selectedId,
  onSelect,
  onNext,
  onBack,
}: {
  zipCode: string;
  subtotal: number;
  selectedId: string | null;
  onSelect: (option: ShippingOption) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [options, setOptions] = useState<ShippingOption[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    simulateShipping({ cep: zipCode, items: [], subtotal }).then((q) => {
      if (!active) return;
      setOptions(q.options);
      setLoading(false);
      if (q.options[0] && !selectedId) onSelect(q.options[0]);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode, subtotal]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <MapPinIcon className="h-4 w-4" />
        Entregar em <strong className="text-stone-900">{zipCode}</strong>
      </div>

      {loading || !options ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {options.map((o) => {
            const active = selectedId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => onSelect(o)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-stone-900 bg-stone-50"
                    : "border-stone-200 hover:border-stone-400",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border",
                      active ? "border-stone-900" : "border-stone-300",
                    )}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-stone-900" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">{o.label}</p>
                    <p className="text-xs text-stone-500">
                      {o.description} · até {o.etaDays} dias úteis
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  {o.price === 0 ? "Grátis" : formatCurrency(o.price)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button size="lg" disabled={!selectedId} onClick={onNext}>
          Ir para o pagamento
        </Button>
      </div>
    </div>
  );
}

/* --------------------------- Etapa 4 — Pagamento ------------------------- */

export function PaymentStep({
  state,
  onChange,
  onCardChange,
  total,
  onSubmit,
  onBack,
  submitting,
}: {
  state: CheckoutState;
  onChange: (patch: Partial<CheckoutState>) => void;
  onCardChange: (patch: Partial<CardForm>) => void;
  total: number;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const [cardErrors, setCardErrors] = useState<Errors<CardForm>>({});
  const maxInstallments = bestInstallment(total).count;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state.paymentMethod === "credit_card") {
      const errs = validateCard(state.card);
      setCardErrors(errs);
      if (hasErrors(errs)) return;
    }
    onSubmit();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <MethodButton
          active={state.paymentMethod === "pix"}
          onClick={() => onChange({ paymentMethod: "pix" })}
          title="Pix"
          subtitle={`${Math.round(PIX_DISCOUNT * 100)}% de desconto · aprovação na hora`}
        />
        <MethodButton
          active={state.paymentMethod === "credit_card"}
          onClick={() => onChange({ paymentMethod: "credit_card" })}
          title="Cartão de crédito"
          subtitle={`em até ${maxInstallments}x sem juros`}
          icon={<CreditCardIcon className="h-5 w-5" />}
        />
      </div>

      {state.paymentMethod === "pix" ? (
        <div className="rounded-xl border border-stone-200 p-4 text-sm text-stone-600">
          <p>
            Ao finalizar, geraremos um <strong>QR Code Pix</strong> de{" "}
            <strong className="text-emerald-700">{formatCurrency(pixPrice(total))}</strong>{" "}
            (com desconto). O pagamento é confirmado automaticamente.
          </p>
          <p className="mt-2 text-xs text-stone-400">
            Nesta demonstração o Pix é apenas simulado — nenhum valor é cobrado.
          </p>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-stone-200 p-4">
          <Input
            label="Número do cartão"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={state.card.number}
            onChange={(e) => onCardChange({ number: maskCardNumber(e.target.value) })}
            error={cardErrors.number}
          />
          <Input
            label="Nome impresso no cartão"
            value={state.card.holder}
            onChange={(e) => onCardChange({ holder: e.target.value.toUpperCase() })}
            error={cardErrors.holder}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Validade"
              placeholder="MM/AA"
              inputMode="numeric"
              value={state.card.expiry}
              onChange={(e) => onCardChange({ expiry: maskCardExpiry(e.target.value) })}
              error={cardErrors.expiry}
            />
            <Input
              label="CVV"
              inputMode="numeric"
              placeholder="000"
              value={state.card.cvv}
              onChange={(e) => onCardChange({ cvv: maskCVV(e.target.value) })}
              error={cardErrors.cvv}
            />
            <Select
              label="Parcelas"
              value={state.installments}
              onChange={(e) => onChange({ installments: Number(e.target.value) })}
            >
              {Array.from({ length: maxInstallments }).map((_, i) => {
                const n = i + 1;
                return (
                  <option key={n} value={n}>
                    {n}x de {formatCurrency(total / n)} sem juros
                  </option>
                );
              })}
            </Select>
          </div>
          <p className="text-xs text-stone-400">
            Nenhum dado do cartão é enviado ou armazenado — o formulário é apenas visual.
          </p>
        </div>
      )}

      <p className="text-xs text-stone-500">
        {state.paymentMethod === "pix"
          ? `Total no Pix: ${formatCurrency(pixPrice(total))}`
          : formatInstallment(total)}
      </p>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          Voltar
        </Button>
        <Button type="submit" size="lg" loading={submitting} className="sm:min-w-56">
          {submitting ? "Processando…" : "Finalizar pedido"}
        </Button>
      </div>
    </form>
  );
}

function MethodButton({
  active,
  onClick,
  title,
  subtitle,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        active ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-400",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border",
          active ? "border-stone-900" : "border-stone-300",
        )}
      >
        {active && <span className="h-2 w-2 rounded-full bg-stone-900" />}
      </span>
      <span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-stone-900">
          {icon}
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-stone-500">{subtitle}</span>
      </span>
    </button>
  );
}
