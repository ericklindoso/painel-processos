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
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="flex items-center gap-6 border-b border-[--color-rule] pb-3">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={`relative pb-2 font-sans text-sm font-medium transition ${
              mode === m
                ? "text-[--color-ink]"
                : "text-[--color-ink-mute] hover:text-[--color-ink]"
            }`}
          >
            {m === "signin" ? "Entrar" : "Criar conta"}
            {mode === m && (
              <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[--color-claret]" />
            )}
          </button>
        ))}
      </div>

      <label className="field">
        <span className="field-label">E-mail</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@dominio.com"
          className="field-input field-mono"
        />
      </label>

      <label className="field">
        <span className="field-label">Senha</span>
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••••"
          className="field-input field-mono"
        />
      </label>

      {error && (
        <div className="border-l-2 border-[--color-claret] bg-[--color-claret-soft]/30 px-4 py-3 text-sm text-[--color-claret]">
          {error}
        </div>
      )}
      {info && (
        <div className="border-l-2 border-[--color-emerald] bg-[--color-emerald]/10 px-4 py-3 text-sm text-[--color-emerald]">
          {info}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Processando..." : mode === "signin" ? "Entrar no painel" : "Criar conta"}
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
