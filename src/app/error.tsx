"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl text-stone-900">Algo deu errado</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        Tivemos um problema ao carregar esta página. Tente novamente em instantes.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Tentar de novo</Button>
        <Button href="/" variant="outline">
          Ir para o início
        </Button>
      </div>
    </Container>
  );
}
