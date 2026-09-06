import Link from "next/link";
import { ArrowRight } from "./icons";

export function SectionHeader({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel = "Ver tudo",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-wrap items-end justify-between gap-4"
      }
    >
      <div className={align === "center" ? "" : "max-w-xl"}>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[1.7rem] font-medium leading-tight text-espresso sm:text-[2rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-stone-500 sm:text-base">{description}</p>
        )}
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:border-brand hover:text-brand-dark"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
