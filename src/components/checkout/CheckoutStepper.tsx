import { cn } from "@/lib/cn";
import { CheckIcon } from "@/components/ui/icons";

export const CHECKOUT_STEPS = [
  { id: "identification", label: "Identificação" },
  { id: "delivery", label: "Entrega" },
  { id: "shipping", label: "Frete" },
  { id: "payment", label: "Pagamento" },
] as const;

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number]["id"];

export function CheckoutStepper({ current }: { current: CheckoutStepId }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex items-center gap-2">
      {CHECKOUT_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-stone-900 text-white",
                  active && "bg-brand text-white",
                  !done && !active && "bg-stone-200 text-stone-500",
                )}
              >
                {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  active ? "text-stone-900" : "text-stone-500",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < CHECKOUT_STEPS.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1",
                  i < currentIndex ? "bg-stone-900" : "bg-stone-200",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
