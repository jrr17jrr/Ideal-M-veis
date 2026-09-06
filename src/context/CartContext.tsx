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
import type { CartItem, CartSelection, CartTotals, Product } from "@/types";
import { createCartItem, cartLineKey } from "@/types";

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
    selection?: CartSelection,
  ) => void;
  removeItem: (item: Pick<CartItem, "productId" | "color" | "options">) => void;
  updateQuantity: (
    item: Pick<CartItem, "productId" | "color" | "options">,
    quantity: number,
  ) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const keyOf = (i: Pick<CartItem, "productId" | "color" | "options">) =>
  cartLineKey(i.productId, i.color, i.options);

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.cart);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

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
    (product, quantity = 1, selection = {}) => {
      const line = createCartItem(product, quantity, selection);
      const key = keyOf(line);
      setItems((list) => {
        const idx = list.findIndex((i) => keyOf(i) === key);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = {
            ...next[idx],
            quantity: Math.min(99, next[idx].quantity + quantity),
          };
          return next;
        }
        return [...list, line];
      });
    },
    [],
  );

  const removeItem = useCallback<CartContextValue["removeItem"]>((item) => {
    const key = keyOf(item);
    setItems((list) => list.filter((i) => keyOf(i) !== key));
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    (item, quantity) => {
      const key = keyOf(item);
      setItems((list) => {
        if (quantity <= 0) return list.filter((i) => keyOf(i) !== key);
        return list.map((i) =>
          keyOf(i) === key ? { ...i, quantity: Math.min(99, quantity) } : i,
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
