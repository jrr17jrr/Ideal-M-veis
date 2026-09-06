import { Container } from "@/components/ui/Container";
import { BENEFITS } from "@/lib/constants";
import {
  ShieldIcon,
  CreditCardIcon,
  TruckIcon,
  HeadsetIcon,
} from "@/components/ui/icons";

const ICONS = {
  shield: ShieldIcon,
  card: CreditCardIcon,
  truck: TruckIcon,
  headset: HeadsetIcon,
} as const;

export function Benefits() {
  return (
    <section className="border-y border-stone-200 bg-white">
      <Container className="grid gap-x-6 gap-y-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.icon];
          return (
            <div key={b.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{b.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                  {b.description}
                </p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
