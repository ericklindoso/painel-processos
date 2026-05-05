"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Process } from "@/lib/types";
import { FlapText } from "./flap";

const ROWS_PER_PAGE = 6;
const PAGE_DURATION_MS = 7000;
const LAST_UPDATES_DURATION_MS = 9000;
const NUMERO_LEN = 14;
const OBJETO_LEN = 38;
const STATUS_LEN = 16;

export function Board({ initial }: { initial: Process[] }) {
  const [processes, setProcesses] = useState<Process[]>(initial);
  const [pageIndex, setPageIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  // Hydrate clock client-side only to avoid SSR mismatch
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-processes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "processes" },
        async () => {
          const { data } = await supabase
            .from("processes")
            .select("*")
            .order("updated_at", { ascending: false });
          if (data) setProcesses(data as Process[]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Sort by updated_at desc for "last updates" view, by numero for board
  const boardSorted = useMemo(
    () => [...processes].sort((a, b) => a.numero.localeCompare(b.numero)),
    [processes],
  );
  const recent = useMemo(
    () =>
      [...processes]
        .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
        .slice(0, 5),
    [processes],
  );

  const pages = useMemo(() => {
    const chunks: Process[][] = [];
    for (let i = 0; i < boardSorted.length; i += ROWS_PER_PAGE) {
      chunks.push(boardSorted.slice(i, i + ROWS_PER_PAGE));
    }
    if (chunks.length === 0) chunks.push([]); // ensure at least one main page
    return chunks;
  }, [boardSorted]);

  const totalPages = pages.length + 1; // + last-updates page

  // Reset page index if data shrinks
  useEffect(() => {
    if (pageIndex >= totalPages) setPageIndex(0);
  }, [totalPages, pageIndex]);

  // Auto-rotate
  useEffect(() => {
    const isLast = pageIndex === pages.length;
    const duration = isLast ? LAST_UPDATES_DURATION_MS : PAGE_DURATION_MS;
    const timer = window.setTimeout(() => {
      setPageIndex((p) => (p + 1) % totalPages);
    }, duration);
    return () => clearTimeout(timer);
  }, [pageIndex, pages.length, totalPages]);

  const isLastUpdates = pageIndex === pages.length;
  const currentPage = isLastUpdates ? null : pages[pageIndex];

  // Build rows for the board: pad to ROWS_PER_PAGE so layout doesn't jump
  const visibleRows: (Process | null)[] = isLastUpdates
    ? []
    : Array.from({ length: ROWS_PER_PAGE }, (_, i) => currentPage?.[i] ?? null);

  return (
    <div className="relative min-h-screen overflow-hidden flap-board">
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Top header */}
      <header className="relative z-10 flex items-end justify-between px-8 pb-3 pt-6 border-b border-[--color-panel-line]/60">
        <div className="flex items-center gap-4">
          <span className="pulse-led h-2.5 w-2.5 rounded-full bg-[--color-amber]" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-amber]">
              ⟶ Painel de Processos · Em tempo real
            </p>
            <h1 className="font-display text-4xl font-black uppercase leading-none text-[--color-cream] sm:text-5xl">
              Acompanhamento Administrativo
            </h1>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-ink-dim]">
            {now ? formatDate(now) : "—"}
          </div>
          <div className="font-mono text-3xl font-bold leading-none text-[--color-amber] sm:text-4xl">
            {now ? formatTime(now) : "00:00:00"}
          </div>
        </div>
      </header>

      {/* Column headers — only on board pages */}
      {!isLastUpdates && (
        <div className="relative z-10 grid grid-cols-[1.2fr_2.8fr_1.4fr_0.8fr] items-center gap-6 border-b border-[--color-panel-line]/60 bg-[--color-panel]/60 px-8 py-2 font-mono text-[10px] uppercase tracking-[0.45em] text-[--color-amber]">
          <span>⟶ Nº Processo</span>
          <span>Objeto</span>
          <span>Status</span>
          <span className="text-right">Atualizado</span>
        </div>
      )}

      {/* Page content */}
      <main className="relative z-10 px-8 py-4">
        {isLastUpdates ? (
          <LastUpdatesPanel rows={recent} />
        ) : (
          <BoardPanel rows={visibleRows} />
        )}
      </main>

      {/* Footer / pagination & ticker */}
      <footer className="absolute inset-x-0 bottom-0 z-10 border-t border-[--color-panel-line]/60 bg-[--color-bg]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-8 py-3">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-ink-dim]">
              Tela {String(pageIndex + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
            <PageDots count={totalPages} active={pageIndex} />
          </div>

          <div className="ticker-mask flex-1 overflow-hidden">
            <div className="scroll-marquee flex gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
              {Array.from({ length: 2 }).map((_, k) => (
                <span key={k} className="flex items-center gap-12">
                  <span>⟶ Painel oficial · transmissão contínua</span>
                  <span className="text-[--color-amber]">●</span>
                  <span>Total de processos: {processes.length}</span>
                  <span className="text-[--color-amber]">●</span>
                  <span>Atualização automática · supabase realtime</span>
                  <span className="text-[--color-amber]">●</span>
                  <span>Estação: telão público</span>
                  <span className="text-[--color-amber]">●</span>
                </span>
              ))}
            </div>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-ink-dim]">
            BRT
          </span>
        </div>
      </footer>
    </div>
  );
}

function BoardPanel({ rows }: { rows: (Process | null)[] }) {
  if (rows.every((r) => r === null)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="pulse-led h-2.5 w-2.5 rounded-full bg-[--color-amber]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.45em] text-[--color-amber]">
            ⟶ Aguardando dados
          </span>
        </div>
        <h2 className="font-display text-7xl font-black uppercase text-[--color-cream]">
          Nenhum processo ativo
        </h2>
        <p className="font-serif text-2xl italic text-[--color-ink-dim]">
          Os cadastros aparecem aqui em tempo real assim que forem registrados.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 pb-20">
      {rows.map((row, i) => (
        <li
          key={i}
          className="row-enter grid grid-cols-[1.2fr_2.8fr_1.4fr_0.8fr] items-center gap-6 border-b border-[--color-panel-line]/40 bg-black/20 px-3 py-3"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <FlapText
            value={row?.numero ?? ""}
            length={NUMERO_LEN}
            size="md"
            color="var(--color-cream)"
          />
          <FlapText
            value={row?.objeto ?? ""}
            length={OBJETO_LEN}
            size="sm"
            color="var(--color-ink)"
            staggerMs={15}
          />
          <span className="flex items-center gap-3">
            {row && (
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: row.cor, boxShadow: `0 0 14px ${row.cor}` }}
              />
            )}
            <FlapText
              value={row?.status ?? ""}
              length={STATUS_LEN}
              size="md"
              color={row?.cor ?? "var(--color-amber)"}
              staggerMs={28}
            />
          </span>
          <span className="text-right font-mono text-xs uppercase tracking-[0.2em] text-[--color-ink-dim]">
            {row ? formatRelative(row.updated_at) : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LastUpdatesPanel({ rows }: { rows: Process[] }) {
  return (
    <div className="fade-in pb-24 pt-2">
      <div className="mb-6 flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[--color-amber]">
          ⟶ Tela final do ciclo
        </p>
        <h2 className="flex items-baseline gap-4 font-display text-6xl font-black uppercase leading-none text-[--color-cream] sm:text-7xl">
          Últimas
          <span className="font-serif italic font-normal text-[--color-amber]">atualizações</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-[--color-panel-line] py-20 text-center">
          <p className="font-serif text-2xl italic text-[--color-ink-dim]">
            Nenhuma modificação registrada ainda.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {rows.map((p, i) => (
            <li
              key={p.id}
              className="row-enter grid grid-cols-[60px_1.1fr_2.6fr_1.4fr_140px] items-center gap-5 border-l-4 bg-black/30 px-5 py-4"
              style={{
                animationDelay: `${i * 120}ms`,
                borderColor: p.cor,
              }}
            >
              <span className="font-display text-4xl font-black text-[--color-amber]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <FlapText
                value={p.numero}
                length={NUMERO_LEN}
                size="md"
                color="var(--color-cream)"
              />
              <FlapText
                value={p.objeto}
                length={OBJETO_LEN}
                size="sm"
                color="var(--color-ink)"
                staggerMs={12}
              />
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: p.cor, boxShadow: `0 0 12px ${p.cor}` }}
                />
                <FlapText
                  value={p.status}
                  length={STATUS_LEN}
                  size="md"
                  color={p.cor}
                  staggerMs={22}
                />
              </span>
              <span className="text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
                {formatFullDate(p.updated_at)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function PageDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1 transition-all ${
            i === active ? "w-6 bg-[--color-amber]" : "w-3 bg-[--color-panel-line]"
          }`}
        />
      ))}
    </div>
  );
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

function formatDate(d: Date) {
  const day = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
  return day.replace(/\./g, "").toUpperCase();
}

function formatFullDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatRelative(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(h / 24);
  return `${d} d`;
}
