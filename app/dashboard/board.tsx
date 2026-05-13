"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Process, ProcessEvent, ProcessEventType } from "@/lib/types";

const ROWS_PER_PAGE = 6;
const PAGE_DURATION_MS = 7500;
const LAST_UPDATES_DURATION_MS = 10000;

const TRANSITION = { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const };

const EVENT_LABELS: Record<ProcessEventType, string> = {
  created: "criação",
  status_changed: "mudança de status",
  updated: "atualização",
  deleted: "remoção",
};

export function Board({
  initial,
  initialEvents,
}: {
  initial: Process[];
  initialEvents: ProcessEvent[];
}) {
  const [processes, setProcesses] = useState<Process[]>(initial);
  const [events, setEvents] = useState<ProcessEvent[]>(initialEvents);
  const [pageIndex, setPageIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  // Hydrate clock client-side only
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Realtime: processes
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

  // Realtime: events
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "process_events" },
        async () => {
          const { data } = await supabase
            .from("process_events")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);
          if (data) setEvents(data as ProcessEvent[]);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const boardSorted = useMemo(
    () => [...processes].sort((a, b) => a.numero.localeCompare(b.numero)),
    [processes],
  );

  const pages = useMemo(() => {
    const chunks: Process[][] = [];
    for (let i = 0; i < boardSorted.length; i += ROWS_PER_PAGE) {
      chunks.push(boardSorted.slice(i, i + ROWS_PER_PAGE));
    }
    if (chunks.length === 0) chunks.push([]);
    return chunks;
  }, [boardSorted]);

  const totalPages = pages.length + 1;

  useEffect(() => {
    if (pageIndex >= totalPages) setPageIndex(0);
  }, [totalPages, pageIndex]);

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

  return (
    <div className="board-paper relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Top header */}
      <header className="relative z-10 border-b border-[--color-rule] px-12 py-6">
        <div className="flex items-end justify-between gap-8">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-4xl italic text-[--color-claret]">§</span>
            <div>
              <div className="flex items-center gap-3">
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[--color-claret]">
                  <span className="live-dot absolute inset-0 rounded-full" />
                </span>
                <p className="label-eyebrow text-[--color-claret]">
                  Em transmissão · Atualização contínua
                </p>
              </div>
              <h1 className="headline mt-1.5 text-4xl text-[--color-ink] sm:text-5xl">
                Acompanhamento de <em>processos</em>.
              </h1>
            </div>
          </div>

          <div className="text-right">
            <div className="label-eyebrow">{now ? formatDate(now) : "—"}</div>
            <div className="font-serif text-5xl tabular text-[--color-ink] sm:text-6xl">
              {now ? formatTime(now) : "—— : ——"}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-hidden px-12 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={TRANSITION}
          >
            {isLastUpdates ? (
              <LastUpdatesPanel events={events} />
            ) : (
              <BoardPanel rows={currentPage ?? []} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[--color-rule] bg-[--color-paper-soft]/80 px-12 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="label-eyebrow">
              Tela{" "}
              <span className="font-mono text-[--color-claret]">
                {String(pageIndex + 1).padStart(2, "0")}
              </span>{" "}
              / {String(totalPages).padStart(2, "0")}
            </span>
            <PageIndicator count={totalPages} active={pageIndex} />
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <span className="label-eyebrow">
              Total · <span className="text-[--color-ink] tabular">{processes.length}</span>
            </span>
            <span className="label-eyebrow">
              {isLastUpdates ? "Sumário das últimas modificações" : "Listagem geral"}
            </span>
          </div>

          <span className="label-eyebrow">
            <span className="hidden sm:inline">Brasília · </span>BRT
          </span>
        </div>
      </footer>
    </div>
  );
}

function BoardPanel({ rows }: { rows: Process[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-5 text-center">
        <p className="label-eyebrow text-[--color-claret]">Aguardando registros</p>
        <h2 className="headline text-6xl text-[--color-ink]">
          Nenhum <em>processo</em> em acompanhamento.
        </h2>
        <p className="max-w-xl font-serif text-xl italic text-[--color-ink-dim]">
          Os cadastros aparecem aqui em tempo real assim que forem registrados pelo painel
          administrativo.
        </p>
      </div>
    );
  }

  const padded: (Process | null)[] = Array.from(
    { length: ROWS_PER_PAGE },
    (_, i) => rows[i] ?? null,
  );

  return (
    <div>
      <div className="grid grid-cols-[200px_1fr_360px_140px] items-end gap-8 border-b border-[--color-ink] pb-2 text-sm font-medium uppercase tracking-[0.18em] text-[--color-ink-dim]">
        <span>Nº Processo</span>
        <span>Objeto</span>
        <span>Status</span>
        <span className="text-right">Atualizado</span>
      </div>

      <ul className="board-rows">
        {padded.map((row, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TRANSITION, delay: 0.08 + i * 0.06 }}
            className="grid grid-cols-[200px_1fr_360px_140px] items-center gap-8 py-5"
          >
            {row ? (
              <>
                <span className="font-mono text-xl font-medium text-[--color-ink] tabular">
                  {row.numero}
                </span>
                <span
                  className="truncate font-serif text-3xl leading-snug text-[--color-ink]"
                  title={row.objeto}
                >
                  {row.objeto}
                </span>
                <span className="flex items-center gap-3">
                  <span className="color-chip" style={{ color: row.cor }} />
                  <span
                    className="truncate font-sans text-lg font-medium uppercase tracking-wide"
                    style={{ color: row.cor }}
                  >
                    {row.status}
                  </span>
                </span>
                <span className="text-right font-mono text-sm uppercase tracking-wide text-[--color-ink-dim]">
                  {formatRelative(row.updated_at)}
                </span>
              </>
            ) : (
              <span className="col-span-4 h-8" />
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function StatusPill({ status, cor }: { status: string; cor?: string | null }) {
  if (cor) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-sans text-sm font-medium uppercase tracking-wide"
        style={{
          color: cor,
          backgroundColor: `${cor}18`,
          borderColor: `${cor}40`,
        }}
      >
        <span
          className="h-1.5 w-1.5 flex-none rounded-full"
          style={{ backgroundColor: cor }}
        />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded border border-[--color-rule] bg-[--color-paper-warm] px-2 py-0.5 font-sans text-sm font-medium uppercase tracking-wide text-[--color-ink-dim]">
      {status}
    </span>
  );
}

function buildNarrative(event: ProcessEvent) {
  const numEl = (
    <span className="font-mono font-medium text-[--color-ink]">{event.process_numero}</span>
  );
  const obj =
    event.process_objeto.length > 80
      ? event.process_objeto.slice(0, 80) + "…"
      : event.process_objeto;

  switch (event.event_type) {
    case "created":
      return (
        <>
          Processo {numEl} cadastrado. Status inicial:{" "}
          <StatusPill status={event.new_status ?? "—"} cor={event.new_cor} />.
        </>
      );
    case "status_changed":
      return (
        <>
          O processo {numEl} — {obj} — teve seu status alterado de{" "}
          <StatusPill status={event.old_status ?? "—"} /> para{" "}
          <StatusPill status={event.new_status ?? "—"} cor={event.new_cor} />.
        </>
      );
    case "updated":
      return <>Os dados do processo {numEl} foram atualizados.</>;
    case "deleted":
      return (
        <>
          O processo {numEl} — {obj} — foi removido do sistema.
        </>
      );
  }
}

function actorDisplay(email: string): string {
  const [local, domain] = email.split("@");
  const org = domain?.split(".")[0] ?? "";
  return org ? `${local} (${org.toUpperCase()})` : local;
}

function LastUpdatesPanel({ events }: { events: ProcessEvent[] }) {
  const shown = events.slice(0, 5);

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <p className="label-eyebrow text-[--color-claret]">Sumário do ciclo</p>
          <h2 className="headline text-3xl text-[--color-ink]">
            Últimas <em>atualizações</em>.
          </h2>
        </div>
        <p className="hidden font-serif text-sm italic text-[--color-ink-dim] sm:block">
          Cinco mais recentes — ordem decrescente.
        </p>
      </div>

      {shown.length === 0 ? (
        <div className="border-y-2 border-double border-[--color-rule] py-20 text-center">
          <p className="font-serif text-2xl italic text-[--color-ink-dim]">
            Nenhuma modificação registrada ainda.
          </p>
        </div>
      ) : (
        <>
          <ol className="border-t border-[--color-ink]">
            {shown.map((ev, i) => (
              <motion.li
                key={ev.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRANSITION, delay: 0.15 + i * 0.13 }}
                className="grid grid-cols-[60px_1fr_160px] items-start gap-6 border-b border-[--color-rule-soft] py-3"
              >
                {/* Index + tempo relativo */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-serif text-2xl italic leading-none text-[--color-claret]">
                    {romanize(i + 1)}.
                  </span>
                  <span className="label-eyebrow text-[--color-ink-mute]">
                    {formatRelative(ev.created_at)}
                  </span>
                </div>

                {/* Narrativa */}
                <div className="flex flex-col gap-1">
                  <p className="font-serif text-base leading-snug text-[--color-ink]">
                    {buildNarrative(ev)}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[--color-ink-mute]">
                    <span>{formatFullDate(ev.created_at)}</span>
                    {ev.actor_email && (
                      <>
                        <span>·</span>
                        <span>por {actorDisplay(ev.actor_email)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badge de tipo */}
                <div className="flex justify-end">
                  <span className="label-eyebrow rounded border border-[--color-rule] px-2 py-0.5 text-[--color-ink-dim]">
                    {EVENT_LABELS[ev.event_type]}
                  </span>
                </div>
              </motion.li>
            ))}
          </ol>

          {events.length > 0 && (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-ink-mute]">
              {Math.min(shown.length, 5)} de {events.length} atualizações no ciclo atual.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function PageIndicator({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-px transition-all ${
            i === active ? "w-8 bg-[--color-claret]" : "w-3 bg-[--color-rule-strong]"
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
    hour12: false,
  })
    .format(d)
    .replace(":", " : ");
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatFullDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

function romanize(n: number) {
  const map: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };
  return map[n] ?? String(n);
}
