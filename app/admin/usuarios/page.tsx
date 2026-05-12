import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UsersList } from "./users-list";

export const dynamic = "force-dynamic";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export default async function UsuariosPage() {
  const admin = adminClient();
  const supabase = await createClient();

  const [
    {
      data: { users },
    },
    {
      data: { user: currentUser },
    },
  ] = await Promise.all([
    admin.auth.admin.listUsers(),
    supabase.auth.getUser(),
  ]);

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    username: (u.user_metadata?.username as string) ?? "—",
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
