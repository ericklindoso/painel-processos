"use client";

import { useState, useTransition } from "react";
import { deleteUser } from "./actions";

type UserRow = {
  id: string;
  email: string;
  username: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export function UsersList({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-[200px_1fr_180px_180px_100px] items-center gap-6 border-b border-[--color-ink] pb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[--color-ink-dim]">
        <span>Usuário</span>
        <span>E-mail</span>
        <span>Cadastrado</span>
        <span>Último acesso</span>
        <span className="text-right">Ações</span>
      </div>
      <ul>
        {users.map((u) => (
          <UserRowItem
            key={u.id}
            user={u}
            isCurrentUser={u.id === currentUserId}
          />
        ))}
      </ul>
    </div>
  );
}

function UserRowItem({
  user,
  isCurrentUser,
}: {
  user: UserRow;
  isCurrentUser: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <li
      className={`group grid grid-cols-[200px_1fr_180px_180px_100px] items-center gap-6 border-b border-[--color-rule-soft] py-5 transition hover:bg-[--color-paper-soft] ${
        pending ? "opacity-40" : ""
      }`}
    >
      <span className="flex items-center gap-2 font-mono text-sm font-medium text-[--color-ink]">
        {user.username}
        {isCurrentUser && (
          <span className="text-[10px] text-[--color-claret]">(você)</span>
        )}
      </span>
      <span
        className="truncate font-serif text-lg text-[--color-ink-dim]"
        title={user.email}
      >
        {user.email}
      </span>
      <span className="font-mono text-xs uppercase tracking-wide text-[--color-ink-dim]">
        {formatDate(user.created_at)}
      </span>
      <span className="font-mono text-xs uppercase tracking-wide text-[--color-ink-dim]">
        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "—"}
      </span>
      <span className="flex items-center justify-end gap-3">
        {error && (
          <span className="text-[10px] text-[--color-claret]">{error}</span>
        )}
        {!isCurrentUser && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className={`btn btn-danger text-xs ${
              confirming
                ? "border-b border-[--color-claret] text-[--color-claret]"
                : ""
            }`}
          >
            {confirming ? "Confirmar?" : "Excluir"}
          </button>
        )}
      </span>
    </li>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
