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
