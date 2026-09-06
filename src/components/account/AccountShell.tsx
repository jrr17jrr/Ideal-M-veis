"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  UserIcon,
  PackageIcon,
  MapPinIcon,
  HeartIcon,
  LogOutIcon,
} from "@/components/ui/icons";

const NAV = [
  { href: "/minha-conta", label: "Meus dados", icon: UserIcon, exact: true },
  { href: "/pedidos", label: "Meus pedidos", icon: PackageIcon },
  { href: "/minha-conta/enderecos", label: "Endereços", icon: MapPinIcon },
  { href: "/favoritos", label: "Favoritos", icon: HeartIcon },
];

export function AccountShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, signOut } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, user, router, pathname]);

  async function handleSignOut() {
    await signOut();
    toast.success("Você saiu da sua conta.");
    router.push("/");
  }

  if (!hydrated || !user) {
    return (
      <Container className="py-16">
        <div className="skeleton mx-auto h-64 max-w-3xl rounded-2xl" />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Minha conta" }]}
      />

      <div className="mt-4 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="px-3 py-2 text-sm text-stone-500">
              Olá,{" "}
              <span className="font-medium text-stone-900">{user.firstName}</span>
            </p>
            <nav className="mt-1 flex flex-col">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-stone-900 text-white"
                        : "text-stone-700 hover:bg-stone-100",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-700 transition-colors hover:bg-stone-100"
              >
                <LogOutIcon className="h-4 w-4" />
                Sair
              </button>
            </nav>
          </div>
        </aside>

        <div>
          <h1 className="mb-6 text-2xl text-stone-900 sm:text-3xl">{title}</h1>
          {children}
        </div>
      </div>
    </Container>
  );
}
