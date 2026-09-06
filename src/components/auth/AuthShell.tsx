import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl text-stone-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          {children}
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-stone-500">{footer}</p>
        )}

        <p className="mt-8 text-center text-xs text-stone-400">
          Demonstração — autenticação real com Supabase será conectada depois.{" "}
          <Link href="/" className="underline underline-offset-2">
            Voltar à loja
          </Link>
        </p>
      </div>
    </Container>
  );
}
