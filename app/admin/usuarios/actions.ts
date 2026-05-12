"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
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

  const admin = adminClient();

  const {
    data: { users },
  } = await admin.auth.admin.listUsers();

  if (users.some((u) => u.user_metadata?.username === username))
    return { error: "Este nome de usuário já está em uso." };

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    user_metadata: { username },
    email_confirm: true,
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered"))
      return { error: "Já existe um usuário com este e-mail." };
    return { error: error.message };
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

  const admin = adminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return {};
}
