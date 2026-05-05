"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Process } from "@/lib/types";
import { deleteProcess } from "./actions";

export function ProcessesList({ processes }: { processes: Process[] }) {
  return (
    <div className="overflow-hidden border border-[--color-panel-line]">
      {/* Header row */}
      <div className="grid grid-cols-[140px_1fr_180px_140px_140px] gap-4 border-b border-[--color-panel-line] bg-[--color-panel] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
        <span>Nº</span>
        <span>Objeto</span>
        <span>Status</span>
        <span>Atualizado</span>
        <span className="text-right">Ações</span>
      </div>

      <ul>
        {processes.map((p, i) => (
          <ProcessRow key={p.id} p={p} striped={i % 2 === 1} />
        ))}
      </ul>
    </div>
  );
}

function ProcessRow({ p, striped }: { p: Process; striped: boolean }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    startTransition(async () => {
      await deleteProcess(p.id);
    });
  }

  return (
    <li
      className={`grid grid-cols-[140px_1fr_180px_140px_140px] items-center gap-4 border-b border-[--color-panel-line]/50 px-5 py-4 transition hover:bg-[--color-amber]/[0.04] ${
        striped ? "bg-[--color-bg-elev]/30" : ""
      } ${pending ? "opacity-40" : ""}`}
    >
      <span className="truncate font-mono text-sm font-bold text-[--color-cream]">{p.numero}</span>
      <span className="truncate text-sm text-[--color-ink]" title={p.objeto}>
        {p.objeto}
      </span>
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full ring-1 ring-black/30"
          style={{ background: p.cor }}
        />
        <span
          className="truncate font-display text-base font-black uppercase tracking-wide"
          style={{ color: p.cor }}
        >
          {p.status}
        </span>
      </span>
      <span className="font-mono text-xs uppercase tracking-wide text-[--color-ink-dim]">
        {formatDate(p.updated_at)}
      </span>
      <span className="flex items-center justify-end gap-2">
        <Link
          href={`/admin/${p.id}/edit`}
          className="border border-[--color-panel-line] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-ink-dim] transition hover:border-[--color-amber] hover:text-[--color-amber]"
        >
          ✎ Editar
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
            confirming
              ? "bg-[--color-rust] text-[--color-cream]"
              : "border border-[--color-rust]/30 text-[--color-rust]/80 hover:border-[--color-rust] hover:text-[--color-rust]"
          }`}
        >
          {confirming ? "⚠ Confirmar" : "⊗ Excluir"}
        </button>
      </span>
    </li>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date} · ${time}`;
}
