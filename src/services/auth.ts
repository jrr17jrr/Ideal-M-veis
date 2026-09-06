/**
 * Serviço de autenticação — camada isolada para o futuro Supabase Auth.
 *
 * HOJE: mock 100% no client. Aceita qualquer e-mail/senha "plausível",
 *       cria uma sessão fake e persiste no localStorage (via AuthContext).
 *
 * FUTURO (Supabase Auth):
 *   import { getSupabaseBrowserClient } from "@/lib/supabase/client";
 *   const supabase = getSupabaseBrowserClient();
 *   await supabase.auth.signInWithPassword({ email, password });
 *   await supabase.auth.signUp({ email, password, options: { data: { first_name, last_name } } });
 *   await supabase.auth.signOut();
 *   await supabase.auth.resetPasswordForEmail(email, { redirectTo });
 *
 * As assinaturas abaixo já espelham o retorno do Supabase (session/user),
 * então o AuthContext e as telas não mudam.
 */
import { isValidEmail } from "@/lib/masks";
import type { AuthSession } from "@/types";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpInput extends Credentials {
  firstName: string;
  lastName: string;
}

export interface AuthResult {
  session: AuthSession | null;
  error: string | null;
}

const NETWORK_DELAY = 700;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

function fakeSession(
  email: string,
  firstName = "Cliente",
  lastName = "Atelier",
): AuthSession {
  return {
    user: {
      id: `mock-${btoa(email).replace(/=/g, "").slice(0, 12)}`,
      email,
      firstName,
      lastName,
    },
    accessToken: "mock-access-token",
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
}

export async function signIn({
  email,
  password,
}: Credentials): Promise<AuthResult> {
  if (!isValidEmail(email)) {
    return delay({ session: null, error: "Informe um e-mail válido." });
  }
  if (password.length < 6) {
    return delay({
      session: null,
      error: "A senha precisa ter pelo menos 6 caracteres.",
    });
  }
  const name = email.split("@")[0].replace(/[._-]/g, " ");
  return delay({ session: fakeSession(email, capitalize(name)), error: null });
}

export async function signUp({
  email,
  password,
  firstName,
  lastName,
}: SignUpInput): Promise<AuthResult> {
  if (!firstName.trim() || !lastName.trim()) {
    return delay({ session: null, error: "Informe nome e sobrenome." });
  }
  if (!isValidEmail(email)) {
    return delay({ session: null, error: "Informe um e-mail válido." });
  }
  if (password.length < 6) {
    return delay({
      session: null,
      error: "A senha precisa ter pelo menos 6 caracteres.",
    });
  }
  return delay({ session: fakeSession(email, firstName, lastName), error: null });
}

export async function signOut(): Promise<void> {
  return delay(undefined);
}

export async function resetPassword(
  email: string,
): Promise<{ error: string | null }> {
  if (!isValidEmail(email)) {
    return delay({ error: "Informe um e-mail válido." });
  }
  // No futuro: supabase.auth.resetPasswordForEmail(email)
  return delay({ error: null });
}

function capitalize(text: string): string {
  return text
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
