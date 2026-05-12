import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const { username } = JSON.parse(body || "{}");

    if (!username) {
      return NextResponse.json({ error: "Usuário obrigatório." }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceKey || !supabaseUrl) {
      return NextResponse.json({ error: "Configuração ausente." }, { status: 500 });
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Erro Supabase: ${res.status} ${errText}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const users: { email: string; user_metadata?: { username?: string } }[] =
      data.users ?? [];

    const user = users.find((u) => u.user_metadata?.username === username);
    if (!user?.email) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ email: user.email });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 });
  }
}
