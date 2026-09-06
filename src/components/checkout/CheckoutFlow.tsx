"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BagIcon, ShieldIcon } from "@/components/ui/icons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutStepper, type CheckoutStepId } from "./CheckoutStepper";
import { CheckoutSummary } from "./CheckoutSummary";
import {
  IdentificationStep,
  DeliveryStep,
  ShippingStep,
  PaymentStep,
} from "./CheckoutSteps";
import { OrderConfirmation } from "./OrderConfirmation";
import {
  EMPTY_CHECKOUT,
  type CheckoutState,
  type CardForm,
} from "./checkoutTypes";
import { createPayment } from "@/services/payment";
import { buildLocalOrder, saveLastOrder } from "@/services/orders";
import type { CheckoutDraft, Order, ShippingOption } from "@/types";

const STEP_ORDER: CheckoutStepId[] = [
  "identification",
  "delivery",
  "shipping",
  "payment",
];

export function CheckoutFlow() {
  const { items, totals, hydrated, clear } = useCart();
  const toast = useToast();

  const [step, setStep] = useState<CheckoutStepId>("identification");
  const [state, setState] = useState<CheckoutState>(EMPTY_CHECKOUT);
  const [shippingOption, setShippingOption] = useState<ShippingOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const shippingCost = shippingOption?.price ?? null;
  const orderTotal = useMemo(
    () => totals.total + (shippingCost ?? 0),
    [totals.total, shippingCost],
  );

  function patch(p: Partial<CheckoutState>) {
    setState((s) => ({ ...s, ...p }));
  }
  function patchCard(p: Partial<CardForm>) {
    setState((s) => ({ ...s, card: { ...s.card, ...p } }));
  }

  function goto(next: CheckoutStepId) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const stepIndex = STEP_ORDER.indexOf(step);
  const back = () => goto(STEP_ORDER[Math.max(0, stepIndex - 1)]);
  const forward = () =>
    goto(STEP_ORDER[Math.min(STEP_ORDER.length - 1, stepIndex + 1)]);

  async function finish() {
    if (!shippingOption) return;
    setSubmitting(true);

    const draft: CheckoutDraft = {
      identification: state.identification,
      address: {
        recipient: `${state.identification.firstName} ${state.identification.lastName}`,
        zipCode: state.delivery.zipCode,
        street: state.delivery.street,
        number: state.delivery.number,
        complement: state.delivery.complement,
        district: state.delivery.district,
        city: state.delivery.city,
        state: state.delivery.state,
      },
      shippingOptionId: shippingOption.id,
      paymentMethod: state.paymentMethod,
      installments: state.installments,
    };

    const result = await createPayment({
      draft,
      items,
      amount: orderTotal, // valor base; o serviço aplica o desconto do Pix
    });

    if (!result.ok) {
      setSubmitting(false);
      toast.error(result.error ?? "Não foi possível processar o pagamento.");
      return;
    }

    const localOrder = buildLocalOrder({
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      draft,
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingCost: shippingOption.price,
      payment: result.payment,
    });

    saveLastOrder(localOrder);
    clear();
    setOrder(localOrder);
    setSubmitting(false);
  }

  /* ------------------------------- Render ------------------------------- */

  if (order) {
    return (
      <Container className="py-10">
        <OrderConfirmation order={order} />
      </Container>
    );
  }

  if (!hydrated) {
    return (
      <Container className="py-16">
        <div className="skeleton mx-auto h-64 max-w-2xl rounded-2xl" />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<BagIcon className="h-6 w-6" />}
          title="Sua sacola está vazia"
          description="Adicione produtos antes de finalizar a compra."
          action={<Button href="/produtos">Ver produtos</Button>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Sacola", href: "/carrinho" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-4 text-3xl text-stone-900 sm:text-4xl">Finalizar compra</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <CheckoutStepper current={step} />

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
            {step === "identification" && (
              <StepBlock title="Identificação">
                <IdentificationStep
                  value={state.identification}
                  onChange={(p) =>
                    patch({ identification: { ...state.identification, ...p } })
                  }
                  onNext={forward}
                />
              </StepBlock>
            )}

            {step === "delivery" && (
              <StepBlock title="Endereço de entrega">
                <DeliveryStep
                  value={state.delivery}
                  onChange={(p) => patch({ delivery: { ...state.delivery, ...p } })}
                  onNext={forward}
                  onBack={back}
                />
              </StepBlock>
            )}

            {step === "shipping" && (
              <StepBlock title="Opções de frete">
                <ShippingStep
                  zipCode={state.delivery.zipCode}
                  subtotal={totals.total}
                  selectedId={shippingOption?.id ?? null}
                  onSelect={(o) => {
                    setShippingOption(o);
                    patch({ shippingOptionId: o.id });
                  }}
                  onNext={forward}
                  onBack={back}
                />
              </StepBlock>
            )}

            {step === "payment" && (
              <StepBlock title="Pagamento">
                <PaymentStep
                  state={state}
                  onChange={patch}
                  onCardChange={patchCard}
                  total={orderTotal}
                  onSubmit={finish}
                  onBack={back}
                  submitting={submitting}
                />
              </StepBlock>
            )}
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-stone-400">
            <ShieldIcon className="h-3.5 w-3.5" />
            Seus dados trafegam de forma segura. Este é um checkout de
            demonstração — nenhum pagamento é cobrado.
          </p>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <CheckoutSummary shippingCost={shippingCost} />
        </div>
      </div>
    </Container>
  );
}

function StepBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-5 font-display text-lg text-stone-900">{title}</h2>
      {children}
    </div>
  );
}
