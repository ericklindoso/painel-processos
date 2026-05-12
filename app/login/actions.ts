"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithUsername(
  username: string,
  password: string,
): Promise<{ error: string }> {
  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const {
    data: { users },
    error: listError,
  } = await admin.auth.admin.listUsers();

  if (listError) return { error: "Erro ao autenticar. Tente novamente." };

  const user = users.find((u) => u.user_metadata?.username === username);
  if (!user?.email) return { error: "Usuário não encontrado." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("invalid")) return { error: "Usuário ou senha incorretos." };
    return { error: error.message };
  }

  redirect("/admin");
}
