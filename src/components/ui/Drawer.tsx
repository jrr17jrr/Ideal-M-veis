"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { CloseIcon } from "./icons";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  footer,
  widthClass = "w-full max-w-md",
}: DrawerProps) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={title}>
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-stone-900/40 animate-fade-in"
      />
      <div
        className={cn(
          "absolute inset-y-0 flex flex-col bg-white shadow-xl",
          widthClass,
          side === "right" ? "right-0 animate-slide-in-right" : "left-0 animate-slide-in-left",
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <h2 className="text-lg text-stone-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="-mr-2 rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div className="border-t border-stone-200 bg-white px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
