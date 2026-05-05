import Link from "next/link";
import { ProcessForm } from "../process-form";
import { createProcess } from "../actions";

export default function NewProcessPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <header className="mb-10 border-b border-[--color-panel-line] pb-6">
        <Link
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim] hover:text-[--color-amber]"
        >
          ◀ voltar à lista
        </Link>
        <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none text-[--color-cream] sm:text-6xl">
          Novo<span className="text-[--color-amber]">.</span>
        </h1>
        <p className="mt-2 max-w-lg font-serif text-lg italic text-[--color-ink-dim]">
          Cadastre um novo processo. Ele aparece no telão imediatamente.
        </p>
      </header>

      <ProcessForm action={createProcess} submitLabel="⟶ Cadastrar" />
    </div>
  );
}
