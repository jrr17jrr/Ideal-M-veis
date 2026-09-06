/**
 * Serviço de pagamento — camada isolada para a futura integração com o
 * Mercado Pago.
 *
 * ⚠️ IMPORTANTE / SEGURANÇA
 * -------------------------------------------------------------------------
 * NUNCA coloque o Access Token do Mercado Pago (nem qualquer segredo) neste
 * arquivo ou em qualquer código que rode no client.
 *
 * Fluxo correto (ver docs/backend-plan.md):
 *
 *   Client (checkout)
 *     -> fetch("/api/payments", { method: "POST", body: draft })   ← Route Handler (servidor)
 *          -> Mercado Pago SDK usando MP_ACCESS_TOKEN (env server-only)
 *          -> grava `orders` / `payments` no Supabase
 *     <- { orderId, status, pixCode?, redirectUrl? }
 *
 *   Webhook do Mercado Pago
 *     -> POST /api/payments/webhook
 *          -> valida assinatura
 *          -> atualiza status do pedido no Supabase
 *
 * HOJE esta função apenas SIMULA o pagamento no próprio client, sem rede.
 * -------------------------------------------------------------------------
 */
import type {
  CartItem,
  CheckoutDraft,
  Payment,
  PaymentMethod,
} from "@/types";
import { bestInstallment, pixPrice } from "@/lib/format";

export interface CreatePaymentInput {
  draft: CheckoutDraft;
  items: CartItem[];
  amount: number;
}

export interface CreatePaymentResult {
  ok: boolean;
  orderId: string;
  orderNumber: string;
  payment: Payment;
  /** Só para cartão recusado etc. */
  error?: string;
}

function genOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `#${n}`;
}

function fakePixCode(amount: number): string {
  const cents = Math.round(amount * 100)
    .toString()
    .padStart(6, "0");
  return `00020126360014BR.GOV.BCB.PIX0114+5511988881234520400005303986540${cents}5802BR5920ATELIER MOVEIS LTDA6009SAO PAULO62070503***6304MOCK`;
}

/**
 * SIMULA a criação de um pagamento.
 *
 * No futuro, o corpo desta função vira:
 *
 *   const res = await fetch("/api/payments", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(input),
 *   });
 *   return res.json();
 */
export async function createPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  const { draft, amount } = input;

  // Simula latência de rede / processamento do provedor.
  await new Promise((r) => setTimeout(r, 1400));

  const method: PaymentMethod = draft.paymentMethod;
  const isPix = method === "pix";
  const chargedAmount = isPix ? pixPrice(amount) : amount;
  const installments = isPix
    ? 1
    : Math.min(draft.installments || 1, bestInstallment(amount).count);

  const orderNumber = genOrderNumber();

  const payment: Payment = {
    id: `pay_mock_${Date.now()}`,
    method,
    // Pix "aprova" na hora no mock; cartão fica aprovado também (demo feliz).
    status: "approved",
    amount: Number(chargedAmount.toFixed(2)),
    installments,
    providerPaymentId: `mp_mock_${Math.random().toString(36).slice(2, 10)}`,
    pixCode: isPix ? fakePixCode(chargedAmount) : undefined,
    createdAt: new Date().toISOString(),
  };

  return {
    ok: true,
    orderId: `ord_mock_${Date.now()}`,
    orderNumber,
    payment,
  };
}

/** Placeholder do polling de status (Pix) — hoje sempre "approved". */
export async function getPaymentStatus(
  _paymentId: string,
): Promise<Payment["status"]> {
  void _paymentId;
  await new Promise((r) => setTimeout(r, 500));
  return "approved";
}
