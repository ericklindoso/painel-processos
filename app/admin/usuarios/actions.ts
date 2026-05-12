"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function adminHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function listAllUsers() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Falha ao listar usuários.");
  const data = await res.json();
  return data.users as { id: string; email: string; user_metadata?: { username?: string } }[];
}

export async function createUser(
  formData: FormData,
): Promise<{ error: string } | void> {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !email || !password)
    return { error: "Todos os campos são obrigatórios." };
  if (password.length < 6)
    return { error: "A senha deve ter no mínimo 6 caracteres." };

  const users = await listAllUsers().catch(() => null);
  if (!users) return { error: "Erro ao verificar usuários existentes." };

  if (users.some((u) => u.user_metadata?.username === username))
    return { error: "Este nome de usuário já está em uso." };

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      email,
      password,
      user_metadata: { username },
      email_confirm: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err.msg ?? err.message ?? "").toLowerCase();
    if (msg.includes("already registered"))
      return { error: "Já existe um usuário com este e-mail." };
    return { error: err.msg ?? err.message ?? "Erro ao criar usuário." };
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser?.id === userId)
    return { error: "Você não pode remover sua própria conta." };

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.msg ?? err.message ?? "Erro ao remover usuário." };
  }

  revalidatePath("/admin/usuarios");
  return {};
}
