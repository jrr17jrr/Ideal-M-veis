"use client";

import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { FavoritesProvider } from "./FavoritesContext";
import { CartProvider } from "./CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

/** Agrupa todos os provedores de estado global do client. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
