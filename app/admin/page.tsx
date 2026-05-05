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
  const lastUpdate = processes[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12">
      {/* Heading */}
      <section className="mb-10 grid grid-cols-12 items-end gap-6 border-b border-[--color-rule] pb-8">
        <div className="col-span-12 lg:col-span-8">
          <p className="label-eyebrow text-[--color-claret]">Cadastro & gestão</p>
          <h1 className="headline mt-3 text-6xl text-[--color-ink] sm:text-7xl">
            Lista de <em>processos</em>.
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg italic leading-snug text-[--color-ink-dim]">
            Edite, exclua ou cadastre novos. Toda modificação reflete-se no painel
            público em tempo real.
          </p>
        </div>

        <div className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
          <SearchForm initial={q} />
          <Link href="/admin/new" className="btn btn-claret whitespace-nowrap">
            + Novo processo
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-10 grid grid-cols-2 gap-x-8 gap-y-6 border-b border-[--color-rule] pb-10 sm:grid-cols-4">
        <Stat num="I" label="Total cadastrado" value={String(processes.length).padStart(3, "0")} />
        <Stat
          num="II"
          label="Status únicos"
          value={String(new Set(processes.map((p) => p.status)).size).padStart(2, "0")}
        />
        <Stat
          num="III"
          label="Última atualização"
          value={
            lastUpdate
              ? new Intl.DateTimeFormat("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                }).format(new Date(lastUpdate.updated_at))
              : "—"
          }
        />
        <Stat num="IV" label="Modo" value="Administrador" />
      </section>

      {/* List */}
      {error ? (
        <div className="border-l-2 border-[--color-claret] bg-[--color-claret-soft]/30 px-5 py-4 text-sm text-[--color-claret]">
          {error.message}
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
      className="flex w-full items-center gap-2 border border-[--color-rule] bg-[--color-paper-soft] px-3 py-1.5 transition focus-within:border-[--color-claret] focus-within:bg-white sm:w-auto"
    >
      <span className="font-serif text-base italic text-[--color-ink-dim]">⌕</span>
      <input
        name="q"
        defaultValue={initial}
        placeholder="buscar por número ou objeto..."
        className="w-full bg-transparent py-1 font-sans text-sm text-[--color-ink] placeholder:italic placeholder:text-[--color-ink-mute] focus:outline-none sm:w-72"
      />
    </form>
  );
}

function Stat({ num, label, value }: { num: string; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-xl italic text-[--color-claret]">{num}.</span>
        <span className="label-eyebrow">{label}</span>
      </div>
      <div className="mt-2 font-serif text-3xl text-[--color-ink] tabular sm:text-4xl">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="border-y-2 border-double border-[--color-rule] py-24 text-center">
      <p className="label-eyebrow text-[--color-claret]">Sem registros</p>
      <h3 className="headline mt-4 text-5xl text-[--color-ink]">
        {query ? <>Nenhum resultado.</> : <><em>Nada</em> cadastrado ainda.</>}
      </h3>
      <p className="mx-auto mt-4 max-w-md font-serif text-lg italic text-[--color-ink-dim]">
        {query
          ? `Nada bate com "${query}". Tente outro termo ou limpe o filtro.`
          : "Cadastre o primeiro processo para começar a popular o painel."}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        {query ? (
          <Link href="/admin" className="btn btn-ghost">
            Limpar filtro
          </Link>
        ) : null}
        <Link href="/admin/new" className="btn btn-claret">
          + Novo processo
        </Link>
      </div>
    </div>
  );
}
