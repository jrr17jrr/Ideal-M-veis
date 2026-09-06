"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import type { CartItem, CartTotals, Product } from "@/types";
import { createCartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  hydrated: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (
    product: Product,
    quantity?: number,
    options?: Record<string, string>,
  ) => void;
  removeItem: (productId: string, options?: Record<string, string>) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    options?: Record<string, string>,
  ) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Duas linhas do carrinho são "a mesma" se produto + variação forem iguais. */
function sameLine(
  a: Pick<CartItem, "productId" | "options">,
  productId: string,
  options?: Record<string, string>,
): boolean {
  return (
    a.productId === productId &&
    JSON.stringify(a.options ?? {}) === JSON.stringify(options ?? {})
  );
}

function computeTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (acc, item) => {
      acc.itemsCount += item.quantity;
      acc.subtotal += item.listPrice * item.quantity;
      acc.discount += (item.listPrice - item.unitPrice) * item.quantity;
      acc.total += item.unitPrice * item.quantity;
      return acc;
    },
    { itemsCount: 0, subtotal: 0, discount: 0, total: 0 },
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Hidrata do localStorage no client.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.cart);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persiste toda mudança (após hidratar).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  // Sincroniza entre abas.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEYS.cart && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue) as CartItem[]);
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (product, quantity = 1, options) => {
      setItems((list) => {
        const idx = list.findIndex((i) => sameLine(i, product.id, options));
        if (idx >= 0) {
          const next = [...list];
          next[idx] = {
            ...next[idx],
            quantity: Math.min(99, next[idx].quantity + quantity),
          };
          return next;
        }
        return [...list, createCartItem(product, quantity, options)];
      });
    },
    [],
  );

  const removeItem = useCallback<CartContextValue["removeItem"]>(
    (productId, options) => {
      setItems((list) =>
        list.filter((i) => !sameLine(i, productId, options)),
      );
    },
    [],
  );

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    (productId, quantity, options) => {
      setItems((list) => {
        if (quantity <= 0) {
          return list.filter((i) => !sameLine(i, productId, options));
        }
        return list.map((i) =>
          sameLine(i, productId, options)
            ? { ...i, quantity: Math.min(99, quantity) }
            : i,
        );
      });
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totals = useMemo(() => computeTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      hydrated,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [
      items,
      totals,
      hydrated,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
