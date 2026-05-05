import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Process } from "@/lib/types";
import { ProcessForm } from "../../process-form";
import { updateProcess } from "../../actions";

export default async function EditProcessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("processes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const process = data as Process;
  const action = updateProcess.bind(null, id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <header className="mb-10 border-b border-[--color-panel-line] pb-6">
        <Link
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim] hover:text-[--color-amber]"
        >
          ◀ voltar à lista
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[--color-amber]">
              ⟶ Edição
            </p>
            <h1 className="mt-1 font-display text-5xl font-black uppercase leading-none text-[--color-cream] sm:text-6xl">
              <span className="font-serif italic font-normal text-[--color-cream]">{process.numero}</span>
              <span className="text-[--color-amber]">.</span>
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
            <div>Cadastrado: {fmt(process.created_at)}</div>
            <div>Atualizado: {fmt(process.updated_at)}</div>
          </div>
        </div>
      </header>

      <ProcessForm initial={process} action={action} submitLabel="⟶ Salvar alterações" />
    </div>
  );
}

function fmt(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
