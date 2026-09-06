"use client";

import { cn } from "@/lib/cn";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";
import { HeartIcon } from "@/components/ui/icons";

export function FavoriteButton({
  productId,
  productName,
  variant = "floating",
  className,
}: {
  productId: string;
  productName: string;
  variant?: "floating" | "inline";
  className?: string;
}) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const toast = useToast();
  const active = hydrated && isFavorite(productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(productId);
    toast.success(
      added
        ? `${productName} adicionado aos favoritos`
        : `${productName} removido dos favoritos`,
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        variant === "floating" &&
          "h-9 w-9 bg-white/90 text-stone-700 shadow-sm backdrop-blur hover:bg-white hover:text-brand",
        variant === "inline" &&
          "h-11 w-11 border border-stone-300 text-stone-700 hover:border-stone-900",
        active && "text-brand",
        className,
      )}
    >
      <HeartIcon className="h-5 w-5" filled={active} />
    </button>
  );
}
