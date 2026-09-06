"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import {
  MenuIcon,
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
} from "@/components/ui/icons";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totals, openDrawer, hydrated: cartHydrated } = useCart();
  const { count: favCount, hydrated: favHydrated } = useFavorites();
  const { user } = useAuth();

  return (
    <>
      <div className="bg-stone-900 text-white">
        <Container className="flex h-9 items-center justify-center text-center text-[12px] tracking-wide">
          Frete grátis na econômica acima de R$ 4.000 · 10% de desconto no Pix
        </Container>
      </div>

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-canvas/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="-ml-2 rounded-full p-2 text-stone-700 hover:bg-stone-100"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>

          <Logo className="lg:flex-none" />

          <nav className="hidden items-center gap-7 lg:flex">
            {MAIN_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 text-sm transition-colors hover:text-stone-900",
                    active ? "text-stone-900" : "text-stone-600",
                    item.href === "/ofertas" && "text-brand hover:text-brand-dark",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-[19px] hidden h-0.5 bg-stone-900 lg:block" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="rounded-full p-2 text-stone-700 hover:bg-stone-100"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            <Link
              href={user ? "/minha-conta" : "/login"}
              aria-label={user ? "Minha conta" : "Entrar"}
              className="hidden rounded-full p-2 text-stone-700 hover:bg-stone-100 sm:block"
            >
              <UserIcon className="h-5 w-5" />
            </Link>

            <Link
              href="/favoritos"
              aria-label="Favoritos"
              className="relative rounded-full p-2 text-stone-700 hover:bg-stone-100"
            >
              <HeartIcon className="h-5 w-5" />
              {favHydrated && favCount > 0 && (
                <Badge>{favCount}</Badge>
              )}
            </Link>

            <button
              onClick={openDrawer}
              aria-label={`Sacola com ${totals.itemsCount} itens`}
              className="relative rounded-full p-2 text-stone-700 hover:bg-stone-100"
            >
              <BagIcon className="h-5 w-5" />
              {cartHydrated && totals.itemsCount > 0 && (
                <Badge>{totals.itemsCount}</Badge>
              )}
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
      {children}
    </span>
  );
}
