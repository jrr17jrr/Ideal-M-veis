/**
 * Cliente Supabase para o BROWSER (Client Components).
 *
 * PLACEHOLDER: retorna `null` enquanto o Supabase não está configurado.
 *
 * Implementação futura:
 *
 *   import { createBrowserClient } from "@supabase/ssr";
 *   import type { Database } from "./types";
 *
 *   export function getSupabaseBrowserClient() {
 *     return createBrowserClient<Database>(
 *       supabaseEnv.url,
 *       supabaseEnv.anonKey,
 *     );
 *   }
 */
import { isSupabaseConfigured } from "./env";

export function getSupabaseBrowserClient(): null {
  if (!isSupabaseConfigured()) return null;
  throw new Error(
    "Supabase configurado, mas o client ainda não foi implementado. " +
      "Ver src/lib/supabase/README.md",
  );
}
