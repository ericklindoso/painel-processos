import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inbcgaoexhnrcjqrqtsc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const RURAL_TAG = { label: "RURAL", color: "#0B8609" };

// Datas em horário de Brasília (UTC-3). +3h para virar UTC.
// Formato: YYYY-MM-DDTHH:MM:00-03:00 → toISOString
function brt(year, month, day, hour, minute = 0) {
  return new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-03:00`,
  ).toISOString();
}

const updates = [
  { numero: "202511012406228", data: brt(2026, 5, 19, 9, 30) },
  { numero: "202511012405521", data: brt(2026, 5, 19, 10, 30) },
  { numero: "202511012404930", data: brt(2026, 5, 19, 11, 30) },
  { numero: "202511012405528", data: brt(2026, 5, 19, 14, 30) },
  { numero: "202511012405988", data: brt(2026, 5, 19, 15, 30) },
  { numero: "202511012405599", data: brt(2026, 5, 19, 16, 30) },
  { numero: "202511012405557", data: brt(2026, 5, 20, 9, 30) },
  { numero: "202511012405558", data: brt(2026, 5, 20, 10, 30) },
  { numero: "202511012405716", data: brt(2026, 5, 20, 11, 30) },
  { numero: "202511012405717", data: brt(2026, 5, 20, 14, 30) },
  { numero: "202511012405943", data: brt(2026, 5, 20, 15, 30) },
  { numero: "202511012405944", data: brt(2026, 5, 20, 16, 30) },
  { numero: "202511012405945", data: brt(2026, 5, 20, 17, 0) },
  { numero: "202511012403356", data: brt(2026, 5, 21, 9, 30) },
  { numero: "202511012405942", data: brt(2026, 5, 21, 10, 30) },
];

async function apply() {
  // Busca tags atuais para preservar e só acrescentar RURAL se não houver
  const { data: current, error: fetchErr } = await supabase
    .from("processes")
    .select("id, numero, tags")
    .in(
      "numero",
      updates.map((u) => u.numero),
    );

  if (fetchErr) {
    console.error("Erro buscar:", fetchErr.message);
    process.exit(1);
  }

  const byNumero = Object.fromEntries(current.map((p) => [p.numero, p]));

  let ok = 0;
  for (const u of updates) {
    const proc = byNumero[u.numero];
    if (!proc) {
      console.log(`  ✗ ${u.numero} — processo não encontrado`);
      continue;
    }

    const existingTags = Array.isArray(proc.tags) ? proc.tags : [];
    const hasRural = existingTags.some(
      (t) => t.label?.toUpperCase() === "RURAL",
    );
    const newTags = hasRural ? existingTags : [...existingTags, RURAL_TAG];

    const { error } = await supabase
      .from("processes")
      .update({ data_sessao: u.data, tags: newTags })
      .eq("id", proc.id);

    if (error) {
      console.log(`  ✗ ${u.numero}: ${error.message}`);
    } else {
      console.log(`  ✓ ${u.numero} — ${u.data}`);
      ok++;
    }
  }

  console.log(`\n${ok}/${updates.length} processos atualizados.`);
}

apply();
