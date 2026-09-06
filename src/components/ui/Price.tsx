import { cn } from "@/lib/cn";
import { formatCurrency, formatInstallment } from "@/lib/format";

interface PriceProps {
  price: number;
  salePrice?: number;
  size?: "sm" | "md" | "lg";
  showInstallment?: boolean;
  className?: string;
}

const SIZE = {
  sm: { now: "text-base", was: "text-xs" },
  md: { now: "text-xl", was: "text-sm" },
  lg: { now: "text-3xl", was: "text-base" },
};

export function Price({
  price,
  salePrice,
  size = "md",
  showInstallment = true,
  className,
}: PriceProps) {
  const hasSale = salePrice != null && salePrice < price;
  const current = hasSale ? salePrice : price;
  const s = SIZE[size];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {hasSale && (
        <span className={cn("text-stone-400 line-through", s.was)}>
          {formatCurrency(price)}
        </span>
      )}
      <span className={cn("font-semibold text-stone-900", s.now)}>
        {formatCurrency(current)}
      </span>
      {showInstallment && (
        <span className="text-xs text-stone-500">
          {formatInstallment(current)}
        </span>
      )}
    </div>
  );
}
