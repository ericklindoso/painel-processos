"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithUsername(
  username: string,
  password: string,
): Promise<{ error: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) return { error: "Configuração de servidor ausente." };

  const res = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?per_page=1000`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );

  if (!res.ok) return { error: "Erro ao consultar usuários." };

  const data = await res.json();
  const users: { email: string; user_metadata?: { username?: string } }[] =
    data.users ?? [];

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
