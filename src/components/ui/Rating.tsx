import { cn } from "@/lib/cn";
import { StarIcon } from "./icons";

export function Rating({
  value,
  count,
  size = 16,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            width={size}
            height={size}
            filled={i + 1 <= rounded}
            className={cn(i + 1 > rounded && "text-stone-300")}
          />
        ))}
      </div>
      <span className="text-xs text-stone-500">
        {value.toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </div>
  );
}
