-- Adiciona coluna tags para classificar processos visualmente
ALTER TABLE processes ADD COLUMN IF NOT EXISTS tags jsonb NOT NULL DEFAULT '[]'::jsonb;
