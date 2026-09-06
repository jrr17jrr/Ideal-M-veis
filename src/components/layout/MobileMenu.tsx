"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, UserIcon, HeartIcon, PackageIcon } from "@/components/ui/icons";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Drawer open={open} onClose={onClose} side="left" widthClass="w-[86%] max-w-sm" title="Menu">
      <nav className="flex flex-col py-2">
        {MAIN_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between border-b border-stone-100 px-5 py-4 text-[15px]",
                active ? "font-medium text-stone-900" : "text-stone-700",
              )}
            >
              {item.label}
              <ChevronRight className="h-4 w-4 text-stone-300" />
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 flex flex-col gap-1 px-2">
        <MenuLink href={user ? "/minha-conta" : "/login"} icon={<UserIcon className="h-5 w-5" />} onClose={onClose}>
          {user ? `Olá, ${user.firstName}` : "Entrar ou criar conta"}
        </MenuLink>
        <MenuLink href="/favoritos" icon={<HeartIcon className="h-5 w-5" />} onClose={onClose}>
          Favoritos
        </MenuLink>
        <MenuLink href="/pedidos" icon={<PackageIcon className="h-5 w-5" />} onClose={onClose}>
          Meus pedidos
        </MenuLink>
      </div>

      <div className="mt-6 px-5 text-xs text-stone-400">
        Atendimento: seg. a sáb., 9h às 18h
      </div>
    </Drawer>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClose,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
    >
      <span className="text-stone-400">{icon}</span>
      {children}
    </Link>
  );
}
