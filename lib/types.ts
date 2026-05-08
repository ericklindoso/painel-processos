export type Process = {
  id: string;
  numero: string;
  objeto: string;
  status: string;
  cor: string;
  created_at: string;
  updated_at: string;
};

export type ProcessInput = {
  numero: string;
  objeto: string;
  status: string;
  cor: string;
};

export type ProcessEventType = "created" | "status_changed" | "updated" | "deleted";

export type ProcessEvent = {
  id: string;
  process_id: string | null;
  process_numero: string;
  process_objeto: string;
  event_type: ProcessEventType;
  actor_email: string | null;
  old_status: string | null;
  new_status: string | null;
  old_cor: string | null;
  new_cor: string | null;
  created_at: string;
};
