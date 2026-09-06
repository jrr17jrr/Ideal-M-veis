"use client";

/**
 * Estado de autenticação do client.
 *
 * HOJE: guarda uma sessão FAKE no localStorage (produzida por `services/auth.ts`).
 * FUTURO: substituir por `supabase.auth.onAuthStateChange` + `getSession()`.
 * A API exposta (`user`, `signIn`, `signUp`, `signOut`, `resetPassword`) já é
 * a mesma que usaremos com o Supabase, então as telas não mudam.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import type { AuthSession, AuthUser } from "@/types";
import * as authService from "@/services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  hydrated: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.session);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthSession;
        if (parsed.expiresAt > Date.now()) setSession(parsed);
        else localStorage.removeItem(STORAGE_KEYS.session);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AuthSession | null) => {
    setSession(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEYS.session);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (email, password) => {
      setLoading(true);
      const { session: s, error } = await authService.signIn({ email, password });
      setLoading(false);
      if (error) return error;
      persist(s);
      return null;
    },
    [persist],
  );

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async (input) => {
      setLoading(true);
      const { session: s, error } = await authService.signUp(input);
      setLoading(false);
      if (error) return error;
      persist(s);
      return null;
    },
    [persist],
  );

  const signOut = useCallback<AuthContextValue["signOut"]>(async () => {
    setLoading(true);
    await authService.signOut();
    persist(null);
    setLoading(false);
  }, [persist]);

  const resetPassword = useCallback<AuthContextValue["resetPassword"]>(
    async (email) => {
      setLoading(true);
      const { error } = await authService.resetPassword(email);
      setLoading(false);
      return error;
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      loading,
      hydrated,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [session, loading, hydrated, signIn, signUp, signOut, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
