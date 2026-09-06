# `lib/supabase/`

Camada de acesso ao Supabase. **Hoje está desligada** — nada aqui faz chamada real.

Quando for ligar o back-end:

1. `npm install @supabase/supabase-js @supabase/ssr`
2. Preencher `.env.local` (veja `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (somente server, nunca exposto ao client)
3. Implementar `client.ts` (browser) e `server.ts` (Server Components / Route Handlers)
   usando `createBrowserClient` / `createServerClient`.
4. Trocar as implementações mockadas em `src/services/*` para consultar o Supabase.
   Os componentes **não** devem mudar, pois só conhecem os `services`.

O tipo `Database` em `types.ts` é um placeholder — gere o real com:

```
npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
```

O plano completo de tabelas está em `docs/backend-plan.md`.
