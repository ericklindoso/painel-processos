import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grain" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between border-b border-[--color-panel-line] pb-6">
          <div className="flex items-center gap-3">
            <span className="pulse-led h-2 w-2 rounded-full bg-[--color-amber]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
              Sistema · Online · 24/7
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-[--color-ink-dim]">
            BRT · v1.0
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <p className="reveal-up font-mono text-[11px] uppercase tracking-[0.4em] text-[--color-amber]">
            ⟶ Painel de Processos
          </p>

          <h1
            className="reveal-up mt-4 font-display text-[clamp(3rem,11vw,9rem)] font-black uppercase leading-[0.85] text-[--color-cream]"
            style={{ animationDelay: "120ms" }}
          >
            Acompanhamento
            <br />
            <span className="text-[--color-amber]">Administrativo</span>
            <br />
            em tempo real.
          </h1>

          <p
            className="reveal-up mt-8 max-w-2xl font-serif text-2xl italic leading-snug text-[--color-ink-dim]"
            style={{ animationDelay: "240ms" }}
          >
            Um sistema discreto de cadastro, gestão e exibição rotativa de processos
            — projetado para o telão e para a sala.
          </p>

          <div className="reveal-up mt-12 flex flex-wrap items-center gap-4" style={{ animationDelay: "360ms" }}>
            <Link href="/dashboard" className="btn btn-primary">
              ⟶ Abrir Painel Telão
            </Link>
            <Link href="/admin" className="btn btn-ghost">
              Acessar Administração
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-px border-t border-[--color-panel-line] bg-[--color-panel-line] sm:grid-cols-3">
          {[
            { kbd: "01", title: "Cadastro", body: "Número, objeto e status — com cor associada para destaque visual." },
            { kbd: "02", title: "Painel /dashboard", body: "Rotação automática estilo split-flap, sem intervenção." },
            { kbd: "03", title: "Tempo real", body: "Atualizações instantâneas via Supabase Realtime." },
          ].map((card, i) => (
            <div
              key={card.kbd}
              className="reveal-up bg-[--color-bg] p-6"
              style={{ animationDelay: `${480 + i * 100}ms` }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-amber]">
                {card.kbd}
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold uppercase text-[--color-cream]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[--color-ink-dim]">
                {card.body}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
