"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { SearchIcon } from "@/components/ui/icons";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchProducts } from "@/services/products";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types";

const SUGGESTIONS = [
  "Sofá retrátil",
  "Mesa de jantar",
  "Guarda-roupa",
  "Poltrona",
  "Cadeira de escritório",
];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      widthClass="w-full max-w-lg"
      title="Buscar"
    >
      {open && <SearchPanel onClose={onClose} />}
    </Drawer>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedValue(term, 250);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let active = true;
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchProducts(debounced, 6).then((r) => {
      if (!active) return;
      setResults(r);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  const canSubmit = term.trim().length >= 2;

  function goToResults() {
    router.push(`/busca?q=${encodeURIComponent(term.trim())}`);
    onClose();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) goToResults();
  }

  const showEmpty = canSubmit && !loading && results.length === 0;

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={submit} className="border-b border-stone-200 p-5">
        <div className="flex items-center gap-3 rounded-full border border-stone-300 px-4 focus-within:border-stone-900">
          <SearchIcon className="h-5 w-5 shrink-0 text-stone-400" />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="O que você procura?"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            aria-label="Termo de busca"
          />
        </div>
      </form>

      <div className="flex-1 overflow-y-auto p-5">
        {!canSubmit && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
              Buscas populares
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setTerm(s)}
                  className="rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-700 transition-colors hover:border-stone-900"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <ul className="space-y-1">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/produto/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-stone-50"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {formatCurrency(p.salePrice ?? p.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <button
                onClick={goToResults}
                className="w-full rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-200"
              >
                Ver todos os resultados para “{term.trim()}”
              </button>
            </li>
          </ul>
        )}

        {showEmpty && (
          <p className="py-8 text-center text-sm text-stone-500">
            Nenhum produto encontrado para “{term.trim()}”.
          </p>
        )}
      </div>
    </div>
  );
}
