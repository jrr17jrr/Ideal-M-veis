"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { MAIN_NAV, TOP_BAR_ITEMS } from "@/lib/constants";
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
      {/* Barra superior */}
      <div className="bg-stone-900 text-white">
        <Container className="flex h-9 items-center overflow-x-auto no-scrollbar">
          <ul className="mx-auto flex items-center whitespace-nowrap text-[11.5px] tracking-wide text-stone-300">
            {TOP_BAR_ITEMS.map((item, i) => (
              <li key={item} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden className="mx-3 h-1 w-1 rounded-full bg-stone-600 sm:mx-4" />
                )}
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-canvas/95 backdrop-blur">
        <Container className="flex h-16 items-center gap-3 lg:h-[76px] lg:gap-6">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="-ml-2 rounded-full p-2 text-stone-700 hover:bg-stone-100 lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Logo className="shrink-0" />

          <button
            onClick={() => setSearchOpen(true)}
            className="ml-2 hidden h-11 max-w-md flex-1 items-center gap-3 rounded-full border border-stone-300 px-4 text-left text-sm text-stone-400 transition-colors hover:border-stone-400 lg:flex"
          >
            <SearchIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">Buscar por móveis, ambientes ou materiais…</span>
          </button>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="rounded-full p-2 text-stone-700 hover:bg-stone-100 lg:hidden"
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
              {favHydrated && favCount > 0 && <Count>{favCount}</Count>}
            </Link>

            <button
              onClick={openDrawer}
              aria-label={`Sacola com ${totals.itemsCount} itens`}
              className="relative rounded-full p-2 text-stone-700 hover:bg-stone-100"
            >
              <BagIcon className="h-5 w-5" />
              {cartHydrated && totals.itemsCount > 0 && (
                <Count>{totals.itemsCount}</Count>
              )}
            </button>
          </div>
        </Container>

        {/* Navegação de categorias — desktop */}
        <div className="hidden border-t border-stone-200/70 lg:block">
          <Container className="overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-x-6 whitespace-nowrap">
              {MAIN_NAV.map((item) => {
                const base = item.href.split(/[?#]/)[0];
                const active =
                  base === "/"
                    ? pathname === "/" && !item.href.includes("#")
                    : pathname.startsWith(base) &&
                      (base !== "/produtos" || pathname === "/produtos");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative py-3 text-[13px] transition-colors hover:text-stone-900",
                      active ? "text-stone-900" : "text-stone-600",
                      item.href === "/ofertas" &&
                        "font-semibold text-brand hover:text-brand-dark",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-stone-900" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
      {children}
    </span>
  );
}
