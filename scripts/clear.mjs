import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inbcgaoexhnrcjqrqtsc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clear() {
  console.log("Limpando process_events...");
  const { error: eventsError } = await supabase
    .from("process_events")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (eventsError) {
    console.error("Erro ao limpar events:", eventsError.message);
    process.exit(1);
  }

  console.log("Limpando processes...");
  const { error: processesError } = await supabase
    .from("processes")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (processesError) {
    console.error("Erro ao limpar processes:", processesError.message);
    process.exit(1);
  }

  console.log("Base de dados limpa com sucesso.");
}

clear();
