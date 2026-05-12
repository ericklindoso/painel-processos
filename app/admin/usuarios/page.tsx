import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UsersList } from "./users-list";

export const dynamic = "force-dynamic";

type SupabaseUser = {
  id: string;
  email: string;
  user_metadata?: { username?: string };
  created_at: string;
  last_sign_in_at: string | null;
};

async function fetchAllUsers(): Promise<SupabaseUser[]> {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .replace(/^﻿/, "")
    .trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
    .replace(/^﻿/, "")
    .trim();

  if (!supabaseUrl || !serviceKey) return [];

  const res = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?per_page=1000`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    },
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.users ?? [];
}

export default async function UsuariosPage() {
  const supabase = await createClient();

  const [users, { data: { user: currentUser } }] = await Promise.all([
    fetchAllUsers(),
    supabase.auth.getUser(),
  ]);

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    username: u.user_metadata?.username ?? "—",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="label-eyebrow text-[--color-claret]">
            Controle de acesso
          </p>
          <h1 className="headline mt-2 text-5xl text-[--color-ink]">
            Usuários.
          </h1>
          <p className="mt-3 font-serif text-lg italic text-[--color-ink-dim]">
            {rows.length}{" "}
            {rows.length === 1 ? "usuário cadastrado" : "usuários cadastrados"}.
          </p>
        </div>
        <Link href="/admin/usuarios/new" className="btn btn-primary">
          + Novo usuário
        </Link>
      </div>

      <UsersList users={rows} currentUserId={currentUser?.id ?? ""} />
    </div>
  );
}
