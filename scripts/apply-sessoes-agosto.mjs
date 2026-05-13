import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inbcgaoexhnrcjqrqtsc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Datas em horário de Brasília (UTC-3). new Date com -03:00 converte para UTC.
function brt(year, month, day, hour, minute = 0) {
  return new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-03:00`,
  ).toISOString();
}

const updates = [
  { numero: "202511012405715", data: brt(2026, 8, 18, 10, 0) },
  { numero: "202511012406156", data: brt(2026, 8, 18, 10, 30) },
  { numero: "202511012406157", data: brt(2026, 8, 18, 11, 0) },
  { numero: "202511012406221", data: brt(2026, 8, 18, 14, 30) },
  { numero: "202511012406210", data: brt(2026, 8, 18, 15, 0) },
  { numero: "202511012406255", data: brt(2026, 8, 18, 15, 30) },
  { numero: "202511012406212", data: brt(2026, 8, 18, 16, 0) },
  { numero: "20261112400009", data: brt(2026, 8, 19, 10, 0) },
  { numero: "202511012406213", data: brt(2026, 8, 19, 10, 30) },
  { numero: "202511012406348", data: brt(2026, 8, 19, 11, 0) },
  { numero: "202511012406292", data: brt(2026, 8, 19, 14, 30) },
  { numero: "202511012406281", data: brt(2026, 8, 19, 15, 0) },
  { numero: "20261112400032", data: brt(2026, 8, 19, 15, 30) },
  { numero: "20261112400064", data: brt(2026, 8, 19, 16, 0) },
  { numero: "20261112400033", data: brt(2026, 8, 20, 10, 0) },
  { numero: "20261112400115", data: brt(2026, 8, 20, 10, 30) },
  { numero: "20261112400036", data: brt(2026, 8, 20, 11, 0) },
  { numero: "20261112400037", data: brt(2026, 8, 20, 14, 30) },
  { numero: "20261112400038", data: brt(2026, 8, 20, 15, 0) },
  { numero: "20261112401637", data: brt(2026, 8, 20, 15, 30) },
  { numero: "20261112401847", data: brt(2026, 8, 20, 16, 0) },
  { numero: "20261112401835", data: brt(2026, 8, 21, 10, 0) },
  { numero: "20261112401848", data: brt(2026, 8, 21, 10, 30) },
  { numero: "20261112401644", data: brt(2026, 8, 21, 11, 0) },
  { numero: "20261112401680", data: brt(2026, 8, 21, 14, 30) },
  { numero: "20261112401356", data: brt(2026, 8, 21, 15, 0) },
  { numero: "20261112401784", data: brt(2026, 8, 21, 15, 30) },
  { numero: "20261112401632", data: brt(2026, 8, 21, 16, 0) },
];

async function apply() {
  const { data: current, error } = await supabase
    .from("processes")
    .select("id, numero")
    .in("numero", updates.map((u) => u.numero));

  if (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }

  const byNumero = Object.fromEntries(current.map((p) => [p.numero, p.id]));
  const notFound = updates.filter((u) => !byNumero[u.numero]);
  if (notFound.length) {
    console.log("Processos NÃO encontrados no banco:");
    notFound.forEach((u) => console.log(`  ✗ ${u.numero}`));
  }

  let ok = 0;
  for (const u of updates) {
    const id = byNumero[u.numero];
    if (!id) continue;

    const { error: updErr } = await supabase
      .from("processes")
      .update({ data_sessao: u.data })
      .eq("id", id);

    if (updErr) {
      console.log(`  ✗ ${u.numero}: ${updErr.message}`);
    } else {
      console.log(`  ✓ ${u.numero} — ${u.data}`);
      ok++;
    }
  }

  console.log(`\n${ok}/${updates.length} processos atualizados.`);
}

apply();
