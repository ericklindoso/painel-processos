"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "./actions";

export function UserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await createUser(new FormData(e.currentTarget));
      if (result?.error) setError(result.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <label className="field">
        <span className="field-label">Nome de usuário</span>
        <input
          name="username"
          type="text"
          required
          autoComplete="off"
          placeholder="nome.sobrenome"
          className="field-input field-mono"
        />
      </label>

      <label className="field">
        <span className="field-label">E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="usuario@dominio.com"
          className="field-input field-mono"
        />
      </label>

      <label className="field">
        <span className="field-label">Senha</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="•••••••••"
          className="field-input field-mono"
        />
      </label>

      {error && (
        <div className="border-l-2 border-[--color-claret] bg-[--color-claret-soft]/30 px-4 py-3 text-sm text-[--color-claret]">
          {error}
        </div>
      )}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Criando..." : "Criar usuário"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-text"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
