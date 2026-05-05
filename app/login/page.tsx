import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Decorative background board */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
        <div className="font-display text-[28vw] font-black leading-none tracking-tight text-[--color-amber] select-none">
          ACESSO
        </div>
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[1fr_minmax(420px,520px)]">
        {/* Left editorial column */}
        <aside className="relative hidden flex-col justify-between border-r border-[--color-panel-line] p-12 lg:flex">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim] hover:text-[--color-amber]"
          >
            ◀ voltar à entrada
          </Link>

          <div className="space-y-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-amber]">
              ⟶ Sistema de Acompanhamento
            </p>
            <h1 className="font-display text-7xl font-black uppercase leading-[0.85] text-[--color-cream]">
              Painel de
              <br />
              <span className="italic font-serif font-normal text-[--color-amber]">processos</span>
              <br />
              administrativos.
            </h1>
            <p className="max-w-md font-serif text-2xl italic leading-snug text-[--color-ink-dim]">
              Um cofre discreto. Apenas quem cadastra, edita. Qualquer um observa pelo telão.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[--color-panel-line] pt-6">
            <div className="flex items-center gap-3">
              <span className="pulse-led h-2 w-2 rounded-full bg-[--color-amber]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
                conexão segura
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
              tls · supabase
            </span>
          </div>
        </aside>

        {/* Right form column */}
        <section className="relative flex flex-col justify-center bg-[--color-panel] p-8 sm:p-12">
          <div className="absolute inset-0 grain" />
          <div className="relative">
            <Link
              href="/"
              className="mb-8 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim] hover:text-[--color-amber] lg:hidden"
            >
              ◀ voltar
            </Link>

            <div className="mb-10 flex items-center gap-3">
              <div className="h-10 w-1 bg-[--color-amber]" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-amber]">
                  estação 01 · admin
                </p>
                <h2 className="font-display text-4xl font-black uppercase text-[--color-cream]">
                  Identifique-se
                </h2>
              </div>
            </div>

            <LoginForm />

            <p className="mt-10 border-t border-[--color-panel-line] pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[--color-ink-mute]">
              dashboard público em <Link href="/dashboard" className="text-[--color-amber] hover:underline">/dashboard</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
