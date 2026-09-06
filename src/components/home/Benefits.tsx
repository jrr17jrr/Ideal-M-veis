import { Container } from "@/components/ui/Container";
import { BENEFITS } from "@/lib/constants";
import {
  ShieldIcon,
  CreditCardIcon,
  TruckIcon,
  HeadsetIcon,
  PercentIcon,
} from "@/components/ui/icons";

const ICONS = {
  shield: ShieldIcon,
  card: CreditCardIcon,
  truck: TruckIcon,
  headset: HeadsetIcon,
  percent: PercentIcon,
} as const;

export function Benefits() {
  return (
    <section className="border-y border-stone-200 bg-white">
      <Container className="grid grid-cols-1 gap-7 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-stone-200">
        {BENEFITS.map((b) => {
          const Icon = ICONS[b.icon];
          return (
            <div
              key={b.title}
              className="flex items-center gap-4 lg:justify-center lg:px-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold leading-tight text-espresso">
                  {b.title}
                </h3>
                <p className="mt-0.5 text-xs text-stone-500">{b.description}</p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
