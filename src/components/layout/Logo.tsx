import Link from "next/link";
import { cn } from "@/lib/cn";
import { STORE_NAME } from "@/lib/constants";

/**
 * Logo provisório (tipográfico). Troque por um SVG/Image quando a marca existir.
 */
export function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${STORE_NAME} — página inicial`}
      className={cn("inline-flex items-baseline gap-1.5", className)}
    >
      <span className="font-display text-[22px] font-semibold tracking-tight text-espresso sm:text-2xl">
        {STORE_NAME.split(" ")[0]}
      </span>
      <span className="font-display text-[22px] font-normal tracking-tight text-brand sm:text-2xl">
        {STORE_NAME.split(" ").slice(1).join(" ")}
      </span>
    </Link>
  );
}
