import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl text-brand">404</p>
      <h1 className="mt-4 text-2xl text-stone-900">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Voltar ao início</Button>
        <Button href="/produtos" variant="outline">
          Ver produtos
        </Button>
      </div>
    </Container>
  );
}
