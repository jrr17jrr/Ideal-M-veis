import { NextResponse } from "next/server";

/**
 * PLACEHOLDER — Rota de pagamento (servidor).
 *
 * Hoje NÃO faz nada real: o checkout usa `src/services/payment.ts` (mock no client).
 *
 * Implementação futura (Mercado Pago):
 * ---------------------------------------------------------------------------
 * import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
 *
 * const client = new MercadoPagoConfig({
 *   accessToken: process.env.MP_ACCESS_TOKEN!, // <-- SOMENTE no servidor
 * });
 *
 * export async function POST(request: Request) {
 *   const body = await request.json();              // CheckoutDraft + itens
 *   // 1. valida o carrinho/preços contra o Supabase (nunca confiar no client)
 *   // 2. cria o pagamento/preferência no Mercado Pago
 *   // 3. grava `orders` + `order_items` + `payments` (status "pending")
 *   // 4. retorna { orderId, status, pixCode?/initPoint? }
 * }
 * ---------------------------------------------------------------------------
 *
 * O webhook fica em `app/api/payments/webhook/route.ts` (a criar).
 *
 * ⚠️ NUNCA expor MP_ACCESS_TOKEN, client secret ou service role key ao browser.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "Integração de pagamento ainda não configurada. Ver src/app/api/payments/README.md e docs/backend-plan.md.",
    },
    { status: 501 },
  );
}

export async function GET() {
  return NextResponse.json({
    status: "placeholder",
    docs: "/docs/backend-plan.md",
  });
}
