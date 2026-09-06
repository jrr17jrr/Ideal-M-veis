/**
 * Cliente Supabase para o SERVIDOR (Server Components, Route Handlers, Server Actions).
 *
 * PLACEHOLDER: retorna `null` enquanto o Supabase não está configurado.
 *
 * Implementação futura (App Router):
 *
 *   import { createServerClient } from "@supabase/ssr";
 *   import { cookies } from "next/headers";
 *   import type { Database } from "./types";
 *
 *   export async function getSupabaseServerClient() {
 *     const cookieStore = await cookies();
 *     return createServerClient<Database>(supabaseEnv.url, supabaseEnv.anonKey, {
 *       cookies: {
 *         getAll: () => cookieStore.getAll(),
 *         setAll: (list) => list.forEach(({ name, value, options }) =>
 *           cookieStore.set(name, value, options)),
 *       },
 *     });
 *   }
 *
 * O SERVICE ROLE KEY (SUPABASE_SERVICE_ROLE_KEY) só deve ser lido aqui/no servidor,
 * nunca em código que vá para o client.
 */
import { isSupabaseConfigured } from "./env";

export async function getSupabaseServerClient(): Promise<null> {
  if (!isSupabaseConfigured()) return null;
  throw new Error(
    "Supabase configurado, mas o client de servidor ainda não foi implementado. " +
      "Ver src/lib/supabase/README.md",
  );
}
