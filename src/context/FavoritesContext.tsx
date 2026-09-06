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

interface FavoritesContextValue {
  ids: string[];
  hydrated: boolean;
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.favorites);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, hydrated]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEYS.favorites && e.newValue) {
        try {
          setIds(JSON.parse(e.newValue) as string[]);
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  );

  const toggle = useCallback((productId: string) => {
    let added = false;
    setIds((list) => {
      if (list.includes(productId)) {
        return list.filter((id) => id !== productId);
      }
      added = true;
      return [...list, productId];
    });
    return added;
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((list) => list.filter((id) => id !== productId));
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      hydrated,
      isFavorite,
      toggle,
      remove,
      count: ids.length,
    }),
    [ids, hydrated, isFavorite, toggle, remove],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites deve ser usado dentro de <FavoritesProvider>");
  return ctx;
}
