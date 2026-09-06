import { CheckIcon } from "./icons";
import { cn } from "@/lib/cn";

export function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-stone-700 select-none">
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors",
          checked ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white",
        )}
      >
        {checked && <CheckIcon className="h-3 w-3" />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs text-stone-400">{count}</span>}
    </label>
  );
}
