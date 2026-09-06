import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { Newsletter } from "@/components/home/Newsletter";
import { FOOTER_LINKS, STORE_NAME } from "@/lib/constants";
import {
  InstagramIcon,
  FacebookIcon,
  WhatsappIcon,
  ShieldIcon,
} from "@/components/ui/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <Newsletter />

      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
            Curadoria de móveis e decoração com design autoral, materiais
            duráveis e entrega para todo o Brasil.
          </p>
          <div className="mt-5 flex gap-3">
            {[InstagramIcon, FacebookIcon, WhatsappIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Rede social"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-medium text-stone-900">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 transition-colors hover:text-stone-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-stone-200">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-stone-500 sm:flex-row">
          <p className="flex items-center gap-1.5">
            <ShieldIcon className="h-4 w-4" />
            Ambiente seguro · Pagamentos processados com criptografia
          </p>
          <p>
            © {year} {STORE_NAME}. Projeto de demonstração — CNPJ e dados
            fictícios.
          </p>
        </Container>
      </div>
    </footer>
  );
}
