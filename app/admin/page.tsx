import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Process } from "@/lib/types";
import { ProcessesList } from "./processes-list";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("processes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`numero.ilike.${term},objeto.ilike.${term}`);
  }

  const { data, error } = await query;
  const processes: Process[] = (data as Process[] | null) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      {/* Title block */}
      <section className="flex flex-col gap-6 border-b border-[--color-panel-line] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[--color-amber]">
            ⟶ Cadastro & Gestão
          </p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none text-[--color-cream] sm:text-6xl">
            Processos<span className="text-[--color-amber]">.</span>
          </h1>
          <p className="mt-3 max-w-xl font-serif text-lg italic text-[--color-ink-dim]">
            Lista mestre. Edite, exclua, ou cadastre. O telão reflete instantaneamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchForm initial={q} />
          <Link href="/admin/new" className="btn btn-primary whitespace-nowrap">
            + Novo processo
          </Link>
        </div>
      </section>

      {/* Stat strip */}
      <section className="my-8 grid grid-cols-2 gap-px border border-[--color-panel-line] bg-[--color-panel-line] sm:grid-cols-4">
        <Stat kbd="01" label="Total" value={String(processes.length).padStart(3, "0")} />
        <Stat
          kbd="02"
          label="Status únicos"
          value={String(new Set(processes.map((p) => p.status)).size).padStart(2, "0")}
        />
        <Stat
          kbd="03"
          label="Última atualização"
          value={
            processes[0]
              ? new Intl.DateTimeFormat("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                }).format(new Date(processes[0].updated_at))
              : "—"
          }
        />
        <Stat kbd="04" label="Modo" value="ADMIN" />
      </section>

      {/* List */}
      {error ? (
        <div className="border border-[--color-rust]/40 bg-[--color-rust]/10 p-4 font-mono text-sm text-[--color-rust]">
          ⚠ {error.message}
        </div>
      ) : processes.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <ProcessesList processes={processes} />
      )}
    </div>
  );
}

function SearchForm({ initial }: { initial: string }) {
  return (
    <form
      action="/admin"
      method="get"
      className="flex items-center gap-0 border border-[--color-panel-line] bg-[--color-bg-elev] focus-within:border-[--color-amber]"
    >
      <span className="px-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
        ⌕
      </span>
      <input
        name="q"
        defaultValue={initial}
        placeholder="buscar por número ou objeto..."
        className="w-72 bg-transparent py-2 pr-3 font-mono text-sm text-[--color-ink] placeholder:italic placeholder:text-[--color-ink-mute] focus:outline-none"
      />
      <button
        type="submit"
        className="border-l border-[--color-panel-line] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim] hover:bg-[--color-amber] hover:text-[--color-bg]"
      >
        Filtrar
      </button>
    </form>
  );
}

function Stat({ kbd, label, value }: { kbd: string; label: string; value: string }) {
  return (
    <div className="bg-[--color-bg] p-5">
      <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[--color-amber]">
        {kbd} · {label}
      </div>
      <div className="mt-2 font-display text-3xl font-black uppercase leading-none text-[--color-cream]">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="relative overflow-hidden border border-dashed border-[--color-panel-line] py-24 text-center">
      <div className="pointer-events-none absolute inset-0 grain opacity-50" />
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-amber]">
        ⟶ Nenhum processo
      </p>
      <h3 className="mt-3 font-display text-4xl font-black uppercase text-[--color-cream]">
        {query ? "Sem resultados." : "Nada cadastrado ainda."}
      </h3>
      <p className="mx-auto mt-3 max-w-md font-serif text-lg italic text-[--color-ink-dim]">
        {query
          ? `Nada bate com "${query}". Tente outro termo ou limpe o filtro.`
          : "Cadastre o primeiro processo para começar a popular o painel."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {query ? (
          <Link href="/admin" className="btn btn-ghost">
            Limpar filtro
          </Link>
        ) : null}
        <Link href="/admin/new" className="btn btn-primary">
          + Novo processo
        </Link>
      </div>
    </div>
  );
}
