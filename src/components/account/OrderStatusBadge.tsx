import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/types";

const STYLES: Record<OrderStatus, string> = {
  payment_pending: "bg-amber-100 text-amber-800",
  payment_approved: "bg-sky-100 text-sky-800",
  processing: "bg-violet-100 text-violet-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  canceled: "bg-stone-200 text-stone-600",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
