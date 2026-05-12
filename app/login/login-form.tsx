"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Busca email pelo username via API route (chave secreta fica no servidor)
      const res = await fetch("/api/auth/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok || data.error) {
        setError(data.error ?? `Erro ${res.status}`);
        return;
      }

      // Autenticação com o Supabase browser client
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });

      if (authError) {
        const m = authError.message.toLowerCase();
        setError(
          m.includes("invalid")
            ? "Usuário ou senha incorretos."
            : authError.message,
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <label className="field">
        <span className="field-label">Usuário</span>
        <input
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="nome.usuario"
          className="field-input field-mono"
        />
      </label>

      <label className="field">
        <span className="field-label">Senha</span>
        <input
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
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

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Verificando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
