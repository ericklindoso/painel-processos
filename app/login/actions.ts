"use server";

export async function lookupEmail(
  username: string,
): Promise<{ email: string } | { error: string }> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

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

  return { email: user.email };
}
