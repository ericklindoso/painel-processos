"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/admin");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.push("/admin");
          router.refresh();
        } else {
          setInfo("Conta criada. Verifique seu e-mail para confirmar e depois entre.");
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-1 border border-[--color-panel-line] p-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={`flex-1 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
              mode === m
                ? "bg-[--color-amber] text-[--color-bg]"
                : "text-[--color-ink-dim] hover:text-[--color-amber]"
            }`}
          >
            {m === "signin" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
          ⟶ E-mail
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@dominio.com"
          className="field-input"
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
          ⟶ Senha
        </span>
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="• • • • • •"
          className="field-input"
        />
      </label>

      {error && (
        <div className="border border-[--color-rust]/40 bg-[--color-rust]/10 p-3 font-mono text-xs text-[--color-rust]">
          ⚠ {error}
        </div>
      )}
      {info && (
        <div className="border border-[--color-amber]/40 bg-[--color-amber]/10 p-3 font-mono text-xs text-[--color-amber]">
          ✓ {info}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "processando..." : mode === "signin" ? "⟶ Entrar no painel" : "⟶ Criar conta"}
      </button>
    </form>
  );
}

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("user already registered")) return "Já existe uma conta com esse e-mail.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("password should be")) return "A senha deve ter no mínimo 6 caracteres.";
  return msg;
}
