import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 grain" />

      <header className="sticky top-0 z-50 border-b border-[--color-panel-line] bg-[--color-bg]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="group flex items-center gap-3">
              <span className="pulse-led h-2 w-2 rounded-full bg-[--color-amber]" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-ink-dim] group-hover:text-[--color-amber]">
                  Estação 01
                </div>
                <div className="font-display text-xl font-black uppercase leading-none text-[--color-cream]">
                  Painel · Admin
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 border-l border-[--color-panel-line] pl-6 md:flex">
              <Link
                href="/admin"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-[--color-ink-dim] hover:text-[--color-amber]"
              >
                Processos
              </Link>
              <Link
                href="/dashboard"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-[--color-ink-dim] hover:text-[--color-amber]"
              >
                Telão ↗
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim] md:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button type="submit" className="btn btn-ghost text-xs">
                ⟶ Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative">{children}</main>

      <footer className="border-t border-[--color-panel-line] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-mute]">
            Painel de Processos · Admin
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-mute]">
            ⟶ Mantenha o telão sempre aberto
          </span>
        </div>
      </footer>
    </div>
  );
}
