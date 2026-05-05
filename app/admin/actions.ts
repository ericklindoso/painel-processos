"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const COLOR_FALLBACK = "#1F2937";

function sanitizeColor(c: string | null | undefined): string {
  if (!c) return COLOR_FALLBACK;
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c.toUpperCase() : COLOR_FALLBACK;
}

export async function createProcess(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const numero = String(formData.get("numero") ?? "").trim();
  const objeto = String(formData.get("objeto") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const cor = sanitizeColor(String(formData.get("cor") ?? ""));

  if (!numero || !objeto || !status) {
    return { ok: false as const, error: "Preencha número, objeto e status." };
  }

  const { error } = await supabase
    .from("processes")
    .insert({ numero, objeto, status, cor });

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "Já existe um processo com esse número." };
    }
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin");
}

export async function updateProcess(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const numero = String(formData.get("numero") ?? "").trim();
  const objeto = String(formData.get("objeto") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const cor = sanitizeColor(String(formData.get("cor") ?? ""));

  if (!numero || !objeto || !status) {
    return { ok: false as const, error: "Preencha número, objeto e status." };
  }

  const { error } = await supabase
    .from("processes")
    .update({ numero, objeto, status, cor })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "Já existe um processo com esse número." };
    }
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin");
}

export async function deleteProcess(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("processes").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
