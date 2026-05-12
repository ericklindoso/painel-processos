"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithUsername } from "./actions";

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
      const result = await signInWithUsername(username.trim(), password);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
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
