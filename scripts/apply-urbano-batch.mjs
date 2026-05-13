import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inbcgaoexhnrcjqrqtsc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const URBANO_TAG = { label: "URBANO", color: "#0062FF" };

async function apply() {
  const { data: all, error } = await supabase
    .from("processes")
    .select("id, numero, tags");

  if (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }

  let ok = 0;
  let skipped = 0;
  for (const proc of all) {
    const existingTags = Array.isArray(proc.tags) ? proc.tags : [];
    const hasRural = existingTags.some(
      (t) => t.label?.toUpperCase() === "RURAL",
    );
    const hasUrbano = existingTags.some(
      (t) => t.label?.toUpperCase() === "URBANO",
    );

    if (hasRural || hasUrbano) {
      skipped++;
      continue;
    }

    const newTags = [...existingTags, URBANO_TAG];
    const { error: updErr } = await supabase
      .from("processes")
      .update({ tags: newTags })
      .eq("id", proc.id);

    if (updErr) {
      console.log(`  ✗ ${proc.numero}: ${updErr.message}`);
    } else {
      console.log(`  ✓ ${proc.numero}`);
      ok++;
    }
  }

  console.log(`\n${ok} marcados como URBANO. ${skipped} pulados (já tinham RURAL ou URBANO).`);
}

apply();
