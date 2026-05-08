import { createClient } from "@/lib/supabase/server";
import type { Process, ProcessEvent } from "@/lib/types";
import { Board } from "./board";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: processes }, { data: events }] = await Promise.all([
    supabase.from("processes").select("*").order("updated_at", { ascending: false }),
    supabase
      .from("process_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <Board
      initial={(processes as Process[] | null) ?? []}
      initialEvents={(events as ProcessEvent[] | null) ?? []}
    />
  );
}
