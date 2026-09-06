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
      <Container className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.icon];
          return (
            <div key={b.title} className="flex gap-3">
              <Icon className="h-6 w-6 shrink-0 text-brand" />
              <div>
                <h3 className="font-display text-base text-stone-900">{b.title}</h3>
                <p className="mt-1 text-sm text-stone-500">{b.description}</p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
