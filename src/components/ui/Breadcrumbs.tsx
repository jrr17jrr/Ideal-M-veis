import Link from "next/link";
import { Fragment } from "react";
import { ChevronRight } from "./icons";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="text-sm text-stone-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-stone-900"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={last ? "text-stone-900" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-300" />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
